// Tremor Witness Mesh — new code (not from bitchat/SafeMesh). GPL-3.0 as part of this app.
// Kotlin port of the Arkiv writes the Tremor Witness repo defines in packages/chain/src/mesh.ts (R2 dtrigger, R3 checkin),
// encoded the way @arkiv-network/sdk 1.0.1 encodes them (execute((uint8,bytes)[]) on 0x44…44). Checked byte for byte
// against app/src/test/resources/golden/arkiv-v1.json (tools/golden/arkiv-vectors.mjs runs the real mesh.ts).
package dev.dhruv.twmesh.chain

import java.math.BigInteger

/** Nested ABI values (enough for Arkiv's execute call). */
sealed class AbiV {
    abstract val dynamic: Boolean
    class Word(val b: ByteArray) : AbiV() { override val dynamic = false }
    class Bytes(val b: ByteArray) : AbiV() { override val dynamic = true }
    class Tuple(val items: List<AbiV>) : AbiV() { override val dynamic get() = items.any { it.dynamic } }
    class Arr(val items: List<AbiV>) : AbiV() { override val dynamic = true }

    fun encode(): ByteArray = when (this) {
        is Word -> b
        is Bytes -> Abi.word(b.size.toLong()) + b + ByteArray((32 - b.size % 32) % 32)
        is Tuple -> encodeSeq(items)
        is Arr -> Abi.word(items.size.toLong()) + encodeSeq(items)
    }

    companion object {
        fun uint(v: Long) = Word(Abi.word(v))
        fun uint(v: BigInteger) = Word(Abi.word(v))
        fun encodeSeq(items: List<AbiV>): ByteArray {
            val heads = ArrayList<ByteArray>(); val tails = ArrayList<ByteArray>()
            var tailOff = items.sumOf { if (it.dynamic) 32 else it.encode().size }.toLong()
            for (it in items) {
                if (it.dynamic) { val e = it.encode(); heads += Abi.word(tailOff); tails += e; tailOff += e.size }
                else heads += it.encode()
            }
            return (heads + tails).fold(ByteArray(0)) { a, b -> a + b }
        }
        /** encodeAbiParameters of one top-level param. */
        fun params(vararg p: AbiV) = encodeSeq(p.toList())
    }
}

/** Minimal RLP + EIP-1559 (type 2) transaction signing. */
object Tx {
    private fun bytesOf(v: BigInteger): ByteArray = if (v.signum() == 0) ByteArray(0) else v.toByteArray().dropWhile { it == 0.toByte() }.toByteArray()
    fun rlp(item: Any): ByteArray = when (item) {
        is ByteArray -> if (item.size == 1 && (item[0].toInt() and 0xff) < 0x80) item else lenPrefix(item.size, 0x80) + item
        is BigInteger -> rlp(bytesOf(item))
        is Long -> rlp(BigInteger.valueOf(item))
        is Int -> rlp(BigInteger.valueOf(item.toLong()))
        is List<*> -> { val body = item.fold(ByteArray(0)) { a, x -> a + rlp(x!!) }; lenPrefix(body.size, 0xc0) + body }
        else -> error("rlp: $item")
    }
    private fun lenPrefix(n: Int, base: Int): ByteArray = if (n < 56) byteArrayOf((base + n).toByte()) else {
        val l = bytesOf(BigInteger.valueOf(n.toLong())); byteArrayOf((base + 55 + l.size).toByte()) + l
    }

    fun signEip1559(chainId: Long, nonce: Long, maxPriority: BigInteger, maxFee: BigInteger, gas: Long, to: String, value: BigInteger,
                    data: ByteArray, priv: ByteArray): ByteArray {
        val fields = listOf<Any>(chainId, nonce, maxPriority, maxFee, gas, Hex.decode(to), value, data, emptyList<Any>())
        val sig = Eth.signHash(keccak256(byteArrayOf(2) + rlp(fields)), priv)
        val yParity = (sig[64].toInt() and 0xff) - 27
        return byteArrayOf(2) + rlp(fields + listOf(yParity.toLong(), BigInteger(1, sig.copyOfRange(0, 32)), BigInteger(1, sig.copyOfRange(32, 64))))
    }
}

object Arkiv {
    const val ADDRESS = "0x4400000000000000000000000000000000000044"
    const val RPC = "https://rpc.rabdi.db-chain.testnet.arkiv.network"   // public endpoint, no access key (BRIEF §4)
    const val CHAIN_ID = 7794095L
    const val APP_TAG = "tremor-witness.v1"
    const val DTRIGGER_DAYS = 180
    const val CHECKIN_DAYS = 30
    private const val BLOCK_TIME_S = 2
    private const val INDEXED = 128
    private val TYPE = mapOf("u64" to 3, "bytes" to 7, "str" to 8)
    private const val READONLY = 1
    val ENTITY_CREATED = Hex.encode(keccak256("EntityCreated(bytes32,address,uint64,uint8)"))

    private class Attr(val name: ByteArray, val typeId: Int, val value: ByteArray)
    private fun attr(name: String, type: String, indexed: Boolean, value: ByteArray): Attr {
        val n = name.toByteArray(Charsets.UTF_8); require(n.size <= 32)
        return Attr(n + ByteArray(32 - n.size), TYPE.getValue(type) or (if (indexed) INDEXED else 0), value)
    }
    private fun str(name: String, v: String, indexed: Boolean) = attr(name, "str", indexed, v.toByteArray(Charsets.UTF_8))
    private fun u64(name: String, v: Long, indexed: Boolean) = attr(name, "u64", indexed, Abi.word(v))

    /** JS String.prototype.slice(0, n) on UTF-16 code units, like mesh.ts. */
    private fun jsSlice(s: String, n: Int) = if (s.length <= n) s else s.substring(0, n)

