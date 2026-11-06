// Tremor Witness Mesh — new code (not from bitchat/SafeMesh). GPL-3.0 as part of this app.
package dev.dhruv.twmesh

import android.content.Intent
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.safeDrawingPadding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalLifecycleOwner
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.LifecycleEventObserver
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

/** TW Mesh home: what this phone is, and the next thing to do. Replaces SafeMesh's chat as the main screen. */
@Composable
fun TwmHomeScreen(peerCount: Int, onOpenChat: () -> Unit) {
    val ctx = LocalContext.current
    val owner = LocalLifecycleOwner.current
    var tick by remember { mutableIntStateOf(0) }
    DisposableEffect(owner) {
        val obs = LifecycleEventObserver { _, e -> if (e == Lifecycle.Event.ON_RESUME) tick++ }
        owner.lifecycle.addObserver(obs); onDispose { owner.lifecycle.removeObserver(obs) }
    }
    val id = remember(tick) { PhoneIdentity.get(ctx) }
    val name = remember(tick) { id.ensName }
    val c = MaterialTheme.colorScheme

    Column(
        Modifier.fillMaxSize().background(c.background).safeDrawingPadding().verticalScroll(rememberScrollState()).padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(10.dp)
    ) {
        Text("TW Mesh", fontSize = 32.sp, fontWeight = FontWeight.Bold, color = c.onBackground)
        Text("Tremor Witness disaster mesh", fontSize = 18.sp, color = c.onBackground)
        Spacer(Modifier.height(8.dp))
        if (name == null) {
            Text("This phone hasn't joined a site yet.", fontSize = 20.sp, color = c.onBackground)
            Text("Join with the invite QR from your site committee, so other phones and rescuers can trust this phone's messages.",
                fontSize = 17.sp, color = c.onBackground)
        } else {
            Text("This phone is", fontSize = 18.sp, color = c.onBackground)
            Text(name, fontSize = 22.sp, fontWeight = FontWeight.Bold, color = c.onBackground)
            val until = if (id.expiry > 0) SimpleDateFormat("d MMM yyyy", Locale.getDefault()).format(Date(id.expiry * 1000)) else "?"
            Text((if (id.resolvedOk) "Checked on Sepolia ✓. " else "Not yet seen on Sepolia. ") + "Valid until $until.", fontSize = 17.sp, color = c.onBackground)
        }
        Text("Phones in Bluetooth range: $peerCount", fontSize = 18.sp, color = c.onBackground)
        Spacer(Modifier.height(8.dp))
        Button(onClick = { ctx.startActivity(Intent(ctx, JoinActivity::class.java)) },
            modifier = Modifier.fillMaxWidth().heightIn(min = 64.dp)) {
            Text(if (name == null) "Join a site" else "Join again / another site", fontSize = 20.sp)
        }
        OutlinedButton(onClick = { ctx.startActivity(Intent(ctx, TwmTestActivity::class.java)) },
            modifier = Modifier.fillMaxWidth().heightIn(min = 64.dp)) { Text("Mesh test", fontSize = 20.sp) }
        OutlinedButton(onClick = onOpenChat, modifier = Modifier.fillMaxWidth().heightIn(min = 64.dp)) {
            Text("Mesh chat (from SafeMesh)", fontSize = 20.sp)
        }
    }
}
