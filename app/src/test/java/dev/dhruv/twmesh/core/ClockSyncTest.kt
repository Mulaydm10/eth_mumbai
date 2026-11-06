package dev.dhruv.twmesh.core

import dev.dhruv.twmesh.chain.Eth
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotEquals
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Test
import kotlin.math.abs
import kotlin.random.Random

class ClockSyncTest {
    /** One shared true time for all simulated phones. */
    private class World { var t = 0L }
    private var world = World()
    /** A simulated phone: raw clock = true time × (1 + drift) + rawStart; wall clock possibly wrong. */
    private inner class Phone(val rawStart: Long, val driftPpm: Long = 0, val wallErr: Long = 0) {
        val w = world
        var trueT: Long get() = w.t; set(v) { w.t = v }
        fun raw() = rawStart + trueT + trueT * driftPpm / 1_000_000
        val k = TimeKeeper({ raw() }, { SERVER0 + trueT + wallErr })
    }
    companion object { const val SERVER0 = 1_762_000_000_000L }   // server time = SERVER0 + true time

    /** Ask [b] for its time from [a] with the given one-way delays (true ms). */
    private fun sample(a: Phone, b: Phone, label: String, up: Long, down: Long, turn: Long = 3): PeerSample {
        val t1 = a.raw()
        a.trueT += up; val t2 = b.k.now()
        a.trueT += turn; val t3 = b.k.now(); val err = b.k.errMs()!!; val hops = b.k.fix!!.hops
        a.trueT += down; val t4 = a.raw()
        return PeerSample(label, t1, t2, t3, t4, err, hops)
    }
    private fun serverSync(p: Phone, rtts: List<Pair<Long, Long>>) =
        p.k.adoptServer(rtts.map { (up, down) -> val t0 = p.raw(); p.trueT += up; val s = SERVER0 + p.trueT; p.trueT += down; Triple(t0, s, p.raw()) })
    private fun trueErr(p: Phone) = p.k.now() - (SERVER0 + p.trueT)

    @Test fun serverSyncPicksLowestRoundTripAndBoundHolds() {
        val p = Phone(rawStart = 5_000)
        val f = serverSync(p, listOf(300L to 20L, 40L to 60L, 15L to 25L, 200L to 10L))!!
        assertEquals(0, f.hops); assertEquals(21L, f.errMs)                // rtt 40 → ±20, +1 rounding
        assertTrue(abs(trueErr(p)) <= p.k.errMs()!!)
    }

    @Test fun noFixMeansWallClockAndNoError() {
        val p = Phone(rawStart = 0, wallErr = 7_000)
        assertNull(p.k.errMs()); assertEquals(7_000L, trueErr(p))
    }

    @Test fun errorBoundGrowsWithDrift() {
        val f = ClockFix(0, 20, 1_000, "server", 0)
        assertEquals(20L, f.errAt(1_000)); assertEquals(20L + 360L, f.errAt(1_000 + 3_600_000))   // 100 ppm × 1 h
    }

    @Test fun neighbourExchangeFixesAWrongClockWithinTheBound() {
        val rnd = Random(7)
        repeat(500) {
            world = World()
            val a = Phone(rawStart = rnd.nextLong(0, 1L shl 40), driftPpm = rnd.nextLong(-50, 50))
            val b = Phone(rawStart = rnd.nextLong(0, 1L shl 40), driftPpm = rnd.nextLong(-50, 50), wallErr = rnd.nextLong(-60_000, 60_000))
            serverSync(a, List(8) { rnd.nextLong(5, 200) to rnd.nextLong(5, 200) })
            val dt = rnd.nextLong(0, 3_600_000); a.trueT += dt          // A has been offline a while
            val ss = List(4) { sample(b, a, "a", rnd.nextLong(5, 400), rnd.nextLong(5, 400)) }   // very asymmetric links
            val fix = b.k.offerPeers(ss)
            assertNotNull(fix); assertEquals(1, fix!!.hops); assertEquals("a", fix.source)
            assertTrue("true error ${trueErr(b)} > bound ${b.k.errMs()}", abs(trueErr(b)) <= b.k.errMs()!!)
            assertTrue(b.k.errMs()!! > a.k.errMs()!!)                                    // error only grows along a chain
        }
    }