    data class DTrigger(val site: String, val sensor: String, val tMs: Long, val ppvUm: Long, val fDomCHz: Long, val kind: String, val label: String, val seq: Long)
    data class Checkin(val site: String, val sensor: String, val tMs: Long, val status: String, val note: String, val armMs: Long, val seq: Long, val encLoc: ByteArray = ByteArray(0))

    private fun dtriggerAttrs(t: DTrigger) = listOf(
        str("arkiv.schema", "$APP_TAG.dtrigger", true),
        str("site", jsSlice(t.site, 64), true), str("sensor", jsSlice(t.sensor, 64), true), u64("tMs", t.tMs, true),
        u64("ppvUm", maxOf(0, t.ppvUm), false), u64("fDomCHz", maxOf(0, t.fDomCHz), false),
        str("kind", t.kind, true), str("label", if (t.kind == "auto") t.label.ifEmpty { "structural" } else "", false), u64("seq", t.seq, true),
    )
    private fun checkinAttrs(c: Checkin): List<Attr> {
        val n = jsSlice(c.note, 80).let { if (it.toByteArray(Charsets.UTF_8).size <= 128) it else "" }
        return listOf(
            str("arkiv.schema", "$APP_TAG.checkin", true),
            str("site", jsSlice(c.site, 64), true), str("sensor", jsSlice(c.sensor, 64), true), u64("tMs", c.tMs, true),
            str("status", c.status, true), str("note", n, false), u64("armMs", c.armMs, false), u64("seq", c.seq, true),
            attr("encLoc", "bytes", false, c.encLoc),
        )
    }

    private fun createCalldata(attrs: List<Attr>, days: Int, salt: BigInteger): ByteArray {
        val sorted = attrs.sortedWith { a, b -> Hex.encode(a.name).compareTo(Hex.encode(b.name)) }
        val minLifetime = days.toLong() * 86_400 / BLOCK_TIME_S
        val payload = AbiV.params(AbiV.Tuple(listOf(
            AbiV.uint(salt), AbiV.uint(0), AbiV.uint(minLifetime), AbiV.uint(READONLY.toLong()),
            AbiV.Arr(sorted.map { AbiV.Tuple(listOf(AbiV.Word(it.name), AbiV.uint(it.typeId.toLong()), AbiV.Bytes(it.value))) }),
        )))
        val ops = AbiV.Arr(listOf(AbiV.Tuple(listOf(AbiV.uint(1), AbiV.Bytes(payload)))))   // OperationType.Create = 1
        return Abi.selector("execute((uint8,bytes)[])") + AbiV.params(ops)
    }
    fun calldata(t: DTrigger, salt: BigInteger) = createCalldata(dtriggerAttrs(t), DTRIGGER_DAYS, salt)
    fun calldata(c: Checkin, salt: BigInteger) = createCalldata(checkinAttrs(c), CHECKIN_DAYS, salt)

    fun randomSalt(): BigInteger = BigInteger(1, ByteArray(16).also { java.security.SecureRandom().nextBytes(it) })
}

/** Writes one entity with the phone's own key (so $creator = the phone). Blocking; call off the main thread. */
class ArkivWriter(private val rpc: Rpc = Rpc(Arkiv.RPC)) {
    data class Written(val txHash: String, val entityKey: String, val owner: String)

    fun write(calldata: ByteArray, priv: ByteArray): Written {
        val from = Eth.address(priv)
        val gasEst = BigInteger(rpc.request("eth_estimateGas", mapOf("from" to from, "to" to Arkiv.ADDRESS, "data" to Hex.encode(calldata))).asString.removePrefix("0x"), 16)
        val gas = gasEst + gasEst.divide(BigInteger.valueOf(4))                       // +25 % headroom like the SDK
        val nonce = BigInteger(rpc.request("eth_getTransactionCount", from, "pending").asString.removePrefix("0x"), 16).toLong()
        val base = BigInteger((rpc.request("eth_getBlockByNumber", "latest", false).asJsonObject["baseFeePerGas"]?.asString ?: "0x0").removePrefix("0x"), 16)
        val prio = try { BigInteger(rpc.request("eth_maxPriorityFeePerGas").asString.removePrefix("0x"), 16) } catch (_: Exception) { BigInteger.ONE }
        val maxFee = base.multiply(BigInteger.TWO) + prio
        val raw = Tx.signEip1559(Arkiv.CHAIN_ID, nonce, prio, maxFee, gas.toLong(), Arkiv.ADDRESS, BigInteger.ZERO, calldata, priv)
        val hash = rpc.request("eth_sendRawTransaction", Hex.encode(raw)).asString
        repeat(45) {
            val r = rpc.request("eth_getTransactionReceipt", hash)
            if (!r.isJsonNull) {
                val o = r.asJsonObject
                if (o["status"].asString != "0x1") throw RpcException("Arkiv transaction reverted: $hash")
                val log = o["logs"].asJsonArray.map { it.asJsonObject }.firstOrNull {
                    it["address"].asString.equals(Arkiv.ADDRESS, true) && it["topics"].asJsonArray[0].asString.equals(Arkiv.ENTITY_CREATED, true)
                } ?: throw RpcException("no EntityCreated in $hash")
                val topics = log["topics"].asJsonArray.map { it.asString }
                return Written(hash, topics[1], Eth.checksum(Hex.decode(topics[2]).copyOfRange(12, 32)))
            }
            Thread.sleep(2000)
        }
        throw RpcException("no receipt for $hash after 90 s")
    }

    fun balance(address: String): BigInteger = BigInteger(rpc.request("eth_getBalance", address, "latest").asString.removePrefix("0x"), 16)

}
