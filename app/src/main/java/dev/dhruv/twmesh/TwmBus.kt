// Tremor Witness Mesh — new code (not from bitchat/SafeMesh). GPL-3.0 as part of this app.
package dev.dhruv.twmesh

import android.content.Context
import com.bitchat.android.model.RoutedPacket
import com.bitchat.android.service.MeshServiceHolder
import com.bitchat.android.util.AppConstants
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.SharedFlow

/** One TWM packet as received from the mesh (already signature-checked and deduped by SecurityManager). */
data class TwmIn(
    val senderPeerID: String,
    val payload: ByteArray,
    /** Relays between sender and us: 0 = heard directly. */
    val relays: Int,
    val sentAtMs: Long,
)

/**
 * Bridge between SafeMesh's packet layer and the Tremor Witness Mesh protocol.
 * Incoming MessageType.TWM packets land here; [send] broadcasts one.
 */
object TwmBus {
    private val _incoming = MutableSharedFlow<TwmIn>(extraBufferCapacity = 256)
    val incoming: SharedFlow<TwmIn> = _incoming

    /** Called by PacketProcessor for every valid TWM packet. Returning true lets it relay the packet on. */
    fun onReceive(routed: RoutedPacket): Boolean {
        val p = routed.packet
        val sender = routed.peerID ?: return false
        _incoming.tryEmit(
            TwmIn(
                senderPeerID = sender,
                payload = p.payload,
                relays = (AppConstants.MESSAGE_TTL_HOPS.toInt() - p.ttl.toInt()).coerceAtLeast(0),
                sentAtMs = p.timestamp.toLong(),
            )
        )
        return true
    }

    fun send(context: Context, payload: ByteArray) {
        MeshServiceHolder.getUnifiedOrCreate(context.applicationContext).sendTwm(payload)
    }
}
