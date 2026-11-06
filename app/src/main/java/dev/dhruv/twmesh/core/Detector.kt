// Tremor Witness Mesh — new code (not from bitchat/SafeMesh). GPL-3.0 as part of this app.
package dev.dhruv.twmesh.core

import kotlin.math.acos
import kotlin.math.max
import kotlin.math.min
import kotlin.math.sqrt

/**
 * On-phone event detector (BRIEF §5.1). Same event state machine and constants as the web app's construction pipeline
 * (apps/web/src/main.ts: STA/LTA ratio > 4 opens a 1.2 s event, 1.5 s refractory, PPV noise floor 0.3 mm/s, handling =
 * tilt > 15° or band acceleration > 30 m/s²), plus the DISASTER tier: a structural event with PPV ≥ [disasterPpvMmS].
 *
 * The web pipeline also calls an event "handling" when > 50 % of its energy is below 3 Hz. Earthquake shaking is often
 * dominated by 1–5 Hz, so the disaster tier does NOT use that rule (see docs/EXP-0001-disaster-threshold.md); hand sway
 * is instead filtered by the quorum (k registered phones must agree) and by the tilt check.
 */
class Detector(
    private val disasterPpvMmS: Double = DISASTER_PPV_MMS,
) {
    companion object {
        /**
         * EXP-0001: PGV at Modified Mercalli intensity VI ("strong", felt by all, slight damage) from the USGS ShakeMap
         * GMICE of Worden et al. 2012 (MMI = 2.89 + 3.16·log10(PGV cm/s) for MMI ≥ 4.56): 10^((6 − 2.89)/3.16) cm/s
         * = 96.4 mm/s. A published starting point; validating it on phones is TODO(measure).
         */
        const val DISASTER_PPV_MMS = 96.4
        const val TRIGGER_RATIO = 4.0
        const val MIN_PPV_MMS = 0.3
        const val EVENT_MS = 1200.0
        const val REFRACTORY_MS = 1500.0
        const val HANDLING_TILT_DEG = 15.0
        const val HANDLING_ACC = 30.0
    }

    data class Event(val t0: Double, val ppvMmS: Double, val fDomHz: Double, val lowF: Double, val tiltDeg: Double,
                     val peakAcc: Double, val label: String, val disaster: Boolean)

    private var tracker: VelocityTracker? = null
    private var trig: StaLta? = null
    var fs = 0.0; private set
    private val warm = ArrayList<Double>()
    private var lastEventT = -1e18
    private class Open(val t0: Double, val gBefore: DoubleArray) { var peak = 0.0; var peakAcc = 0.0; val axis = Array(3) { ArrayList<Double>() } }
    private var open: Open? = null
    /** Latest velocity magnitude (mm/s), for the live readout. */
    var lastVelMmS = 0.0; private set

    /**
     * Feed one linear-acceleration sample (gravity removed) with the current gravity vector (for tilt).
     * Returns a closed event, or null.
     */
    fun push(s: Sample, gravity: DoubleArray): Event? {
        if (tracker == null) {
            warm += s.t
            if (warm.size < 120) return null          // measure the delivered rate first, like the web app
            fs = Dsp.measuredRateHz(warm)
            if (fs < 10) { warm.clear(); return null }
            tracker = VelocityTracker(BandConfig.default(fs)); trig = StaLta(0.15, 5.0, fs)
        }
        val (acc, vel) = tracker!!.push(s)
        lastVelMmS = vel
        val ratio = trig!!.push(acc)
        if (open == null && ratio > TRIGGER_RATIO && s.t - lastEventT > REFRACTORY_MS) open = Open(s.t, gravity.copyOf())
        val o = open ?: return null
        o.peak = max(o.peak, vel); o.peakAcc = max(o.peakAcc, acc)
        o.axis[0] += s.x; o.axis[1] += s.y; o.axis[2] += s.z
        if (s.t - o.t0 < EVENT_MS) return null
        open = null; lastEventT = o.t0
        if (o.peak < MIN_PPV_MMS) return null
        val centred = o.axis.map { a -> val m = a.sum() / max(1, a.size); a.map { it - m } }
        val best = centred.maxBy { a -> a.sumOf { it * it } }
        val fDom = Dsp.dominantHz(best, fs); val lowF = Dsp.lowFreqRatio(best, fs)
        val tilt = tiltDeg(o.gBefore, gravity)
        val handling = tilt > HANDLING_TILT_DEG || o.peakAcc > HANDLING_ACC
        val label = if (handling) "handling" else "structural"
        return Event(o.t0, o.peak, fDom, lowF, tilt, o.peakAcc, label, !handling && o.peak >= disasterPpvMmS)
    }

    private fun tiltDeg(a: DoubleArray, b: DoubleArray): Double {
        val na = sqrt(a.sumOf { it * it }); val nb = sqrt(b.sumOf { it * it })
        if (na < 1e-6 || nb < 1e-6) return 0.0
        val c = (a[0] * b[0] + a[1] * b[1] + a[2] * b[2]) / (na * nb)
        return Math.toDegrees(acos(min(1.0, max(-1.0, c))))
    }
}
