// Tremor Witness Mesh — new code (not from bitchat/SafeMesh). GPL-3.0 as part of this app.
package dev.dhruv.twmesh

import android.content.Intent
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.safeDrawingPadding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalLifecycleOwner
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.LifecycleEventObserver
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

private val Red = Color(0xFF9B0000)      // 7:1+ on white
private val Green = Color(0xFF00561B)

/** TW Mesh home: who this phone is, the disaster status, check-ins and the "not heard from" list. */
@Composable
fun TwmHomeScreen(peerCount: Int, onOpenChat: () -> Unit) {
    val ctx = LocalContext.current
    val owner = LocalLifecycleOwner.current
    val scope = rememberCoroutineScope()
    var tick by remember { mutableIntStateOf(0) }
    var refreshing by remember { mutableStateOf(false) }
    var refreshNote by remember { mutableStateOf<String?>(null) }
    val v by MeshState.view.collectAsState()
    val up by Uploader.status.collectAsState()

    fun refreshRoster() {
        val site = PhoneIdentity.get(ctx).site ?: return
        if (refreshing) return
        refreshing = true
        scope.launch {
            val r = withContext(Dispatchers.IO) { MeshState.syncClock(); RosterStore.get(ctx).refresh(site) }
            refreshNote = r.fold({ null }, { "Couldn't update the site list (no internet?). Using the saved one." })
            MeshState.recompute(); refreshing = false
        }
    }
    DisposableEffect(owner) {
        val obs = LifecycleEventObserver { _, e ->
            if (e == Lifecycle.Event.ON_RESUME) {
                tick++; MeshState.recompute()
                val age = MeshState.view.value.rosterAgeMs
                if (MeshState.view.value.joined && (age == null || age > 10 * 60_000)) refreshRoster()
            }
        }
        owner.lifecycle.addObserver(obs); onDispose { owner.lifecycle.removeObserver(obs) }
    }
    val id = remember(tick) { PhoneIdentity.get(ctx) }
    val c = MaterialTheme.colorScheme
    var note by remember { mutableStateOf("") }
    var confirmEmergency by remember { mutableStateOf(false) }
    var confirmTest by remember { mutableStateOf(false) }

    Column(
        Modifier.fillMaxSize().background(c.background).safeDrawingPadding().verticalScroll(rememberScrollState()).padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(10.dp)
    ) {
        Text("TW Mesh", fontSize = 32.sp, fontWeight = FontWeight.Bold, color = c.onBackground)
        if (!v.joined) {
            Text("Tremor Witness disaster mesh", fontSize = 18.sp, color = c.onBackground)
            Text("This phone hasn't joined a site yet.", fontSize = 20.sp, color = c.onBackground)
            Text("Join with the invite QR from your site committee, so other phones and rescuers can trust this phone's messages.",
                fontSize = 17.sp, color = c.onBackground)
            BigButton("Join a site") { ctx.startActivity(Intent(ctx, JoinActivity::class.java)) }
        } else {
            Text("This phone: ${id.ensName}", fontSize = 18.sp, color = c.onBackground)
            Text("Phones in Bluetooth range: $peerCount", fontSize = 18.sp, color = c.onBackground)

            // ---- alert status
            val a = v.alert
            val box = Modifier.fillMaxWidth().background(if (a == null) c.surfaceVariant else Red, RoundedCornerShape(12.dp)).padding(14.dp)
            Column(box) {
                if (a == null) Text("No disaster alert", fontSize = 22.sp, fontWeight = FontWeight.Bold, color = c.onSurfaceVariant)
                else {
                    Text(if (a.confirmed) "DISASTER CONFIRMED" else "EMERGENCY (manual)", fontSize = 24.sp, fontWeight = FontWeight.Bold, color = Color.White)
                    Text(if (a.confirmed) "Strong shaking reported by ${a.by.size} registered phones: ${a.by.joinToString()}" else "Pressed by ${a.by.joinToString()}. Not confirmed by shaking.",
                        fontSize = 17.sp, color = Color.White)
                    Text("at ${time(a.atMs)}", fontSize = 17.sp, color = Color.White)
                }
            }

            // ---- check in
            Text("Check in", fontSize = 22.sp, fontWeight = FontWeight.Bold, color = c.onBackground)
            Row(horizontalArrangement = Arrangement.spacedBy(10.dp), modifier = Modifier.fillMaxWidth()) {
                Button(onClick = { MeshState.send("checkin", mapOf("status" to "safe") + noteField(note)); note = "" },
                    colors = ButtonDefaults.buttonColors(containerColor = Green), modifier = Modifier.weight(1f).heightIn(min = 72.dp)) {
                    Text("I'm safe", fontSize = 22.sp, color = Color.White) }
                Button(onClick = { MeshState.send("checkin", mapOf("status" to "help") + noteField(note)); note = "" },
                    colors = ButtonDefaults.buttonColors(containerColor = Red), modifier = Modifier.weight(1f).heightIn(min = 72.dp)) {
                    Text("I need help", fontSize = 22.sp, color = Color.White) }
            }
            OutlinedTextField(value = note, onValueChange = { note = it.take(80) }, modifier = Modifier.fillMaxWidth(),
                label = { Text("Optional note, e.g. flat 302, stairs blocked (80 letters)") }, singleLine = true)
            Text("No GPS is sent. Only your phone's name, your choice and this note.", fontSize = 15.sp, color = c.onBackground)

            // ---- lists
            Group("Need help (${v.help.size})", v.help.map { "${it.sender}${it.note?.let { n -> ": $n" } ?: ""} · ${time(it.tMs)}${hops(it.relays)}" }, Red)
            Group("Safe (${v.safe.size})", v.safe.map { "${it.sender}${it.note?.let { n -> ": $n" } ?: ""} · ${time(it.tMs)}${hops(it.relays)}" }, Green)
            Group("Not heard from (${v.notHeard.size})", v.notHeard, c.onBackground)
            val age = v.rosterAgeMs
            Text(
                if (age == null) "Site phone list not saved yet." else "Site list: ${v.rosterLabels.size} registered phones, saved ${ago(age)} (Sepolia block ${v.rosterBlock}).",
                fontSize = 15.sp, color = c.onBackground)
            refreshNote?.let { Text(it, fontSize = 15.sp, color = Red) }
            Text("Saved on Arkiv: ${up.uploaded} of this phone's messages" + (if (up.pending > 0) ", ${up.pending} waiting for internet" else "") +
                (up.lastError?.let { " (last try failed: $it)" } ?: ""), fontSize = 15.sp, color = c.onBackground)
            OutlinedButton(onClick = { refreshRoster() }, modifier = Modifier.fillMaxWidth().heightIn(min = 56.dp)) {
                Text(if (refreshing) "Updating site list…" else "Update site list (needs internet)", fontSize = 18.sp) }

            // ---- alert actions
            Text("Alert", fontSize = 22.sp, fontWeight = FontWeight.Bold, color = c.onBackground)
            Button(onClick = { confirmEmergency = true }, colors = ButtonDefaults.buttonColors(containerColor = Red),
                modifier = Modifier.fillMaxWidth().heightIn(min = 64.dp)) { Text("Emergency: alert everyone", fontSize = 20.sp, color = Color.White) }
            OutlinedButton(onClick = { confirmTest = true }, modifier = Modifier.fillMaxWidth().heightIn(min = 56.dp)) {
                Text("Test: send a shaking signal", fontSize = 18.sp) }
            Text("Confirmed needs ${v.quorumK} phones within ${v.quorumWindowMs / 1000.0} s (${v.paramsSource}).", fontSize = 15.sp, color = c.onBackground)
            if (v.rejected.isNotEmpty()) Text("Ignored messages: " + v.rejected.entries.joinToString { "${it.value} ${it.key.name.lowercase().replace('_', ' ')}" },
                fontSize = 15.sp, color = c.onBackground, modifier = Modifier.semantics { contentDescription = "Ignored messages" })

            Spacer(Modifier.height(8.dp))
            OutlinedButton(onClick = { ctx.startActivity(Intent(ctx, JoinActivity::class.java)) }, modifier = Modifier.fillMaxWidth().heightIn(min = 56.dp)) {
                Text("Join again / another site", fontSize = 18.sp) }
        }
        OutlinedButton(onClick = { ctx.startActivity(Intent(ctx, TwmTestActivity::class.java)) },
            modifier = Modifier.fillMaxWidth().heightIn(min = 56.dp)) { Text("Mesh test (range / latency)", fontSize = 18.sp) }
        OutlinedButton(onClick = onOpenChat, modifier = Modifier.fillMaxWidth().heightIn(min = 56.dp)) {
            Text("Mesh chat (from SafeMesh)", fontSize = 18.sp) }
    }

    if (confirmEmergency) AlertDialog(
        onDismissRequest = { confirmEmergency = false },
        title = { Text("Alert everyone nearby?") },
        text = { Text("All phones of this site in mesh range will show an emergency, marked as manual (not confirmed by shaking).") },
        confirmButton = { TextButton(onClick = { MeshState.send("dmanual"); confirmEmergency = false }) { Text("Alert everyone", color = Red) } },
        dismissButton = { TextButton(onClick = { confirmEmergency = false }) { Text("Cancel") } },
    )
    if (confirmTest) AlertDialog(
        onDismissRequest = { confirmTest = false },
        title = { Text("Send a test shaking signal?") },
        text = { Text("For demos: this phone reports strong shaking as if its sensor had felt it. If ${v.quorumK} phones do this within ${v.quorumWindowMs / 1000.0} s, every phone shows DISASTER CONFIRMED.") },
        confirmButton = { TextButton(onClick = {
            // TODO(measure): real detection replaces this (DSP + calibrated disaster threshold, BRIEF §5.1). Value is a placeholder, flagged "test".
            MeshState.send("dtrigger", mapOf("ppvUm" to 0L, "fDomCHz" to 0L, "label" to "structural", "test" to 1L)); confirmTest = false
        }) { Text("Send test signal") } },
        dismissButton = { TextButton(onClick = { confirmTest = false }) { Text("Cancel") } },
    )
}

