// Tremor Witness Mesh — new code (not from bitchat/SafeMesh). GPL-3.0 as part of this app.
package dev.dhruv.twmesh.core

import com.google.gson.Gson
import com.google.gson.JsonObject
import dev.dhruv.twmesh.chain.Eth
import dev.dhruv.twmesh.chain.Hex
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertNull
import org.junit.Test

class ProtocolTest {
    private val v = Gson().fromJson(javaClass.classLoader!!.getResource("golden/chain-v1.json")!!.readText(), JsonObject::class.java)
    private val mesh = v["mesh"].asJsonObject
    private val pk = Hex.decode(v["key"].asJsonObject["privateKey"].asString)
    private val addr = Eth.address(pk)

    private fun fields(): Map<String, Any> = mesh["fields"].asJsonObject.entrySet().associate { (k, e) ->
        k to (if (e.asJsonPrimitive.isNumber) e.asLong else e.asString) }

    @Test fun `canonical JSON, signature, wire and id match viem`() {
        val f = fields()
        assertEquals(mesh["canonical"].asString, Canonical.json(f))
        assertEquals(mesh["signature"].asString, Eth.signMessage(Canonical.json(f), pk))
        val m = MeshMsg(f + ("sig" to mesh["signature"].asString))
        assertEquals(mesh["wire"].asString, m.wire)
        assertEquals(mesh["id"].asString, m.id)
        val back = MeshMsg.parse(m.wire.toByteArray())
        assertNotNull(back); assertEquals(m.id, back!!.id)
    }

    private val reg = { label: String, a: String, _: Long, _: Long -> label == "dhruv-m" && a.equals(addr, true) }
    private fun msg(type: String = "checkin", sender: String = "dhruv-m", t: Long = 1000, body: Map<String, Any> = mapOf("status" to "safe"), key: ByteArray = pk) =
        MeshMsg.build(type, "test2", sender, Eth.address(key), t, body) { Eth.signMessage(it, key) }

    @Test fun `verifier accepts a good message once`() {
        val ver = Verifier(); val m = msg()
        assertEquals(Verdict.ACCEPT, ver.check(m, "test2", reg, 1000))
        assertEquals(Verdict.DUPLICATE, ver.check(m, "test2", reg, 1001))
    }

    @Test fun `verifier rejects tampering, wrong site, unregistered, bad body, missing roster`() {
        val ver = Verifier()
        val m = msg()
        val tampered = MeshMsg(m.fields + ("status" to "help"))
        assertEquals(Verdict.BAD_SIGNATURE, ver.check(tampered, "test2", reg, 1000))
        val spoof = MeshMsg(m.fields + ("addr" to "0x" + "1".repeat(40)))
        assertEquals(Verdict.BAD_SIGNATURE, ver.check(spoof, "test2", reg, 1000))
        assertEquals(Verdict.WRONG_SITE, ver.check(msg(), "other", reg, 1000))
        assertEquals(Verdict.NOT_REGISTERED, ver.check(msg(sender = "mallory-m"), "test2", reg, 1000))
        assertEquals(Verdict.NOT_REGISTERED, ver.check(msg(key = Eth.newPrivateKey()), "test2", reg, 1000))
        assertEquals(Verdict.BAD_BODY, ver.check(msg(body = mapOf("status" to "maybe")), "test2", reg, 1000))
        assertEquals(Verdict.BAD_BODY, ver.check(msg(body = mapOf("status" to "help", "note" to "x".repeat(81))), "test2", reg, 1000))
        assertEquals(Verdict.NO_ROSTER, ver.check(msg(), "test2", null, 1000))
    }

    @Test fun `rate limit is 10 per minute per sender`() {
        val ver = Verifier()
        val got = (0 until 12).map { ver.check(msg(t = 1000L + it), "test2", reg, 1000L + it * 1000) }
        assertEquals(10, got.count { it == Verdict.ACCEPT }); assertEquals(Verdict.RATE_LIMITED, got.last())
        assertEquals(Verdict.ACCEPT, ver.check(msg(t = 99_999), "test2", reg, 61_000))   // window slid
    }

    @Test fun `parser rejects non-flat or unknown messages`() {
        assertNull(MeshMsg.parse("""{"v":1,"type":"checkin","x":{"a":1}}""".toByteArray()))
        assertNull(MeshMsg.parse("""{"v":2,"type":"checkin"}""".toByteArray()))
        assertNull(MeshMsg.parse("ping|1|abc".toByteArray()))
        assertNull(MeshMsg.parse("""{"v":1,"type":"checkin","site":"s","sender":"a","addr":"0x","nonce":"n","sig":"0x","tMs":1.5}""".toByteArray()))
    }
}
