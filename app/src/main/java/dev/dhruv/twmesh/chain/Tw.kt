// Tremor Witness Mesh — new code (not from bitchat/SafeMesh). GPL-3.0 as part of this app.
package dev.dhruv.twmesh.chain

import com.google.gson.Gson
import com.google.gson.JsonObject
import java.util.Base64

/**
 * Protocol constants copied from the Tremor Witness repo (packages/chain/src/ens.ts, ensv2-abi.ts, invite.ts).
 * Public addresses only; nothing secret.
 */
object Tw {
    const val API_BASE = "https://tremor-witness.vercel.app"
    const val SEPOLIA_RPC = "https://ethereum-sepolia-rpc.publicnode.com"
    const val ENS_PARENT = "tremorwitness"
    /** Committee = deployer of the ENS proxies; also signs invites. */
    const val COMMITTEE = "0x32DE3a68b15D2b2A1527cA6cd717Fb21A639500F"
    const val ENS_DEPLOY_BLOCK = 12072217L
    const val ENS_RESOLVER = "0xFA87654E65542Ad82428f3326c322d6a12C55957"
    const val ENS_PARENT_REGISTRY = "0xf2EC49c03254C9F4F2843B00B1ECF277dDbeF76B"
    const val VERIFIABLE_FACTORY = "0xda70306c98e97ece36f997a21368e53298572991"
    /** viem's Sepolia ensUniversalResolver (what the web app's getEnsAddress uses). */
    const val UNIVERSAL_RESOLVER = "0xeeeeeeee14d718c2b47d9923deab1335e144eeee"
    const val MAX_PHONES_PER_SITE = 5          // web (sensing) phones, default when tw.max_phones is unset
    const val MAX_MESH_PHONES_PER_SITE = 15    // mesh phones, default when tw.max_mesh is unset
    const val HARD_MAX_PHONES = 20
    const val HARD_MAX_MESH = 50
    const val MAX_INVITE_USES = 50
    fun isMeshLabel(label: String) = label.startsWith("mesh-")
    val LABEL_RE = Regex("^[a-z0-9][a-z0-9-]{1,30}[a-z0-9]$")

    fun phoneName(site: String, label: String) = "${label.lowercase()}.${site.lowercase()}.$ENS_PARENT.eth"
    fun siteName(site: String) = "${site.lowercase()}.$ENS_PARENT.eth"
}

/** A committee-signed, single-use, 30-minute invite (packages/chain/src/invite.ts). */
/** [raw] is the encoded form, sent to /api/ens-register unchanged. */
data class Invite(val site: String, val inviteId: String, val exp: Long, val sig: String, val raw: String = "", val uses: Int? = null) {
    /** v1: single use (live today). v2: multi-use demo invite, proposed in BACKEND_REQUESTS R5. */
    val message get() = if (uses == null) "tremor-witness invite v1|site=$site|id=$inviteId|exp=$exp"
        else "tremor-witness invite v2|site=$site|id=$inviteId|exp=$exp|uses=$uses"
    fun signer(): String? = Eth.recoverMessageAddress(message, sig)
    fun signedByCommittee(committee: String = Tw.COMMITTEE) = signer()?.equals(committee, ignoreCase = true) == true

    companion object {
        private val gson = Gson()

        /** Accepts the dashboard QR URL (`?site=…&inv=…`, or `invite=`), or the bare encoded invite. */
        fun parse(text: String): Invite? {
            val t = text.trim()
            val enc = if (t.startsWith("http://") || t.startsWith("https://")) queryParam(t, "inv") ?: queryParam(t, "invite") else t
            return enc?.let { decode(it) }
        }

        private fun queryParam(url: String, key: String): String? =
            url.substringAfter('?', "").substringBefore('#').split('&')
                .firstOrNull { it.substringBefore('=') == key }?.substringAfter('=', "")
                ?.let { java.net.URLDecoder.decode(it, "UTF-8") }?.ifEmpty { null }

        fun decode(s: String): Invite? = try {
            val b64 = s.replace('-', '+').replace('_', '/').let { it + "=".repeat((4 - it.length % 4) % 4) }
            val o = gson.fromJson(String(Base64.getDecoder().decode(b64), Charsets.UTF_8), JsonObject::class.java)
            val i = Invite(o["site"].asString, o["inviteId"].asString, o["exp"].asLong, o["sig"].asString, s, o["uses"]?.asInt)
            if (Regex("^[0-9a-f]{32}$").matches(i.inviteId) && Regex("^0x[0-9a-fA-F]+$").matches(i.sig) &&
                (i.uses == null || i.uses in 1..Tw.MAX_INVITE_USES)) i else null
        } catch (_: Exception) { null }

    }
}

/**
 * Per-site limits and quorum numbers from the site's ENS text records, read exactly like packages/chain/src/ens.ts
 * (siteLimits / siteParams / siteDisasterParams), checked by test/resources/golden/limits-v1.json.
 */
object SiteRecords {
    data class Limits(val maxPhones: Int, val maxMesh: Int, val fromEns: Boolean)

    /** JavaScript's Number(string) for the inputs a text record can hold (NaN when JS gives NaN). */
    fun jsNumber(s: String): Double {
        val t = s.trim()
        return when {
            t.isEmpty() -> 0.0
            Regex("^0[xX][0-9a-fA-F]+$").matches(t) -> java.math.BigInteger(t.substring(2), 16).toDouble()
            Regex("^0[oO][0-7]+$").matches(t) -> java.math.BigInteger(t.substring(2), 8).toDouble()
            Regex("^0[bB][01]+$").matches(t) -> java.math.BigInteger(t.substring(2), 2).toDouble()
            Regex("^[+-]?(\\d+\\.?\\d*|\\.\\d+)([eE][+-]?\\d+)?$").matches(t) -> t.toDouble()
            Regex("^[+-]?Infinity$").matches(t) -> if (t.startsWith("-")) Double.NEGATIVE_INFINITY else Double.POSITIVE_INFINITY
            else -> Double.NaN
        }
    }
    private fun isInteger(d: Double) = d.isFinite() && d == Math.floor(d)

    /** `clamp` in siteLimits: an integer record is clamped to 0..hi, anything else (or missing/empty) gives the default. */
    fun clamp(v: String?, default: Int, hi: Int): Int {
        if (v.isNullOrEmpty()) return default
        val n = jsNumber(v)
        return if (isInteger(n)) n.coerceIn(0.0, hi.toDouble()).toInt() else default
    }

    fun limits(maxPhones: String?, maxMesh: String?) =
        Limits(clamp(maxPhones, Tw.MAX_PHONES_PER_SITE, Tw.HARD_MAX_PHONES), clamp(maxMesh, Tw.MAX_MESH_PHONES_PER_SITE, Tw.HARD_MAX_MESH), !maxMesh.isNullOrEmpty())

    /**
     * k / window: ens.ts gives Number(text) (could be 0, 2.5 or NaN). The quorum needs a positive whole number, so the
     * app takes the same number only when it is one, and otherwise treats the record as missing (falls back, and says so).
     */
    fun positiveInt(v: String?): Long? {
        if (v.isNullOrEmpty()) return null
        val n = jsNumber(v)
        return if (isInteger(n) && n >= 1 && n <= Int.MAX_VALUE) n.toLong() else null
    }
}
