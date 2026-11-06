// Tremor Witness Mesh — new code (not from bitchat/SafeMesh). GPL-3.0 as part of this app.
package dev.dhruv.twmesh.chain

import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Assume.assumeTrue
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.RobolectricTestRunner
import java.io.File
import java.math.BigInteger

/**
 * Live production backend (no stubs). TWM_LIVE=1: /api/time. TWM_LIVE_WRITE=1 also spends testnet gas: a throwaway key
 * gets tGLM from /api/drip and writes one dtrigger + one checkin to Arkiv for site "twm-livetest" (no real site touched).
 * The written entity keys go to build/twm-live-write.txt so the TW repo's own fetchCheckins can read them back.
 */
@RunWith(RobolectricTestRunner::class)
class LiveBackendTest {
    @Test fun `server clock`() {
        assumeTrue(System.getenv("TWM_LIVE") == "1")
        val api = TwApi()
        val samples = (0 until 8).map { val t0 = System.currentTimeMillis(); val t = api.serverTimeMs(); val t1 = System.currentTimeMillis(); (t1 - t0) to (t + (t1 - t0) / 2 - t1) }
        val best = samples.minBy { it.first }
        println("LIVE /api/time: best rtt ${best.first} ms, offset ${best.second} ms")
        assertTrue(kotlin.math.abs(best.second) < 60_000)
    }

    @Test fun `drip then write own dtrigger and checkin to Arkiv`() {
        assumeTrue(System.getenv("TWM_LIVE_WRITE") == "1")
        val pk = Eth.newPrivateKey(); val addr = Eth.address(pk)
        val d = TwApi().drip(addr)
        println("LIVE drip: code ${d.code} ok ${d.ok} funded ${d.json["funded"]} err ${d.error}")
        assertTrue(d.ok)
        val w = ArkivWriter()
        var bal = BigInteger.ZERO
        for (i in 0 until 20) { bal = w.balance(addr); if (bal.signum() > 0) break; Thread.sleep(3000) }
        println("LIVE balance $bal wei")
        assertTrue(bal.signum() > 0)
        val now = System.currentTimeMillis()
        val t = w.write(Arkiv.calldata(Arkiv.DTrigger("twm-livetest", "mesh-live", now, 0, 0, "manual", "", 1), Arkiv.randomSalt()), pk)
        val c = w.write(Arkiv.calldata(Arkiv.Checkin("twm-livetest", "mesh-live", now + 1, "safe", "live test from TW Mesh", now, 2), Arkiv.randomSalt()), pk)
        val after = w.balance(addr)
        println("LIVE dtrigger ${t.entityKey} tx ${t.txHash} owner ${t.owner}")
        println("LIVE checkin  ${c.entityKey} tx ${c.txHash} owner ${c.owner}")
        println("LIVE cost for 2 writes: ${bal - after} wei")
        assertEquals(addr, t.owner); assertEquals(addr, c.owner)
        File("build/twm-live-write.txt").writeText("$addr\n$now\n${t.entityKey}\n${c.entityKey}\n")
    }
}
