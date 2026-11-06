// Tremor Witness Mesh — new code (not from bitchat/SafeMesh). GPL-3.0 as part of this app.
package dev.dhruv.twmesh

import android.content.Intent
import android.graphics.Color
import android.graphics.Typeface
import android.os.Bundle
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
import androidx.activity.result.contract.ActivityResultContracts
import androidx.lifecycle.lifecycleScope
import dev.dhruv.twmesh.chain.Invite
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

/** M1: join a Tremor Witness site with a committee invite. One decision at a time, plain words, big buttons. */
class JoinActivity : ComponentActivity() {
    private lateinit var me: PhoneIdentity
    private lateinit var inviteInfo: TextView
    private lateinit var linkBox: EditText
    private lateinit var nameBox: EditText
    private lateinit var joinButton: Button
    private lateinit var steps: TextView
    private val flow = JoinFlow()
    private var invite: Invite? = null
    private var busy = false

    private val scan = registerForActivityResult(ActivityResultContracts.StartActivityForResult()) { r ->
        r.data?.getStringExtra(Intent.EXTRA_TEXT)?.let { useInvite(it) }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        me = PhoneIdentity.get(this)
        setContentView(buildUi())
        lifecycleScope.launch {
            val addr = withContext(Dispatchers.Default) { me.address }   // first run creates the key
            keyLine.text = "This phone's key: ${addr.take(8)}…${addr.takeLast(6)}"
            keyLine.contentDescription = "This phone's key ends in ${addr.takeLast(6).toList().joinToString(" ")}"
        }
        intent?.dataString?.let { useInvite(it) }
    }

    private lateinit var keyLine: TextView

    private fun buildUi(): ScrollView {
        val pad = dp(16)
        val col = LinearLayout(this).apply { orientation = LinearLayout.VERTICAL; setPadding(pad, pad, pad, pad) }
        col.addView(text("Join a site", 28f, bold = true))
        keyLine = text("Making this phone's key…", 16f).also { col.addView(it) }
        me.ensName?.let { col.addView(text("Already joined as $it. Joining again replaces this.", 16f)) }

        col.addView(text("1. Get the invite", 22f, bold = true, top = 20))
        col.addView(text("Ask the site committee to show the invite QR on their dashboard. It works once, for 30 minutes.", 17f))
        col.addView(button("Scan invite QR") { scan.launch(Intent(this, ScanActivity::class.java)) })
        linkBox = EditText(this).apply {
            hint = "Or paste the invite link here"; textSize = 17f; inputType = InputType.TYPE_TEXT_VARIATION_URI
            contentDescription = "Invite link"
        }
        col.addView(linkBox, LinearLayout.LayoutParams(MATCH_PARENT, WRAP_CONTENT))
        col.addView(button("Use this link") { useInvite(linkBox.text.toString()) })
        inviteInfo = text("No invite yet.", 18f).also { col.addView(it) }

        col.addView(text("2. Name this phone", 22f, bold = true, top = 20))
        col.addView(text("Your name plus -m, like dhruv-m. Lowercase letters, numbers and -. It takes one of the site's ${dev.dhruv.twmesh.chain.Tw.MAX_PHONES_PER_SITE} phone places.", 17f))
        nameBox = EditText(this).apply {
            hint = "dhruv-m"; textSize = 22f; inputType = InputType.TYPE_CLASS_TEXT or InputType.TYPE_TEXT_FLAG_NO_SUGGESTIONS
            contentDescription = "Phone name"; setText(me.label ?: "")
        }
        col.addView(nameBox, LinearLayout.LayoutParams(MATCH_PARENT, WRAP_CONTENT))

        col.addView(text("3. Join", 22f, bold = true, top = 20))
        joinButton = button("Join site") { join() }.also { it.isEnabled = false; col.addView(it) }
        steps = text("", 18f).also { col.addView(it) }
        col.addView(button("Back") { finish() })
        return ScrollView(this).apply { fitsSystemWindows = true; addView(col) }
    }

    private fun useInvite(text: String) {
        val inv = Invite.parse(text)
        invite = inv
        val problem = flow.precheck(inv, "aaa")   // label checked at join time
        if (problem != null) {
            inviteInfo.text = "✗ $problem"; inviteInfo.setTextColor(Color.rgb(170, 0, 0)); joinButton.isEnabled = false
        } else {
            val mins = ((inv!!.exp - System.currentTimeMillis()) / 60000).coerceAtLeast(0)
            inviteInfo.text = "✓ Invite for site \"${inv.site}\", signed by the committee, valid for $mins more minutes."
            inviteInfo.setTextColor(Color.rgb(0, 100, 30)); joinButton.isEnabled = !busy
        }
    }

    private fun join() {
        if (busy) return
        busy = true; joinButton.isEnabled = false
        val label = nameBox.text.toString().trim().lowercase()
        val lines = LinkedHashMap<String, JoinFlow.Step>()
        lifecycleScope.launch {
            val r = withContext(Dispatchers.IO) {
                flow.run(invite, label, me.address) { s -> runOnUiThread { lines[s.id] = s; render(lines.values) } }
            }
            if (r.ok) {
                me.saveMembership(invite!!.site.lowercase(), label, r.expiry, r.resolved)
                steps.append("\n\nDone. This phone is ${r.name}.")
            } else {
                busy = false; joinButton.isEnabled = true
            }
        }
    }

    private fun render(all: Collection<JoinFlow.Step>) {
        steps.text = all.joinToString("\n") { s ->
            when (s.state) { JoinFlow.State.DONE -> "✓ "; JoinFlow.State.RUNNING -> "… "; JoinFlow.State.WARN -> "! "; JoinFlow.State.FAILED -> "✗ " } + s.text
        }
    }

    private fun text(t: String, size: Float, bold: Boolean = false, top: Int = 4) = TextView(this).apply {
        text = t; textSize = size; setTextColor(Color.rgb(20, 20, 20)); setPadding(0, dp(top), 0, dp(4))
        if (bold) setTypeface(typeface, Typeface.BOLD)
    }

    private fun button(label: String, onTap: () -> Unit) = Button(this).apply {
        text = label; textSize = 20f; isAllCaps = false; minHeight = dp(64)
        setOnClickListener { onTap() }
        layoutParams = LinearLayout.LayoutParams(MATCH_PARENT, WRAP_CONTENT).apply { topMargin = dp(8) }
    }

    private fun dp(v: Int) = TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, v.toFloat(), resources.displayMetrics).toInt()
}
