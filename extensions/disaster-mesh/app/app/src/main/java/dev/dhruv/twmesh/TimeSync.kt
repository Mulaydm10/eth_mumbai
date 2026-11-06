// Tremor Witness Mesh — new code (not from bitchat/SafeMesh). GPL-3.0 as part of this app.
package dev.dhruv.twmesh

import android.content.Context
import android.os.SystemClock
import android.provider.Settings
import android.util.Log
import dev.dhruv.twmesh.chain.Hex
import dev.dhruv.twmesh.core.ClockFix
import dev.dhruv.twmesh.core.PeerSample
import dev.dhruv.twmesh.core.TimeKeeper
import dev.dhruv.twmesh.core.TimeWire
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.isActive
import kotlinx.coroutines.launch
import java.security.SecureRandom

/** What the home screen shows about the clock. */
data class ClockStatus(val source: String? = null, val hops: Int = 0, val errMs: Long? = null, val fixedAtWallMs: Long? = null)

/**
 * The phone's shared time for the quorum (BRIEF §5.2). Server time from /api/time when online, kept across restarts;
 * while offline, a signed one-hop NTP-style exchange with registered neighbours (math in core/ClockSync.kt, wire format
 * in core/TimeWire.kt). Every timestamp the mesh signs (tMs) comes from [now].
 */
object TimeSync {
    private const val TAG = "TwmTime"
    /** Ask neighbours when our error bound is above this (ms). */
    private const val WANT_ERR_MS = 100L
    private const val EXCHANGE_EVERY_MS = 120_000L
    private const val SERVER_EVERY_MS = 30 * 60_000L
    private const val ASKS_PER_ROUND = 4
    private const val ASK_GAP_MS = 400L
    private const val ANSWER_WAIT_MS = 2_500L

    private lateinit var app: Context
    private val scope = CoroutineScope(Dispatchers.Default + SupervisorJob())
    private val rnd = SecureRandom()
    /** Debug builds only (DebugRosterReceiver): pretend this phone's own wall clock is off by this much. */
    @Volatile internal var debugWallSkewMs = 0L
    val keeper = TimeKeeper({ SystemClock.elapsedRealtime() }, { System.currentTimeMillis() + debugWallSkewMs })
    private val _status = MutableStateFlow(ClockStatus())
    val status: StateFlow<ClockStatus> = _status

    private val pendingAsks = HashMap<String, Long>()               // nonce -> t1 (raw)
    private val samples = ArrayList<PeerSample>()
    private val answeredAt = ArrayDeque<Long>()                     // rate limit for our answers
    @Volatile private var lastServerSync = 0L
    @Volatile private var lastExchange = 0L

    fun init(ctx: Context) {
        if (::app.isInitialized) return
        app = ctx.applicationContext
        restore()
        scope.launch {
            delay(5_000)
            while (isActive) {
                val err = keeper.errMs()
                if (PhoneIdentity.get(app).site != null && (err == null || err > WANT_ERR_MS) &&
                    SystemClock.elapsedRealtime() - lastExchange >= EXCHANGE_EVERY_MS) exchange()
                publish()                                                   // the error bound grows with time
                delay(15_000)
            }
        }
    }

    fun now(): Long = keeper.now()

    // ---- server (Cristian's algorithm, best of 8 by lowest round trip, like the web app)
    fun syncServer(api: dev.dhruv.twmesh.chain.TwApi = dev.dhruv.twmesh.chain.TwApi()): ClockFix? = runCatching {
        val s = (0 until 8).map { val t0 = SystemClock.elapsedRealtime(); val t = api.serverTimeMs(); Triple(t0, t, SystemClock.elapsedRealtime()) }
        keeper.adoptServer(s)!!.also { lastServerSync = SystemClock.elapsedRealtime(); changed("server sync") }
    }.getOrNull()

    /** Called when a network appears: re-sync with the server if the last sync is old. */
    fun maybeSyncServer() { if (lastServerSync == 0L || SystemClock.elapsedRealtime() - lastServerSync > SERVER_EVERY_MS) syncServer() }

