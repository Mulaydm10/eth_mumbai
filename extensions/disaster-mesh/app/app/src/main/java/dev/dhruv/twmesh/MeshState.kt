// Tremor Witness Mesh — new code (not from bitchat/SafeMesh). GPL-3.0 as part of this app.
package dev.dhruv.twmesh

import android.content.Context
import android.util.Log
import dev.dhruv.twmesh.core.MeshMsg
import dev.dhruv.twmesh.core.Quorum
import dev.dhruv.twmesh.core.QuorumParams
import dev.dhruv.twmesh.core.Trigger
import dev.dhruv.twmesh.core.Verdict
import dev.dhruv.twmesh.core.Verifier
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.isActive
import kotlinx.coroutines.launch
import java.io.File

/** What the disaster screen shows. Recomputed from the accepted messages after every change. */
data class MeshView(
    val joined: Boolean = false,
    val site: String? = null,
    val me: String? = null,
    val rosterLabels: List<String> = emptyList(),
    val rosterAgeMs: Long? = null,
    val rosterBlock: Long? = null,
    val meshCount: Int = 0,
    val maxMesh: Int? = null,
    val alert: Alert? = null,
    val help: List<CheckIn> = emptyList(),
    val safe: List<CheckIn> = emptyList(),
    val notHeard: List<String> = emptyList(),
    val rejected: Map<Verdict, Int> = emptyMap(),
    val quorumK: Int = 2,
    val quorumWindowMs: Long = 2000,
    val paramsSource: String = "",
)
data class Alert(val confirmed: Boolean, val atMs: Long, val by: List<String>)
data class CheckIn(val sender: String, val status: String, val note: String?, val tMs: Long, val relays: Int)

/**
 * Process-wide TW Mesh protocol state: verifies every incoming TWM message (BRIEF §5), decides whether SafeMesh may
 * relay it, keeps accepted messages on disk (outbox for M6), and computes alert + check-in lists.
 */
object MeshState {
    private const val TAG = "TwmMeshState"
    private lateinit var app: Context
    private val scope = CoroutineScope(Dispatchers.Default + SupervisorJob())
    private val verifier = Verifier()
    private val accepted = LinkedHashMap<String, Pair<MeshMsg, Int>>()   // id -> (msg, relays when heard)
    private val heardAt = HashMap<String, Long>()
    private val rejected = HashMap<Verdict, Int>()
    private val _view = MutableStateFlow(MeshView())
    val view: StateFlow<MeshView> = _view

    fun init(ctx: Context) {
        if (::app.isInitialized) return
        app = ctx.applicationContext
        TimeSync.init(app)
        loadFromDisk()
        recompute()
        if (id().site != null) ShakeSensor.start(app)
        scope.launch { while (isActive) { delay(60_000); regossip(); Uploader.uploadPending(app) } }
        // As soon as any network comes back: upload our outbox, and refresh a stale site list.
        try {
            val cm = app.getSystemService(android.net.ConnectivityManager::class.java)
            cm.registerDefaultNetworkCallback(object : android.net.ConnectivityManager.NetworkCallback() {
                override fun onAvailable(network: android.net.Network) {
                    scope.launch {
                        delay(1500)   // let DNS settle
                        TimeSync.maybeSyncServer()
                        Uploader.uploadPending(app)
                        val site = id().site ?: return@launch
                        val age = roster()?.ageMs() ?: Long.MAX_VALUE
                        if (age > 10 * 60_000 && RosterStore.get(app).refresh(site).isSuccess) recompute()
                    }
                }
            })
        } catch (e: Exception) { Log.w(TAG, "no network callback: ${e.message}") }
    }

    /** Server time as this phone best knows it (TimeSync: /api/time when online, neighbours over the mesh when not). */
    fun now() = TimeSync.now()

    /** After joining (or switching site): reload that site's log and recompute. */
    @Synchronized fun reset() { accepted.clear(); heardAt.clear(); rejected.clear(); loadFromDisk(); recompute(); if (id().site != null) ShakeSensor.start(app) }

    /** Cristian's algorithm like the web app: best of 8 /api/time samples by lowest RTT. Blocking; needs internet. */
    fun syncClock() = TimeSync.syncServer()
    private fun id() = PhoneIdentity.get(app)
    private fun site() = id().site
    private fun roster() = site()?.let { RosterStore.get(app).load(it) }
    private fun file() = site()?.let { File(app.filesDir, "mesh-$it.jsonl") }

    /** Called on SafeMesh's packet thread. Returns true if the packet may be relayed further. */
    @Synchronized
    fun onIncoming(payload: ByteArray, relays: Int): Boolean {
        if (!::app.isInitialized) return false
        val m = MeshMsg.parse(payload) ?: return false
        val site = site() ?: return false            // not joined: can't judge → don't relay
        val r = roster()
        val heard = now()
        val v = verifier.check(m, site, r?.let { it::isRegistered }, heard)
        if (v != Verdict.ACCEPT) {
            if (v != Verdict.DUPLICATE) { rejected[v] = (rejected[v] ?: 0) + 1; Log.i(TAG, "rejected ${m.type} from ${m.sender}: $v"); recompute() }
            // A phone that joined after our last site-list download: refresh it (if online). Its sender re-sends every 60 s.
            if (v == Verdict.NOT_REGISTERED || v == Verdict.NO_ROSTER) maybeRefreshRoster(site)
            return false
        }
        store(m, relays, heard)
        return true
    }

    @Volatile private var lastRosterRefresh = 0L
    private fun maybeRefreshRoster(site: String) {
        if (System.currentTimeMillis() - lastRosterRefresh < 60_000) return
        lastRosterRefresh = System.currentTimeMillis()
        scope.launch { if (RosterStore.get(app).refresh(site).isSuccess) { Log.i(TAG, "site list refreshed after unknown sender"); recompute() } }
    }

