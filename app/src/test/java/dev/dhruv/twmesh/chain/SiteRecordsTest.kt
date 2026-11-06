package dev.dhruv.twmesh.chain

import com.google.gson.Gson
import com.google.gson.JsonObject
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNull
import org.junit.Test

/** Site limits / quorum records read like packages/chain/src/ens.ts (vectors: tools/golden/limits-vectors.mts). */
class SiteRecordsTest {
    private val g = Gson().fromJson(javaClass.getResource("/golden/limits-v1.json")!!.readText(), JsonObject::class.java)

    @Test fun defaultsMatch() {
        val d = g["defaults"].asJsonObject
        assertEquals(d["maxPhones"].asInt, Tw.MAX_PHONES_PER_SITE); assertEquals(d["maxMesh"].asInt, Tw.MAX_MESH_PHONES_PER_SITE)
        assertEquals(d["hardPhones"].asInt, Tw.HARD_MAX_PHONES); assertEquals(d["hardMesh"].asInt, Tw.HARD_MAX_MESH)
        assertEquals(d["maxInviteUses"].asInt, Tw.MAX_INVITE_USES)
    }

    @Test fun limitsIdenticalToSiteLimits() {
        val cases = g["cases"].asJsonArray
        assertEquals(21, cases.size())
        for (c in cases.map { it.asJsonObject }) {
            val text = c["text"].takeIf { !it.isJsonNull }?.asString
            val l = SiteRecords.limits(text, text)
            assertEquals("max_phones '$text'", c["maxPhones"].asInt, l.maxPhones)
            assertEquals("max_mesh '$text'", c["maxMesh"].asInt, l.maxMesh)
            assertEquals("fromEns '$text'", c["fromEns"].asBoolean, l.fromEns)
        }
    }

    /** k / window: the same number as ens.ts whenever that is a positive whole number; otherwise "missing" (fallback). */
    @Test fun quorumNumbersMatchWhenUsable() {
        for (c in g["cases"].asJsonArray.map { it.asJsonObject }) {
            val text = c["text"].takeIf { !it.isJsonNull }?.asString
            val ts = c["k"].takeIf { !it.isJsonNull }?.asDouble
            val app = SiteRecords.positiveInt(text)
            if (ts != null && ts >= 1 && ts == Math.floor(ts)) assertEquals("k '$text'", ts.toLong(), app)
            else assertNull("k '$text' (ens.ts: $ts) must fall back", app)
        }
    }

    @Test fun inviteUsesBounds() {
        fun enc(uses: Int) = java.util.Base64.getUrlEncoder().withoutPadding().encodeToString(
            """{"site":"s","inviteId":"0123456789abcdef0123456789abcdef","exp":1,"sig":"0xab","uses":$uses}""".toByteArray())
        assertEquals(50, Invite.decode(enc(50))?.uses)
        assertNull(Invite.decode(enc(51))); assertNull(Invite.decode(enc(0)))
    }
}
