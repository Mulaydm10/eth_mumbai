// Tremor Witness Mesh — new code (not from bitchat/SafeMesh). GPL-3.0 as part of this app.
package dev.dhruv.twmesh

import android.content.Intent
import android.graphics.Color
import android.graphics.Typeface
import android.os.Build
import android.os.Bundle
import android.os.SystemClock
import android.text.InputType
import android.util.TypedValue
import android.view.ViewGroup.LayoutParams.MATCH_PARENT
import android.view.ViewGroup.LayoutParams.WRAP_CONTENT
import android.widget.Button
import android.widget.EditText
import android.widget.LinearLayout
import android.widget.ScrollView
import android.widget.TextView
import androidx.activity.ComponentActivity
import androidx.core.content.FileProvider
import androidx.lifecycle.lifecycleScope
import com.bitchat.android.mesh.UnifiedMeshService
import com.bitchat.android.service.MeshServiceHolder
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import java.io.File
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import java.util.TimeZone

/**
 * M0 spike over SafeMesh's own mesh layer: "hello" + ping/pong as MessageType.TWM packets, which are
 * signed by the sender's mesh key and relayed up to 7 hops by SafeMesh's relay logic.
 * Measures round-trip time, loss and relay count per typed distance; logs RSSI of direct neighbours.
 * The mesh itself is started by the main screen (SafeMesh onboarding). No location is read.
 */
class TwmTestActivity : ComponentActivity() {
    private lateinit var mesh: UnifiedMeshService
    private lateinit var status: TextView
    private lateinit var logView: TextView
    private lateinit var distance: EditText
    private lateinit var pingButton: Button
    private lateinit var logFile: File

    private var pingJob: Job? = null
    private var seq = 0
    private val pending = mutableMapOf<Int, Long>()               // seq -> sent (elapsedRealtime)
    private val rtts = mutableMapOf<String, MutableList<Long>>()  // "distance m" -> RTTs
    private val lost = mutableMapOf<String, Int>()
    private val relaysSeen = mutableMapOf<String, MutableSet<Int>>()
    private val ist = SimpleDateFormat("HH:mm:ss.SSS", Locale.US).apply { timeZone = TimeZone.getTimeZone("Asia/Kolkata") }

