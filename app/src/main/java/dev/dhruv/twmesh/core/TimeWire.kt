// Tremor Witness Mesh — new code (not from bitchat/SafeMesh). GPL-3.0 as part of this app.
package dev.dhruv.twmesh.core

import dev.dhruv.twmesh.chain.Eth

/**
 * Wire format of the mesh time exchange (see [ClockMath]). Travels as a TWM packet whose payload starts with "TWT1"
 * (so it never reaches the message log, the quorum or Arkiv) and is never relayed: the timing is only meaningful over
 * one Bluetooth hop.
 *
 *  ask:    TWT1{"k":"q","n":<nonce>,"site":<site>,"from":<label>}                     unsigned, carries no time
 *  answer: TWT1{"k":"r","v":1,"site","sender","addr","n","to","t2","t3","err","hops","sig"}
 *          canonical JSON like the mesh messages, signed EIP-191 by the answering phone's key, so the asking phone
 *          only takes time from a phone registered on the site (checked against its saved ENS site list).
 */
object TimeWire {
    const val PREFIX = "TWT1"
    private val prefix = PREFIX.toByteArray()

    sealed class Msg
    data class Ask(val nonce: String, val site: String, val from: String) : Msg()
    data class Answer(val fields: Map<String, Any>) : Msg() {
        val site get() = fields["site"] as String
        val sender get() = fields["sender"] as String
        val addr get() = fields["addr"] as String
        val nonce get() = fields["n"] as String
        val to get() = fields["to"] as String
        val t2 get() = fields["t2"] as Long
        val t3 get() = fields["t3"] as Long
        val errMs get() = fields["err"] as Long
        val hops get() = (fields["hops"] as Long).toInt()
        /** The address that signed it, or null. */
        fun signer(): String? = (fields["sig"] as? String)?.let { Eth.recoverMessageAddress(Canonical.json(fields - "sig"), it) }
    }

    fun isTime(payload: ByteArray) = payload.size > prefix.size && prefix.indices.all { payload[it] == prefix[it] }

    fun ask(nonce: String, site: String, from: String): ByteArray =
        (PREFIX + Canonical.json(mapOf("k" to "q", "n" to nonce, "site" to site, "from" to from))).toByteArray()

    fun answer(site: String, sender: String, addr: String, ask: Ask, t2: Long, t3: Long, errMs: Long, hops: Int, sign: (String) -> String): ByteArray {
        val f = mapOf<String, Any>("k" to "r", "v" to 1L, "site" to site, "sender" to sender, "addr" to addr, "n" to ask.nonce,
            "to" to ask.from, "t2" to t2, "t3" to t3, "err" to errMs, "hops" to hops.toLong())
        return (PREFIX + Canonical.json(f + ("sig" to sign(Canonical.json(f))))).toByteArray()
    }

    fun parse(payload: ByteArray): Msg? {
        if (!isTime(payload)) return null
        val m = MeshMsg.parseFlat(payload.copyOfRange(prefix.size, payload.size)) ?: return null
        return when (m["k"]) {
            "q" -> if (listOf("n", "site", "from").all { m[it] is String }) Ask(m["n"] as String, m["site"] as String, m["from"] as String) else null
            "r" -> if (m["v"] == 1L && listOf("site", "sender", "addr", "n", "to", "sig").all { m[it] is String } &&
                listOf("t2", "t3", "err", "hops").all { m[it] is Long }) Answer(m) else null
            else -> null
        }
    }
}
