// Tremor Witness Mesh — new code (not from bitchat/SafeMesh). GPL-3.0 as part of this app.
package dev.dhruv.twmesh

import dev.dhruv.twmesh.chain.Abi
import dev.dhruv.twmesh.chain.Ens
import dev.dhruv.twmesh.chain.Eth
import dev.dhruv.twmesh.chain.Hex
import dev.dhruv.twmesh.chain.Invite
import dev.dhruv.twmesh.chain.Rpc
import dev.dhruv.twmesh.chain.TwApi
import mockwebserver3.Dispatcher
import mockwebserver3.MockResponse
import mockwebserver3.MockWebServer
import mockwebserver3.RecordedRequest
import org.junit.After
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.RobolectricTestRunner
import java.util.Base64

/** JoinFlow against a stub backend + stub Sepolia RPC (BRIEF §0.2: build against a stub). No real network. */
@RunWith(RobolectricTestRunner::class)
class JoinFlowTest {
    private val committeeKey = Eth.newPrivateKey()          // stands in for the committee in tests only
    private val committee = Eth.address(committeeKey)
    private val phone = Eth.address(Eth.newPrivateKey())
    private lateinit var server: MockWebServer
    private val calls = mutableListOf<String>()
    var registerReply: MockResponse = ok("""{"ok":true,"name":"dhruv-m.test2.tremorwitness.eth","expiry":2000000000}""")
    var resolveAnswers = ArrayDeque<String>()

    private fun ok(json: String, code: Int = 200) = MockResponse.Builder().code(code).body(json).build()

    @Before fun setUp() {
        server = MockWebServer()
        server.dispatcher = object : Dispatcher() {
            override fun dispatch(request: RecordedRequest): MockResponse {
                val path = request.url.encodedPath; val body = request.body?.utf8() ?: ""
                calls += path
                return when (path) {
                    "/api/drip" -> ok("""{"ok":true,"funded":true,"hash":"0x01"}""")
                    "/api/ens-register" -> { calls += body; registerReply }
                    "/rpc" -> {
                        val addr = resolveAnswers.removeFirstOrNull() ?: phone
                        val out = Abi.encode(Abi.Dyn(Abi.address(addr)), Abi.address("0x" + "11".repeat(20)))
                        ok("""{"jsonrpc":"2.0","id":1,"result":"${Hex.encode(out)}"}""")
                    }
                    else -> ok("""{"ok":false,"error":"not found"}""", 404)
                }
            }
        }
        server.start()
    }
    @After fun tearDown() { server.close() }

    private fun flow(now: Long = 1_000L) = JoinFlow(
        api = TwApi(server.url("/").toString()), ens = Ens(Rpc(server.url("/rpc").toString())),
        nowMs = { now }, sleep = {}, committee = committee,
    )
    private fun invite(signer: ByteArray = committeeKey, exp: Long = 60_000L): Invite {
        val id = "0123456789abcdef0123456789abcdef"
        val sig = Eth.signMessage("tremor-witness invite v1|site=test2|id=$id|exp=$exp", signer)
        val raw = Base64.getUrlEncoder().withoutPadding().encodeToString("""{"site":"test2","inviteId":"$id","exp":$exp,"sig":"$sig"}""".toByteArray())
        return Invite.parse("https://tremor-witness.vercel.app/?site=test2&inv=$raw")!!
    }

    @Test fun `happy path registers with the invite unchanged and verifies resolution`() {
        val steps = mutableListOf<JoinFlow.Step>()
        val inv = invite()
        val r = flow().run(inv, "dhruv-m", phone) { steps += it }
        assertTrue(r.ok); assertTrue(r.resolved); assertEquals(2_000_000_000L, r.expiry)
        assertTrue(calls.any { it.contains("\"invite\":\"${inv.raw}\"") && it.contains("\"address\":\"$phone\"") })
        assertEquals(2, calls.count { it == "/api/drip" })
        assertTrue(steps.none { it.state == JoinFlow.State.FAILED })
    }

    @Test fun `v2 multi-use invite (R5 proposal) verifies with its own message`() {
        val id = "0123456789abcdef0123456789abcdef"
        val sig = Eth.signMessage("tremor-witness invite v2|site=test2|id=$id|exp=60000|uses=12", committeeKey)
        val raw = Base64.getUrlEncoder().withoutPadding().encodeToString("""{"site":"test2","inviteId":"$id","exp":60000,"uses":12,"sig":"$sig"}""".toByteArray())
        val inv = Invite.parse(raw)!!
        assertEquals(12, inv.uses); assertTrue(inv.signedByCommittee(committee))
        assertTrue(flow().run(inv, "mesh-3c2c", phone) {}.ok)
    }

    @Test fun `resolution lag is retried`() {
        resolveAnswers.addAll(listOf("0x0000000000000000000000000000000000000000", "0x0000000000000000000000000000000000000000"))
        val r = flow().run(invite(), "dhruv-m", phone) {}
        assertTrue(r.resolved); assertEquals(3, calls.count { it == "/rpc" })
    }

    @Test fun `invite not from the committee is refused before any network call`() {
        val r = flow().run(invite(signer = Eth.newPrivateKey()), "dhruv-m", phone) {}
        assertFalse(r.ok); assertTrue(r.error!!.contains("not signed by the site committee")); assertTrue(calls.isEmpty())
    }

    @Test fun `expired invite and bad label are refused locally`() {
        assertTrue(flow(now = 120_000L).run(invite(exp = 60_000L), "dhruv-m", phone) {}.error!!.contains("expired"))
        assertTrue(flow().run(invite(), "-Bad_", phone) {}.error!!.contains("Phone name"))
        assertTrue(calls.isEmpty())
    }

    @Test fun `server refusal is shown in its own words`() {
        registerReply = ok("""{"ok":false,"error":"site is full (5 phones)"}""", 409)
        val r = flow().run(invite(), "dhruv-m", phone) {}
        assertFalse(r.ok); assertEquals("site is full (5 phones)", r.error)
    }
}