private fun noteField(n: String): Map<String, Any> = n.trim().takeIf { it.isNotEmpty() }?.let { mapOf("note" to it) } ?: emptyMap()
private fun hops(r: Int) = if (r > 0) " · via $r relay${if (r > 1) "s" else ""}" else ""
private fun time(ms: Long) = SimpleDateFormat("HH:mm:ss", Locale.getDefault()).format(Date(ms))
private fun ago(ms: Long) = when { ms < 60_000 -> "just now"; ms < 3600_000 -> "${ms / 60_000} min ago"; ms < 86_400_000 -> "${ms / 3600_000} h ago"; else -> "${ms / 86_400_000} days ago" }

@Composable
private fun BigButton(label: String, onClick: () -> Unit) =
    Button(onClick = onClick, modifier = Modifier.fillMaxWidth().heightIn(min = 64.dp)) { Text(label, fontSize = 20.sp) }

@Composable
private fun Group(title: String, items: List<String>, color: Color) {
    Column(Modifier.fillMaxWidth().padding(top = 6.dp)) {
        Text(title, fontSize = 20.sp, fontWeight = FontWeight.Bold, color = color)
        if (items.isEmpty()) Text("—", fontSize = 17.sp, color = MaterialTheme.colorScheme.onBackground)
        items.forEach { Text("• $it", fontSize = 17.sp, color = MaterialTheme.colorScheme.onBackground) }
    }
}
