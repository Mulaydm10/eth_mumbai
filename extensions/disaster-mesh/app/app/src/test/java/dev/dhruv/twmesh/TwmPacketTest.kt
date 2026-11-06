// Tremor Witness Mesh — new code (not from bitchat/SafeMesh). GPL-3.0 as part of this app.
package dev.dhruv.twmesh

import com.bitchat.android.protocol.BinaryProtocol
import com.bitchat.android.protocol.BitchatPacket
import com.bitchat.android.protocol.MessageType
import com.bitchat.android.protocol.SpecialRecipients
import com.bitchat.android.mesh.BLEPacketPaddingPolicy
import org.junit.Assert.assertArrayEquals
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNotNull
import org.junit.Test

class TwmPacketTest {
    @Test
    fun `TWM type has its own wire value`() {
        assertEquals(MessageType.TWM, MessageType.fromValue(0x40u))
        assertEquals(1, MessageType.values().count { it.value == MessageType.TWM.value })
    }

    @Test
    fun `TWM broadcast packet round-trips through the wire format`() {
        val payload = "ping|1|abcdef01".toByteArray()
        val p = BitchatPacket(
            version = 1u, type = MessageType.TWM.value,
            senderID = ByteArray(8) { it.toByte() }, recipientID = SpecialRecipients.BROADCAST,
            timestamp = 1709600000000uL, payload = payload, signature = ByteArray(64) { 7 }, ttl = 7u
        )
        val d = BinaryProtocol.decode(BinaryProtocol.encode(p)!!)
        assertNotNull(d)
        assertEquals(MessageType.TWM.value, d!!.type)
        assertEquals(7.toUByte(), d.ttl)
        assertArrayEquals(payload, d.payload)
    }

    @Test
    fun `TWM frames are not padded over BLE`() {
        assertFalse(BLEPacketPaddingPolicy.shouldPadForBLE(MessageType.TWM.value))
    }
}