    /** Sign and broadcast one of our own messages. Returns null if this phone hasn't joined a site. */
    fun send(type: String, body: Map<String, Any> = emptyMap()): MeshMsg? {
        val me = id(); val site = me.site ?: return null; val label = me.label ?: return null
        val extra = HashMap<String, Any>(body)
        if (type != "hello") extra["seq"] = me.nextSeq(site)
        if (type == "checkin") _view.value.alert?.let { extra["armMs"] = it.atMs }
        val m = MeshMsg.build(type, site, label, me.address, now(), extra) { me.signMessage(it) }
        synchronized(this) { verifier.check(m, site, { _, _, _, _ -> true }, now()); store(m, 0, now()) }
        TwmBus.send(app, m.wire.toByteArray())
        scope.launch { Uploader.uploadPending(app) }
        return m
    }

    /** This phone's own accepted messages for the current site (the M6 outbox). */
    @Synchronized fun ownMessages(): List<MeshMsg> {
        val me = id(); val site = me.site ?: return emptyList(); val label = me.label ?: return emptyList()
        return accepted.values.map { it.first }.filter { it.site.equals(site, true) && it.sender == label && it.addr.equals(me.address, true) }
    }

    private fun store(m: MeshMsg, relays: Int, heard: Long) {
        accepted[m.id] = m to relays; heardAt[m.id] = heard
        try { file()?.appendText("{\"heardAt\":$heard,\"relays\":$relays,\"msg\":${m.wire}}\n") } catch (_: Exception) { }
        recompute()
    }

    private fun loadFromDisk() {
        val f = file() ?: return
        if (!f.exists()) return
        val gson = com.google.gson.Gson()
        f.readLines().forEach { line ->
            try {
                val o = gson.fromJson(line, com.google.gson.JsonObject::class.java)
                val m = MeshMsg.parse(o["msg"].toString().toByteArray()) ?: return@forEach
                accepted[m.id] = m to o["relays"].asInt; heardAt[m.id] = o["heardAt"].asLong
                verifier.check(m, m.site, { _, _, _, _ -> true }, o["heardAt"].asLong)   // mark as seen
            } catch (_: Exception) { }
        }
    }

    /** Re-send our own latest check-in and recent alert messages so phones that arrive later still hear them. */
    private fun regossip() {
        val mine = id().label ?: return
        val own = synchronized(this) { accepted.values.map { it.first }.filter { it.sender == mine } }
        val latestCheckin = own.filter { it.type == "checkin" }.maxByOrNull { it.tMs }
        val recent = own.filter { it.type != "checkin" && now() - it.tMs < 30 * 60_000 }.takeLast(3)
        (listOfNotNull(latestCheckin) + recent).forEach { TwmBus.send(app, it.wire.toByteArray()) }
    }

    @Synchronized
    fun recompute() {
        if (!::app.isInitialized) return
        val me = id(); val site = me.site
        if (site == null) { _view.value = MeshView(joined = false); return }
        val r = roster()
        val msgs = accepted.values.filter { it.first.site.equals(site, true) }
        // Disaster tier params: tw.dk / tw.dwindow_ms (R2). Until they exist, fall back to the construction tier, and say so.
        val k = r?.dk ?: r?.k ?: 2
        val w = r?.dWindowMs ?: r?.windowMs ?: 2000L
        val src = when { r?.dk != null -> "site's disaster settings"; r?.k != null -> "site's construction settings (no disaster settings yet)"; else -> "default (no site settings saved)" }
        val triggers = msgs.map { it.first }.filter { it.type == "dtrigger" }.map {
            Trigger(it.id, it.sender, it.addr, it.tMs, (it.long("ppvUm") ?: 0) / 1000.0, (it.long("fDomCHz") ?: 0) / 100.0, it.str("label") ?: "handling", heardAt[it.id])
        }
        val events = Quorum.compute(triggers, QuorumParams(k, w)).events     // triggers are already roster-verified
        val manual = msgs.map { it.first }.filter { it.type == "dmanual" }
        val alert = events.maxByOrNull { it.tMs }?.let { Alert(true, it.tMs, it.sensors) }
            ?: manual.maxByOrNull { it.tMs }?.let { m -> Alert(false, m.tMs, manual.map { it.sender }.distinct()) }
        // Check-ins: latest per sender, since the alert (or the last 24 h if there's no alert).
        val since = alert?.atMs?.minus(10 * 60_000) ?: (now() - 24 * 3600_000)
        val latest = msgs.filter { it.first.type == "checkin" && it.first.tMs >= since }
            .groupBy { it.first.sender }.mapValues { (_, l) -> l.maxBy { it.first.tMs } }
            .map { (s, p) -> CheckIn(s, p.first.str("status")!!, p.first.str("note"), p.first.tMs, p.second) }
        val labels = r?.phones?.map { it.label }?.sorted() ?: emptyList()
        _view.value = MeshView(
            joined = true, site = site, me = me.label, rosterLabels = labels, rosterAgeMs = r?.ageMs(), rosterBlock = r?.block,
            meshCount = r?.meshCount ?: 0, maxMesh = r?.maxMesh,
            alert = alert, help = latest.filter { it.status == "help" }.sortedBy { it.sender },
            safe = latest.filter { it.status == "safe" }.sortedBy { it.sender },
            notHeard = labels.filter { l -> latest.none { it.sender == l } },
            rejected = HashMap(rejected), quorumK = k, quorumWindowMs = w, paramsSource = src,
        )
    }
}