    // ---- mesh exchange
    /** Ask direct neighbours for their time a few times, then keep the best answer if it beats our own clock. */
    suspend fun exchange(): ClockFix? {
        val me = PhoneIdentity.get(app); val site = me.site ?: return null; val label = me.label ?: return null
        lastExchange = SystemClock.elapsedRealtime()
        synchronized(this) { samples.clear(); pendingAsks.clear() }
        repeat(ASKS_PER_ROUND) {
            val nonce = Hex.encode(ByteArray(8).also { rnd.nextBytes(it) }).removePrefix("0x")
            synchronized(this) { pendingAsks[nonce] = keeper.rawNow() }
            TwmBus.send(app, TimeWire.ask(nonce, site, label))
            delay(ASK_GAP_MS)
        }
        delay(ANSWER_WAIT_MS)
        val got = synchronized(this) { pendingAsks.clear(); ArrayList(samples).also { samples.clear() } }
        val fix = keeper.offerPeers(got)
        Log.i(TAG, "exchange: ${got.size} answers from ${got.map { it.peer }.distinct()}; " +
            (fix?.let { "now from ${it.source} (${it.hops} hop) ±${keeper.errMs()} ms" } ?: "kept own (±${keeper.errMs()} ms)"))
        if (fix != null) changed("mesh") else publish()
        return fix
    }

    /** A time packet from SafeMesh. Never relayed (returns false). */
    fun onReceive(payload: ByteArray, relays: Int): Boolean {
        val rawIn = keeper.rawNow(); val tIn = keeper.now()            // t4 (asker) / t2 (answerer): first thing
        if (!::app.isInitialized || relays > 0) return false
        val me = PhoneIdentity.get(app); val site = me.site ?: return false; val label = me.label ?: return false
        when (val m = TimeWire.parse(payload)) {
            is TimeWire.Ask -> {
                if (!m.site.equals(site, true) || m.from == label) return false
                if (keeper.fix == null) return false                     // we have no checked time to give
                synchronized(answeredAt) {
                    while (answeredAt.isNotEmpty() && rawIn - answeredAt.first() > 10_000) answeredAt.removeFirst()
                    if (answeredAt.size >= 20) return false
                    answeredAt.addLast(rawIn)
                }
                scope.launch {
                    val t3 = keeper.now(); val err = keeper.errMs() ?: return@launch; val hops = keeper.fix?.hops ?: return@launch
                    TwmBus.send(app, TimeWire.answer(site, label, me.address, m, tIn, t3, err, hops) { me.signMessage(it) })
                }
            }
            is TimeWire.Answer -> {
                if (m.to != label || !m.site.equals(site, true)) return false
                val t1 = synchronized(this) { pendingAsks[m.nonce] } ?: return false
                val signer = m.signer()
                val roster = RosterStore.get(app).load(site)
                if (signer == null || !signer.equals(m.addr, true) || roster == null || !roster.isRegistered(m.sender, m.addr, tIn, tIn)) {
                    Log.i(TAG, "ignored time answer from ${m.sender}: not a registered phone"); return false
                }
                synchronized(this) { samples += PeerSample(m.sender, t1, m.t2, m.t3, rawIn, m.errMs, m.hops) }
            }
            null -> {}
        }
        return false
    }

    // ---- persistence + status
    private fun prefs() = app.getSharedPreferences("twm_clock", Context.MODE_PRIVATE)
    private fun boot() = try { Settings.Global.getInt(app.contentResolver, Settings.Global.BOOT_COUNT) } catch (_: Exception) { -1 }

    private fun restore() {
        val p = prefs()
        if (!p.contains("offset")) { publish(); return }
        keeper.restore(TimeKeeper.Saved(p.getLong("offset", 0), p.getLong("err", 0), p.getLong("atRaw", 0), p.getLong("atWall", 0),
            p.getString("source", "server")!!, p.getInt("hops", 0), p.getInt("boot", -2)), boot())
        publish(p.getLong("fixedAtWall", 0))
        Log.i(TAG, "restored clock from ${keeper.fix?.source} ±${keeper.errMs()} ms")
    }

    private fun changed(why: String) {
        val s = keeper.save(boot()) ?: return
        val wall = System.currentTimeMillis()
        prefs().edit().putLong("offset", s.offsetMs).putLong("err", s.errMs).putLong("atRaw", s.atRaw).putLong("atWall", s.atWall)
            .putString("source", s.source).putInt("hops", s.hops).putInt("boot", s.boot).putLong("fixedAtWall", wall).apply()
        publish(wall)
        Log.i(TAG, "$why: clock from ${s.source} (${s.hops} hop) ±${s.errMs} ms")
    }

    private fun publish(fixedAt: Long? = _status.value.fixedAtWallMs) {
        val f = keeper.fix
        _status.value = ClockStatus(f?.source, f?.hops ?: 0, keeper.errMs(), if (f == null) null else fixedAt)
    }

    /** Debug builds: forget the fix (so the phone falls back to its own, possibly skewed, wall clock). */
    internal fun debugForget() { prefs().edit().clear().apply(); keeper.clear(); lastServerSync = 0; publish(null) }
}