    @Test fun twoHopsAndNoLoopBack() {
        val a = Phone(1_000); val b = Phone(9_999_999, wallErr = 3_000); val c = Phone(42, wallErr = -8_000)
        serverSync(a, listOf(30L to 30L))
        assertNotNull(b.k.offerPeers(listOf(sample(b, a, "a", 20, 40))))
        a.trueT += 5
        val fc = c.k.offerPeers(listOf(sample(c, b, "b", 35, 25)))!!
        assertEquals(2, fc.hops); assertTrue(abs(trueErr(c)) <= c.k.errMs()!!)
        // B now hears C (whose time came from B): it must not take it back
        a.trueT += 5
        assertNull(b.k.offerPeers(listOf(sample(b, c, "c", 1, 1))))
        // and A (from the server) never takes a neighbour's time either
        assertNull(a.k.offerPeers(listOf(sample(a, b, "b", 1, 1))))
    }

    @Test fun aNeighbourWithAWrongClockIsOutvoted() {
        val now = 1_000L
        val good1 = ClockFix(10_000, 80, now, "g1", 1); val good2 = ClockFix(10_030, 90, now, "g2", 1)
        val liar = ClockFix(15_000, 5, now, "liar", 1)                                    // claims a tiny error
        assertEquals("g1", ClockMath.select(null, listOf(liar, good1, good2), now)!!.source)
        // with only two answers there is no majority: the smaller error wins (documented limit)
        assertEquals("liar", ClockMath.select(null, listOf(liar, good1), now)!!.source)
    }

    @Test fun badSamplesAreRefused() {
        assertNull(ClockMath.fromPeer(PeerSample("x", 100, 0, 0, 50, 10, 0)))              // t4 < t1
        assertNull(ClockMath.fromPeer(PeerSample("x", 0, 0, 0, 5_000, 10, 0)))             // round trip too long
        assertNull(ClockMath.fromPeer(PeerSample("x", 0, 10, 5, 50, 10, 0)))               // t3 < t2
        assertNull(ClockMath.fromPeer(PeerSample("x", 0, 10, 20, 50, 10, ClockMath.MAX_HOPS)))
    }

    @Test fun keptAcrossRestartAndRoughlyAcrossReboot() {
        val p = Phone(rawStart = 50_000, wallErr = 1_234)
        serverSync(p, listOf(10L to 10L)); p.trueT += 60_000
        val saved = p.k.save(boot = 3)!!
        p.trueT += 10_000
        val sameBoot = Phone(rawStart = 50_000, wallErr = 1_234)
        sameBoot.k.restore(saved, boot = 3)
        assertTrue(abs(trueErr(sameBoot)) <= sameBoot.k.errMs()!!)
        // reboot: the raw clock restarted near 0, the wall clock (still 1.234 s off) carries the anchor
        val rebooted = Phone(rawStart = -p.trueT - 600_000, wallErr = 1_234).also { it.trueT += 600_000 }
        rebooted.k.restore(saved, boot = 4)
        assertTrue(abs(trueErr(rebooted)) <= rebooted.k.errMs()!!)
        assertTrue(rebooted.k.errMs()!! > saved.errMs)
    }

    @Test fun wireRoundTripIsSignedByTheAnsweringPhone() {
        val key = Eth.newPrivateKey(); val addr = Eth.address(key)
        val ask = TimeWire.parse(TimeWire.ask("ab12", "meshtest", "mesh-aaaa")) as TimeWire.Ask
        assertEquals("mesh-aaaa", ask.from)
        val bytes = TimeWire.answer("meshtest", "mesh-bbbb", addr, ask, 1_762_000_000_123, 1_762_000_000_130, 25, 1) { Eth.signMessage(it, key) }
        val ans = TimeWire.parse(bytes) as TimeWire.Answer
        assertEquals(addr.lowercase(), ans.signer()!!.lowercase())
        assertEquals(1_762_000_000_130L, ans.t3); assertEquals("mesh-aaaa", ans.to); assertEquals(1, ans.hops)
        // changing a timestamp breaks the signature
        val tampered = String(bytes).replace("\"t3\":1762000000130", "\"t3\":1762000005130").toByteArray()
        assertNotEquals(addr.lowercase(), (TimeWire.parse(tampered) as TimeWire.Answer).signer()?.lowercase())
        assertNull(TimeWire.parse("{\"k\":\"q\"}".toByteArray()))                          // no prefix: not a time packet
    }
}
