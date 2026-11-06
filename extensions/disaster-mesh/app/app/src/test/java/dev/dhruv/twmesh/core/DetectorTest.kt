// Tremor Witness Mesh — new code (not from bitchat/SafeMesh). GPL-3.0 as part of this app.
package dev.dhruv.twmesh.core

import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test
import kotlin.math.PI
import kotlin.math.exp
import kotlin.math.min
import kotlin.math.sin

/** Synthetic signals only (BRIEF: a drop or shake test is not a valid calibration; these test the logic, not the threshold). */
class DetectorTest {
    private val g = doubleArrayOf(0.0, 0.0, 9.81)
    private fun run(fs: Double, seconds: Double, gravity: (Double) -> DoubleArray = { g }, f: (Double) -> DoubleArray): List<Detector.Event> {
        val d = Detector(); val out = ArrayList<Detector.Event>()
        var seed = 7L
        fun noise(): Double { seed = (seed * 16807) % 2147483647; return (seed / 2147483647.0 - 0.5) * 0.002 }
        for (i in 0 until (fs * seconds).toInt()) {
            val t = i / fs; val a = f(t)
            d.push(Sample(t * 1000, a[0] + noise(), a[1] + noise(), a[2] + noise()), gravity(t))?.let { out += it }
        }
        return out
    }
    /** Earthquake-like burst after 8 s of quiet: 2–6 Hz, envelope rising 0.25 s, decaying 2 s; amplitude in m/s². */
    private fun quake(amp: Double) = { t: Double ->
        val e = if (t > 8) exp(-(t - 8) / 2) * min(1.0, (t - 8) * 4) else 0.0
        doubleArrayOf(e * amp * sin(2 * PI * 2.3 * t), e * amp * 0.7 * sin(2 * PI * 3.9 * t + 1), e * amp * 0.4 * sin(2 * PI * 5.7 * t))
    }

    @Test fun `strong low-frequency shaking is a structural disaster event`() {
        val ev = run(100.0, 14.0, f = quake(6.0))
        assertTrue(ev.isNotEmpty())
        val e = ev.first()
        println("strong quake: ppv %.1f mm/s, fDom %.1f Hz, lowF %.2f".format(e.ppvMmS, e.fDomHz, e.lowF))
        assertEquals("structural", e.label); assertTrue(e.disaster)
    }

    @Test fun `weak shaking is detected but is not a disaster`() {
        val ev = run(100.0, 14.0, f = quake(0.3))
        assertTrue(ev.isNotEmpty()); assertFalse(ev.any { it.disaster })
    }

    @Test fun `a phone that is picked up (tilts) is handling, never a disaster`() {
        val ev = run(100.0, 14.0, gravity = { t -> if (t > 8.5) doubleArrayOf(0.0, 9.81 * sin(PI / 4), 9.81 * sin(PI / 4)) else g }, f = quake(6.0))
        assertTrue(ev.isNotEmpty()); assertEquals("handling", ev.first().label); assertFalse(ev.first().disaster)
    }

    @Test fun `a still phone produces nothing`() {
        assertTrue(run(100.0, 20.0) { doubleArrayOf(0.0, 0.0, 0.0) }.isEmpty())
    }

    @Test fun `the threshold is the WGRW12 MMI VI velocity`() {
        assertEquals(96.4, Math.pow(10.0, (6 - 2.89) / 3.16) * 10, 0.05)
        assertEquals(96.4, Detector.DISASTER_PPV_MMS, 0.0)
    }
}
