// Tremor Witness Mesh — new code (not from bitchat/SafeMesh). GPL-3.0 as part of this app.
package dev.dhruv.twmesh.chain

import com.google.gson.Gson
import com.google.gson.JsonArray
import com.google.gson.JsonElement
import com.google.gson.JsonObject
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import java.math.BigInteger
import java.util.concurrent.TimeUnit

private val JSON = "application/json".toMediaType()
private val gson = Gson()
private val http = OkHttpClient.Builder().connectTimeout(15, TimeUnit.SECONDS).readTimeout(90, TimeUnit.SECONDS).build()

class RpcException(msg: String) : Exception(msg)

/** Minimal Ethereum JSON-RPC client (blocking: call from a background thread). */
class Rpc(private val url: String = Tw.SEPOLIA_RPC, private val client: OkHttpClient = http) {
    private var id = 0
    fun request(method: String, vararg params: Any): JsonElement {
        val body = JsonObject().apply {
            addProperty("jsonrpc", "2.0"); addProperty("id", ++id); addProperty("method", method)
            add("params", gson.toJsonTree(params))
        }
        val req = Request.Builder().url(url).post(gson.toJson(body).toRequestBody(JSON)).build()
        client.newCall(req).execute().use { r ->
            val text = r.body.string()
            if (r.code == 429) throw RpcException("rate limited (429)")
            val o = gson.fromJson(text, JsonObject::class.java) ?: throw RpcException("empty RPC reply (${r.code})")
            o["error"]?.let { throw RpcException(it.toString().take(300)) }
            return o["result"] ?: throw RpcException("no result")
        }
    }

    fun call(to: String, data: ByteArray): ByteArray =
        Hex.decode(request("eth_call", mapOf("to" to to, "data" to Hex.encode(data)), "latest").asString)

    fun blockNumber(): Long = BigInteger(request("eth_blockNumber").asString.removePrefix("0x"), 16).toLong()

    fun getLogs(address: String, from: Long, to: String): JsonArray =
        request("eth_getLogs", mapOf("address" to address, "fromBlock" to "0x" + from.toString(16), "toBlock" to to)).asJsonArray
}

/** A live phone of a site, as the web app's listSitePhones() reports it. */
data class EnsPhone(val label: String, val name: String, val owner: String, val expiry: Long)

/** Read-only ENSv2 (Sepolia) access, mirroring packages/chain/src/ens.ts. */
class Ens(private val rpc: Rpc = Rpc()) {
    companion object {
        val TOPIC_REGISTERED = Hex.encode(keccak256("LabelRegistered(uint256,bytes32,string,address,uint64,address)"))
        val TOPIC_UNREGISTERED = Hex.encode(keccak256("LabelUnregistered(uint256,address)"))
        val TOPIC_EXPIRY = Hex.encode(keccak256("ExpiryUpdated(uint256,uint64,address)"))
        val TOPIC_REGENERATED = Hex.encode(keccak256("TokenRegenerated(uint256,uint256)"))
        const val CHUNK = 45_000L

        fun salt(site: String) = keccak256("tremor-witness:${Tw.ENS_PARENT}:${site.lowercase()}:registry")
        fun predictCalldata(site: String) =
            Abi.call("predictProxyAddress(address,uint256)", Abi.address(Tw.COMMITTEE), salt(site))
        fun resolveAddrCalldata(name: String): ByteArray {
            val inner = Abi.call("addr(bytes32)", EnsName.namehash(name))
            return Abi.call("resolve(bytes,bytes)", Abi.Dyn(EnsName.dnsEncode(name)), Abi.Dyn(inner))
        }

        /** Replay registry logs into the live phone set (same rules as listSitePhones). */
        fun phonesFromLogs(site: String, logs: List<JsonObject>, nowSec: Long): List<EnsPhone> {
            data class Reg(val label: String, val owner: String, var expiry: Long)
            val reg = LinkedHashMap<String, Reg>()
            for (l in logs) {
                val topics = l["topics"].asJsonArray.map { it.asString.lowercase() }
                if (topics.isEmpty()) continue
                val data = Hex.decode(l["data"].asString)
                when (topics[0]) {
                    TOPIC_REGISTERED -> reg[topics[1]] = Reg(
                        String(Abi.dynAt(data, 0), Charsets.UTF_8), Abi.addressAt(data, 1), Abi.uintAt(data, 2).toLong()
                    )
                    TOPIC_UNREGISTERED -> reg.remove(topics[1])
                    TOPIC_REGENERATED -> reg.remove(topics[1])?.let { reg[topics[2]] = it }
                    TOPIC_EXPIRY -> reg[topics[1]]?.expiry = BigInteger(topics[2].removePrefix("0x"), 16).toLong()
                }
            }
            return reg.values.filter { it.expiry > nowSec }.map { EnsPhone(it.label, Tw.phoneName(site, it.label), it.owner, it.expiry) }
        }
    }

