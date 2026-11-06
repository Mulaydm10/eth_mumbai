// Tremor Witness Mesh — new code (not from bitchat/SafeMesh). GPL-3.0 as part of this app.
package dev.dhruv.twmesh.chain

import java.math.BigInteger

/** The few Solidity ABI encodings the app needs (static words + dynamic bytes). */
object Abi {
    fun selector(signature: String): ByteArray = keccak256(signature).copyOfRange(0, 4)

    fun word(v: BigInteger): ByteArray {
        val b = v.toByteArray().let { if (it.size > 32) it.copyOfRange(it.size - 32, it.size) else it }
        return ByteArray(32 - b.size) + b
    }
    fun word(v: Long) = word(BigInteger.valueOf(v))
    fun address(a: String): ByteArray = ByteArray(12) + Hex.decode(a).also { require(it.size == 20) { "bad address" } }
    fun bytes32(b: ByteArray): ByteArray { require(b.size == 32); return b }

    /** Encode args where each is either a static 32-byte word or Dyn(bytes). */
    class Dyn(val data: ByteArray)
    fun encode(vararg args: Any): ByteArray {
        val head = ArrayList<ByteArray>(); val tail = ArrayList<ByteArray>()
        var tailLen = 32L * args.size
        for (a in args) when (a) {
            is ByteArray -> { require(a.size == 32); head += a }
            is Dyn -> {
                head += word(tailLen)
                val padded = a.data + ByteArray((32 - a.data.size % 32) % 32)
                tail += word(a.data.size.toLong()) + padded
                tailLen += 32 + padded.size
            }
            else -> error("unsupported arg $a")
        }
        return (head + tail).fold(ByteArray(0)) { acc, b -> acc + b }
    }
    fun call(signature: String, vararg args: Any): ByteArray = selector(signature) + encode(*args)

    // ---- decoding
    fun wordAt(data: ByteArray, i: Int): ByteArray = data.copyOfRange(i * 32, i * 32 + 32)
    fun uintAt(data: ByteArray, i: Int): BigInteger = BigInteger(1, wordAt(data, i))
    fun addressAt(data: ByteArray, i: Int): String = Eth.checksum(wordAt(data, i).copyOfRange(12, 32))
    /** Dynamic bytes/string whose offset word is at index i. */
    fun dynAt(data: ByteArray, i: Int): ByteArray {
        val off = uintAt(data, i).toInt()
        val len = BigInteger(1, data.copyOfRange(off, off + 32)).toInt()
        return data.copyOfRange(off + 32, off + 32 + len)
    }
}

/** ENS name helpers (ENSIP-1 namehash, DNS wire format). Labels are already normalized (LABEL_RE: a-z 0-9 -). */
object EnsName {
    fun namehash(name: String): ByteArray {
        var node = ByteArray(32)
        if (name.isEmpty()) return node
        for (label in name.split(".").reversed()) node = keccak256(node + keccak256(label))
        return node
    }
    fun dnsEncode(name: String): ByteArray =
        name.split(".").fold(ByteArray(0)) { acc, l -> val b = l.toByteArray(Charsets.UTF_8); acc + byteArrayOf(b.size.toByte()) + b } + byteArrayOf(0)
}