    private val me get() = mesh.myPeerID.take(8)

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        mesh = MeshServiceHolder.getUnifiedOrCreate(applicationContext)
        logFile = File(filesDir, "twm-m0-log.txt")
        setContentView(buildUi())
        log("open test screen, me=$me, android=${Build.VERSION.SDK_INT}")
        lifecycleScope.launch { TwmBus.incoming.collect { onTwm(it) } }
        lifecycleScope.launch { while (true) { refreshStatus(); delay(2000) } }
    }

    // ---------- UI: big plain buttons, no gestures ----------
    private fun buildUi(): ScrollView {
        val pad = dp(16)
        val col = LinearLayout(this).apply { orientation = LinearLayout.VERTICAL; setPadding(pad, pad, pad, pad) }
        col.addView(TextView(this).apply { text = "Mesh test (M0)"; textSize = 26f; setTypeface(typeface, Typeface.BOLD) })
        col.addView(TextView(this).apply { text = "This phone: $me"; textSize = 18f })
        status = TextView(this).apply { textSize = 20f; setPadding(0, dp(8), 0, dp(8)) }
        col.addView(status)
        col.addView(TextView(this).apply { text = "Distance to the other phone, in metres"; textSize = 18f })
        distance = EditText(this).apply {
            inputType = InputType.TYPE_CLASS_NUMBER or InputType.TYPE_NUMBER_FLAG_DECIMAL
            setText("1"); textSize = 22f; contentDescription = "Distance to the other phone, in metres"
        }
        col.addView(distance, LinearLayout.LayoutParams(MATCH_PARENT, WRAP_CONTENT))
        col.addView(button("Send hello") { send("hello|$me|${System.currentTimeMillis()}"); log("sent hello") })
        pingButton = button("Start pinging") { togglePing() }
        col.addView(pingButton)
        col.addView(button("Show results") { summary() })
        col.addView(button("Share log") { shareLog() })
        col.addView(button("Back to chat") { finish() })
        logView = TextView(this).apply { textSize = 13f; typeface = Typeface.MONOSPACE; setPadding(0, dp(12), 0, 0) }
        col.addView(logView)
        return ScrollView(this).apply { fitsSystemWindows = true; addView(col) }
    }

    private fun button(label: String, onTap: () -> Unit) = Button(this).apply {
        text = label; textSize = 20f; isAllCaps = false; minHeight = dp(64)
        setOnClickListener { onTap() }
        layoutParams = LinearLayout.LayoutParams(MATCH_PARENT, WRAP_CONTENT).apply { topMargin = dp(8) }
    }

    private fun dp(v: Int) = TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, v.toFloat(), resources.displayMetrics).toInt()

    private fun refreshStatus() {
        val peers = try { mesh.getPeerNicknames() } catch (_: Exception) { emptyMap() }
        val rssi = try { mesh.getPeerRSSI() } catch (_: Exception) { emptyMap() }
        status.text = if (peers.isEmpty()) "No phones in range yet" else
            "In range: " + peers.entries.joinToString { (id, n) -> "$n${rssi[id]?.let { " ($it dBm)" } ?: ""}" }
        status.setTextColor(if (peers.isEmpty()) Color.GRAY else Color.rgb(0, 110, 40))
    }

    private fun log(msg: String) {
        val line = "${ist.format(Date())} IST $msg"
        logFile.appendText(line + "\n")
        runOnUiThread { logView.text = (line + "\n" + logView.text).take(6000) }
    }

    private fun dist() = distance.text.toString().ifBlank { "?" }
    private fun send(msg: String) = TwmBus.send(this, msg.toByteArray())

    // ---------- protocol (M0 only: plain text; M3 replaces it with signed JSON, BRIEF §5) ----------
    private fun onTwm(m: TwmIn) {
        val parts = m.payload.toString(Charsets.UTF_8).split("|")
        val from = m.senderPeerID.take(8)
        when (parts[0]) {
            "ping" -> send("pong|${parts.getOrNull(1)}|${parts.getOrNull(2)}")
            "pong" -> {
                if (parts.getOrNull(2) != me) return              // someone else's pong, relayed past us
                val s = parts.getOrNull(1)?.toIntOrNull() ?: return
                val sent = pending.remove(s) ?: return
                val rtt = SystemClock.elapsedRealtime() - sent
                rtts.getOrPut(dist()) { mutableListOf() }.add(rtt)
                relaysSeen.getOrPut(dist()) { mutableSetOf() }.add(m.relays)
                val rssi = try { mesh.getPeerRSSI()[m.senderPeerID] } catch (_: Exception) { null }
                log("pong #$s from $from: rtt ${rtt}ms, relays ${m.relays}, rssi ${rssi ?: "?"} @ ${dist()} m")
            }
            "hello" -> log("HELLO from $from (relays ${m.relays}; their clock − mine ≈ ${(parts.getOrNull(2)?.toLongOrNull() ?: 0) - System.currentTimeMillis()} ms incl. travel)")
            else -> log("TWM from $from: ${parts[0]}")
        }
    }

    /** Every 2 s a ping goes out; no pong within 5 s = lost at the current distance. */
    private fun togglePing() {
        if (pingJob != null) {
            pingJob?.cancel(); pingJob = null; pingButton.text = "Start pinging"; log("pinging stopped"); return
        }
        pingButton.text = "Stop pinging"; log("pinging every 2 s @ ${dist()} m")
        pingJob = lifecycleScope.launch {
            while (true) {
                val now = SystemClock.elapsedRealtime()
                pending.entries.removeAll { (s, sent) ->
                    (now - sent > 5000).also { if (it) { lost[dist()] = (lost[dist()] ?: 0) + 1; log("ping #$s lost @ ${dist()} m") } }
                }
                seq++; pending[seq] = now; send("ping|$seq|$me")
                delay(2000)
            }
        }
    }

    private fun summary() {
        val keys = (rtts.keys + lost.keys).toSortedSet(compareBy { it.toDoubleOrNull() ?: 1e9 })
        if (keys.isEmpty()) { log("no results yet"); return }
        for (k in keys) {
            val r = rtts[k].orEmpty().sorted()
            val med = if (r.isEmpty()) "-" else r[r.size / 2].toString()
            log("RESULT @ $k m: ${r.size} pongs, ${lost[k] ?: 0} lost, rtt min ${r.firstOrNull() ?: "-"} / median $med / max ${r.lastOrNull() ?: "-"} ms, relays ${relaysSeen[k].orEmpty().sorted()}")
        }
    }

    private fun shareLog() {
        summary()
        val uri = FileProvider.getUriForFile(this, "$packageName.fileprovider", logFile)
        startActivity(Intent.createChooser(Intent(Intent.ACTION_SEND).apply {
            type = "text/plain"; putExtra(Intent.EXTRA_STREAM, uri); addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
        }, "Share mesh log"))
    }
}