    fun siteRegistry(site: String): String = Abi.addressAt(rpc.call(Tw.VERIFIABLE_FACTORY, predictCalldata(site)), 0)

    /** Live phones of a site plus the block the snapshot was taken at. */
    fun listSitePhones(site: String): Pair<List<EnsPhone>, Long> {
        val r2 = siteRegistry(site)
        val latest = rpc.blockNumber()
        val logs = ArrayList<JsonObject>()
        var from = Tw.ENS_DEPLOY_BLOCK
        while (from <= latest) {
            // Last chunk uses "latest": load-balanced public RPCs can lag behind the head we just read.
            val to = if (from + CHUNK - 1 >= latest) "latest" else "0x" + (from + CHUNK - 1).toString(16)
            val got = try { rpc.getLogs(r2, from, to) } catch (e: RpcException) { Thread.sleep(1500); rpc.getLogs(r2, from, to) }
            got.forEach { logs += it.asJsonObject }
            from += CHUNK
        }
        logs.sortWith(compareBy({ BigInteger(it["blockNumber"].asString.removePrefix("0x"), 16) }, { BigInteger(it["logIndex"].asString.removePrefix("0x"), 16) }))
        return phonesFromLogs(site, logs, System.currentTimeMillis() / 1000) to latest
    }

    /** What the name resolves to right now via the Universal Resolver (null = not found / revoked). */
    fun resolveAddress(name: String): String? = try {
        val out = rpc.call(Tw.UNIVERSAL_RESOLVER, resolveAddrCalldata(name))
        val result = Abi.dynAt(out, 0)
        if (result.size < 32) null else Abi.addressAt(result, 0).takeIf { it != "0x0000000000000000000000000000000000000000" }
    } catch (_: RpcException) { null }

    fun siteText(site: String, key: String): String? = try {
        val name = Tw.siteName(site)
        val inner = Abi.call("text(bytes32,string)", EnsName.namehash(name), Abi.Dyn(key.toByteArray()))
        val out = rpc.call(Tw.UNIVERSAL_RESOLVER, Abi.call("resolve(bytes,bytes)", Abi.Dyn(EnsName.dnsEncode(name)), Abi.Dyn(inner)))
        String(Abi.dynAt(Abi.dynAt(out, 0), 0), Charsets.UTF_8).ifEmpty { null }
    } catch (_: Exception) { null }
}

/** The Tremor Witness backend's public endpoints (BRIEF §4). Never holds the committee passcode. */
class TwApi(private val base: String = Tw.API_BASE, private val client: OkHttpClient = http) {
    data class Reply(val code: Int, val ok: Boolean, val error: String?, val json: JsonObject)

    fun post(path: String, body: Map<String, Any>): Reply {
        val req = Request.Builder().url(base.trimEnd('/') + path).post(gson.toJson(body).toRequestBody(JSON)).build()
        client.newCall(req).execute().use { r ->
            val o = try { gson.fromJson(r.body.string(), JsonObject::class.java) } catch (_: Exception) { null } ?: JsonObject()
            val ok = o["ok"]?.asBoolean ?: false
            return Reply(r.code, ok, o["error"]?.takeIf { !it.isJsonNull }?.asString ?: if (!ok) "HTTP ${r.code}" else null, o)
        }
    }

    fun drip(address: String, sepolia: Boolean = false) =
        post("/api/drip", if (sepolia) mapOf("address" to address, "chain" to "sepolia") else mapOf("address" to address))

    fun register(site: String, label: String, address: String, invite: String) =
        post("/api/ens-register", mapOf("site" to site, "label" to label, "address" to address, "invite" to invite))

    fun serverTimeMs(): Long {
        client.newCall(Request.Builder().url(base.trimEnd('/') + "/api/time").build()).execute().use { r ->
            return gson.fromJson(r.body.string(), JsonObject::class.java)["t"].asLong
        }
    }
}
