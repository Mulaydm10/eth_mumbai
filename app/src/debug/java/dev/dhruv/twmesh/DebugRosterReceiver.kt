// Tremor Witness Mesh — new code. DEBUG BUILDS ONLY (src/debug): lets emulator tests use a fake site roster instead of
// spending real ENS invites. Never compiled into release APKs.
package dev.dhruv.twmesh

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.util.Log
import dev.dhruv.twmesh.chain.EnsPhone
import dev.dhruv.twmesh.chain.Tw
import dev.dhruv.twmesh.core.RegistrationInterval
import kotlinx.coroutines.launch

/**
 * adb shell am broadcast -n dev.dhruv.twmesh/dev.dhruv.twmesh.DebugRosterReceiver -a WHOAMI
 * adb shell am broadcast -n dev.dhruv.twmesh/dev.dhruv.twmesh.DebugRosterReceiver -a SET \
 *     --es site emu-test --es label a-m --es peers "a-m=0x…,b-m=0x…" --ei k 2 --el windowMs 5000
 */
class DebugRosterReceiver : BroadcastReceiver() {
    override fun onReceive(ctx: Context, intent: Intent) {
        val me = PhoneIdentity.get(ctx)
        when (intent.action) {
            // adb … -a CLOCK            : log this phone's time vs. its own wall clock
            // adb … -a CLOCK_RESET --el skew 7000 : forget the clock fix and pretend the wall clock is 7 s fast
            // adb … -a CLOCK_ASK          : ask neighbours for their time now
            "CLOCK" -> { val t = TimeSync.now(); val w = System.currentTimeMillis()
                Log.i("TwmDebug", "CLOCK now-wall=${t - w} err=${TimeSync.keeper.errMs()} source=${TimeSync.keeper.fix?.source} hops=${TimeSync.keeper.fix?.hops}") }
            "CLOCK_RESET" -> { TimeSync.debugWallSkewMs = intent.getLongExtra("skew", 0); TimeSync.debugForget()
                Log.i("TwmDebug", "CLOCK_RESET skew=${TimeSync.debugWallSkewMs}") }
            "CLOCK_ASK" -> { val r = goAsync(); kotlinx.coroutines.CoroutineScope(kotlinx.coroutines.Dispatchers.Default).launch {
                try { val f = TimeSync.exchange(); Log.i("TwmDebug", "CLOCK_ASK -> ${f?.source} err=${TimeSync.keeper.errMs()}") } finally { r.finish() } } }
            "WHOAMI" -> Log.i("TwmDebug", "WHOAMI addr=${me.address} site=${me.site} label=${me.label}")
            "SET" -> {
                val site = intent.getStringExtra("site")!!; val label = intent.getStringExtra("label")!!
                val peers = intent.getStringExtra("peers")!!.split(",").map { it.substringBefore("=") to it.substringAfter("=") }
                me.saveMembership(site, label, 0, false)
                RosterStore.get(ctx).save(RosterSnapshot(site, System.currentTimeMillis(), 0,
                    peers.map { (l, a) -> EnsPhone(l, Tw.phoneName(site, l), a, Long.MAX_VALUE / 1000) },
                    peers.map { (l, a) -> RegistrationInterval(l, a, 0, Long.MAX_VALUE) },
                    intent.getIntExtra("k", 2), intent.getLongExtra("windowMs", 5000), null, null))
                MeshState.reset()
                Log.i("TwmDebug", "SET site=$site label=$label peers=${peers.size}")
            }
        }
    }
}
