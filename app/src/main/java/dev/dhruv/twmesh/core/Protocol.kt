// Tremor Witness Mesh — new code (not from bitchat/SafeMesh). GPL-3.0 as part of this app.
package dev.dhruv.twmesh.core

import com.google.gson.Gson
import com.google.gson.JsonObject
import com.google.gson.JsonPrimitive
import dev.dhruv.twmesh.chain.Eth
import dev.dhruv.twmesh.chain.Hex
import dev.dhruv.twmesh.chain.keccak256
import java.security.SecureRandom

/**
 * BRIEF §5 mesh messages: flat JSON {v:1, type, site, sender (ENS label), addr, tMs, nonce, sig, …body}.
 * sig = EIP-191 personal_sign over the canonical JSON of every field except sig (keys sorted, no whitespace,
 * integers only, strings escaped like JSON.stringify). id = keccak256(canonical JSON including sig), lowercase hex.
 */
data class MeshMsg(val fields: Map<String, Any>) {
    val type get() = fields["type"] as String
    val site get() = fields["site"] as String
    val sender get() = fields["sender"] as String
    val addr get() = fields["addr"] as String
    val tMs get() = (fields["tMs"] as Number).toLong()
    val sig get() = fields["sig"] as? String
    fun str(k: String) = fields[k] as? String
    fun long(k: String) = (fields[k] as? Number)?.toLong()

    val signingText get() = Canonical.json(fields - "sig")
    val wire get() = Canonical.json(fields)
    val id: String get() = Hex.encode(keccak256(wire)).removePrefix("0x")

    companion object {
        const val V = 1L
        val TYPES = setOf("hello", "dtrigger", "dmanual", "checkin")
        private val gson = Gson()
        private val rnd = SecureRandom()

        fun build(type: String, site: String, sender: String, addr: String, tMs: Long, body: Map<String, Any>, sign: (String) -> String): MeshMsg {
            val nonce = Hex.encode(ByteArray(8).also { rnd.nextBytes(it) }).removePrefix("0x")
            val f = body + mapOf("v" to V, "type" to type, "site" to site, "sender" to sender, "addr" to addr, "tMs" to tMs, "nonce" to nonce)
            return MeshMsg(f + ("sig" to sign(Canonical.json(f))))
        }

        /** Parse wire JSON: flat object of strings and integers only (anything else is rejected). */
        fun parse(bytes: ByteArray): MeshMsg? = try {
            val o = gson.fromJson(String(bytes, Charsets.UTF_8), JsonObject::class.java)
            val m = LinkedHashMap<String, Any>()
            for ((k, v) in o.entrySet()) {
                val p = v as? JsonPrimitive ?: return null
                m[k] = when {
                    p.isString -> p.asString
                    p.isNumber -> p.asString.toLongOrNull() ?: return null
                    else -> return null
                }
            }
            if (m["v"] != V || m["type"] !in TYPES || listOf("site", "sender", "addr", "nonce", "sig").any { m[it] !is String } || m["tMs"] !is Long) null
            else MeshMsg(m)
        } catch (_: Exception) { null }
    }
}

object Canonical {
    fun json(m: Map<String, Any>): String = m.keys.sorted().joinToString(",", "{", "}") { k ->
        quote(k) + ":" + when (val v = m[k]) {
            is String -> quote(v)
            is Int, is Long -> v.toString()
            else -> error("canonical JSON: only strings and integers ($k)")
        }
    }
    /** Same escaping as JSON.stringify. */
    fun quote(s: String): String = buildString {
        append('"')
        for (c in s) when (c) {
            '"' -> append("\\\""); '\\' -> append("\\\\")
            '\b' -> append("\\b"); '\u000C' -> append("\\f"); '\n' -> append("\\n"); '\r' -> append("\\r"); '\t' -> append("\\t")
            else -> if (c < ' ') append("\\u%04x".format(c.code)) else append(c)
        }
        append('"')
    }
}

enum class Verdict { ACCEPT, BAD_SIGNATURE, WRONG_SITE, NOT_REGISTERED, DUPLICATE, RATE_LIMITED, NO_ROSTER, BAD_BODY }

/**
 * Receiver-side checks (BRIEF §5): signature recovers to addr; addr owned <sender>.<site> as of tMs and as of when we
 * first heard it (as-of rule); dedupe on message id; ≤ 10 messages / minute / sender. Hop limit (7) is SafeMesh's TTL.
 */
class Verifier(private val maxPerMinute: Int = 10) {
    private val seen = LinkedHashMap<String, Long>()
    private val recent = HashMap<String, ArrayDeque<Long>>()

    fun check(m: MeshMsg, site: String, isRegistered: ((label: String, addr: String, tMs: Long, heardAtMs: Long) -> Boolean)?, heardAtMs: Long): Verdict {
        if (m.id in seen) return Verdict.DUPLICATE
        if (!m.site.equals(site, ignoreCase = true)) return Verdict.WRONG_SITE
        if (!bodyOk(m)) return Verdict.BAD_BODY
        val sig = m.sig ?: return Verdict.BAD_SIGNATURE
        val signer = Eth.recoverMessageAddress(m.signingText, sig)
        if (signer == null || !signer.equals(m.addr, ignoreCase = true)) return Verdict.BAD_SIGNATURE
        if (isRegistered == null) return Verdict.NO_ROSTER
        if (!isRegistered(m.sender, m.addr, m.tMs, heardAtMs)) return Verdict.NOT_REGISTERED
        val q = recent.getOrPut(m.sender) { ArrayDeque() }
        while (q.isNotEmpty() && heardAtMs - q.first() >= 60_000) q.removeFirst()
        if (q.size >= maxPerMinute) return Verdict.RATE_LIMITED
        q.addLast(heardAtMs)
        seen[m.id] = heardAtMs
        if (seen.size > 5000) seen.remove(seen.keys.first())
        return Verdict.ACCEPT
    }

    private fun bodyOk(m: MeshMsg) = when (m.type) {
        "checkin" -> m.str("status") in setOf("safe", "help") && (m.str("note")?.length ?: 0) <= 80
        "dtrigger" -> m.long("ppvUm") != null && m.long("fDomCHz") != null && m.str("label") in setOf("structural", "handling")
        else -> true
    }
}
