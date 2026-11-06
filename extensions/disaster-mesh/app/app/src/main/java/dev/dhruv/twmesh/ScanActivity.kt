// Tremor Witness Mesh — new code (not from bitchat/SafeMesh). GPL-3.0 as part of this app.
package dev.dhruv.twmesh

import android.Manifest
import android.app.Activity
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.Text
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.bitchat.android.ui.ScannerView

/** Scans one QR code with SafeMesh's camera scanner and returns its text as EXTRA_TEXT. */
class ScanActivity : ComponentActivity() {
    private var granted by mutableStateOf(false)
    private val ask = registerForActivityResult(ActivityResultContracts.RequestPermission()) { granted = it }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        granted = checkSelfPermission(Manifest.permission.CAMERA) == PackageManager.PERMISSION_GRANTED
        if (!granted) ask.launch(Manifest.permission.CAMERA)
        setContent {
            Column(Modifier.fillMaxSize().padding(16.dp)) {
                Text("Point the camera at the invite QR on the committee's dashboard", fontSize = 20.sp)
                Box(Modifier.weight(1f).fillMaxWidth().padding(vertical = 12.dp)) {
                    if (granted) ScannerView { text ->
                        setResult(Activity.RESULT_OK, Intent().putExtra(Intent.EXTRA_TEXT, text)); finish()
                    } else Text("The camera is needed to scan. You can also paste the invite link instead.", fontSize = 18.sp)
                }
                Button(onClick = { finish() }, modifier = Modifier.fillMaxWidth().height(64.dp)) { Text("Cancel", fontSize = 20.sp) }
            }
        }
    }
}
