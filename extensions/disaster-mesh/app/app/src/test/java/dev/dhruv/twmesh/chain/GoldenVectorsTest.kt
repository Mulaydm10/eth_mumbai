// Tremor Witness Mesh — new code (not from bitchat/SafeMesh). GPL-3.0 as part of this app.
package dev.dhruv.twmesh.chain

import com.google.gson.Gson
import com.google.gson.JsonObject
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Test

/**
 * Every expected value comes from test/resources/golden/chain-v1.json, generated with viem 2.x (the library the
 * Tremor Witness web app uses) by tools/golden/chain-vectors.mjs. The key is the public web3.js docs test key.
 */
class GoldenVectorsTest {
    private val v: JsonObject = Gson().fromJson(
        javaClass.classLoader!!.getResource("golden/chain-v1.json")!!.readText(), JsonObject::class.java
    )
    private fun s(path: String): String = path.split(".").fold(v as com.google.gson.JsonElement) { e, k -> e.asJsonObject[k] }.asString
    private val pk = Hex.decode(s("key.privateKey"))

    @Test fun keccak() {
        assertEquals(s("keccak.empty"), Hex.encode(keccak256(ByteArray(0))))
        assertEquals(s("keccak.hello"), Hex.encode(keccak256("hello")))
    }

    @Test fun `public key and checksummed address`() {
        assertEquals(s("key.publicKey"), Hex.encode(Eth.publicKey(pk)))
        assertEquals(s("key.address"), Eth.address(pk))
    }

    @Test fun `personal_sign hash, signature and recovery match viem`() {
        val msg = s("personalSign.message")
        assertEquals(s("personalSign.hash"), Hex.encode(Eth.hashMessage(msg)))
        assertEquals(s("personalSign.signature"), Eth.signMessage(msg, pk))
        assertEquals(s("personalSign.recovered"), Eth.recoverMessageAddress(msg, s("personalSign.signature")))
    }

    @Test fun `tampered message or signature does not recover the signer`() {
        val sig = s("personalSign.signature")
        assertFalse(Eth.recoverMessageAddress(s("personalSign.message") + "x", sig) == s("key.address"))
        val bad = sig.dropLast(4) + (if (sig.endsWith("1b")) "aa1c" else "aa1b")
        assertFalse(Eth.recoverMessageAddress(s("personalSign.message"), bad) == s("key.address"))
        assertNull(Eth.recoverMessageAddress("m", "0x1234"))
    }

    @Test fun `invite decodes from the dashboard URL and the bare string`() {
        val fromUrl = Invite.parse(s("invite.url"))
        val bare = Invite.parse(s("invite.encoded"))
        assertNotNull(fromUrl); assertEquals(fromUrl, bare)
        assertEquals("test2", fromUrl!!.site)
        assertEquals(s("invite.encoded"), fromUrl.raw)
        assertEquals(s("key.address"), fromUrl.signer())            // signed by the test key …
        assertFalse(fromUrl.signedByCommittee())                    // … so NOT accepted as a committee invite
        assertNotNull(Invite.parse("https://x.example/?site=test2&invite=" + s("invite.encoded")))
        assertNull(Invite.parse("not an invite"))
    }

    @Test fun `ens name encodings and calldata`() {
        val name = s("ens.name")
        assertEquals(s("ens.namehash"), Hex.encode(EnsName.namehash(name)))
        assertEquals(s("ens.dns"), Hex.encode(EnsName.dnsEncode(name)))
        assertEquals(s("ens.salt"), Hex.encode(Ens.salt("test2")))
        assertEquals(s("ens.predictCalldata"), Hex.encode(Ens.predictCalldata("test2")))
        assertEquals(s("ens.resolveCalldata"), Hex.encode(Ens.resolveAddrCalldata(name)))
    }

    @Test fun `event topics`() {
        assertEquals(s("events.LabelRegistered"), Ens.TOPIC_REGISTERED)
        assertEquals(s("events.LabelUnregistered"), Ens.TOPIC_UNREGISTERED)
        assertEquals(s("events.ExpiryUpdated"), Ens.TOPIC_EXPIRY)
        assertEquals(s("events.TokenRegenerated"), Ens.TOPIC_REGENERATED)
    }

    @Test fun `fresh keys are valid and sign verifiably`() {
        val k = Eth.newPrivateKey()
        val a = Eth.address(k)
        assertTrue(Regex("^0x[0-9a-fA-F]{40}$").matches(a))
        assertEquals(a, Eth.recoverMessageAddress("hi", Eth.signMessage("hi", k)))
    }

    @Test fun `registry log replay - register, expiry update, unregister`() {
        val g = Gson()
        fun log(topics: List<String>, data: String) = g.fromJson("""{"topics":${g.toJson(topics)},"data":"$data"}""", JsonObject::class.java)
        val owner = "000000000000000000000000" + s("key.address").removePrefix("0x").lowercase()
        // data = (string label, address owner, uint64 expiry): offset 0x60, owner, expiry, len 7, "dhruv-m"
        val data = "0x" + "%064x".format(0x60) + owner + "%064x".format(2_000_000_000L) + "%064x".format(7) +
            Hex.encode("dhruv-m".toByteArray()).removePrefix("0x").padEnd(64, '0')
        val t1 = "0x" + "%064x".format(1)
        val reg = log(listOf(Ens.TOPIC_REGISTERED, t1, t1, t1), data)
        val p = Ens.phonesFromLogs("test2", listOf(reg), 1_900_000_000L)
        assertEquals(1, p.size); assertEquals("dhruv-m", p[0].label); assertEquals(s("key.address"), p[0].owner)
        assertEquals("dhruv-m.test2.tremorwitness.eth", p[0].name)
        assertTrue(Ens.phonesFromLogs("test2", listOf(reg), 2_100_000_000L).isEmpty())                       // expired
        val unreg = log(listOf(Ens.TOPIC_UNREGISTERED, t1, t1), "0x")
        assertTrue(Ens.phonesFromLogs("test2", listOf(reg, unreg), 1_900_000_000L).isEmpty())               // revoked
        val ext = log(listOf(Ens.TOPIC_EXPIRY, t1, "0x" + "%064x".format(2_200_000_000L), t1), "0x")
        assertEquals(1, Ens.phonesFromLogs("test2", listOf(reg, ext), 2_100_000_000L).size)                  // renewed
    }
}
