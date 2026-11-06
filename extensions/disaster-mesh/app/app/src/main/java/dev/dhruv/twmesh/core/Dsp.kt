// Tremor Witness Mesh — new code (not from bitchat/SafeMesh). GPL-3.0 as part of this app.
// Kotlin port of the Tremor Witness repo's packages/core/src/dsp.ts (same filters, same order of operations).
// Checked against app/src/test/resources/golden/dsp-v1.json (tools/golden/dsp-vectors.mjs runs the TypeScript original).
package dev.dhruv.twmesh.core

import kotlin.math.PI
import kotlin.math.cos
import kotlin.math.max
import kotlin.math.min
import kotlin.math.sin
import kotlin.math.sqrt

data class Sample(val t: Double, val x: Double, val y: Double, val z: Double)   // t ms, acceleration m/s² (gravity removed)

/** Second-order IIR section (RBJ cookbook), direct form I. */
class Biquad(private val b0: Double, private val b1: Double, private val b2: Double, private val a1: Double, private val a2: Double) {
    private var x1 = 0.0; private var x2 = 0.0; private var y1 = 0.0; private var y2 = 0.0
    companion object {
        private const val SQRT1_2 = 0.7071067811865476
        fun lowpass(fc: Double, fs: Double, q: Double = SQRT1_2): Biquad {
            val w0 = (2 * PI * fc) / fs; val c = cos(w0); val alpha = sin(w0) / (2 * q); val a0 = 1 + alpha
            return Biquad((1 - c) / 2 / a0, (1 - c) / a0, (1 - c) / 2 / a0, (-2 * c) / a0, (1 - alpha) / a0)
        }
        fun highpass(fc: Double, fs: Double, q: Double = SQRT1_2): Biquad {
            val w0 = (2 * PI * fc) / fs; val c = cos(w0); val alpha = sin(w0) / (2 * q); val a0 = 1 + alpha
            return Biquad((1 + c) / 2 / a0, -(1 + c) / a0, (1 + c) / 2 / a0, (-2 * c) / a0, (1 - alpha) / a0)
        }
    }
    fun step(x: Double): Double {
        val y = b0 * x + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2
        x2 = x1; x1 = x; y2 = y1; y1 = y
        return y
    }
}

data class BandConfig(val fs: Double, val lowHz: Double, val highHz: Double) {
    companion object { fun default(fs: Double) = BandConfig(fs, 2.0, min(25.0, fs * 0.42)) }
}

/** Per-axis band-pass + integration to velocity. PPV in mm/s. */
class VelocityTracker(cfg: BandConfig) {
    private val hp = Array(3) { Biquad.highpass(cfg.lowHz, cfg.fs) }
    private val lp = Array(3) { Biquad.lowpass(cfg.highHz, cfg.fs) }
    private val vhp = Array(3) { Biquad.highpass(cfg.lowHz, cfg.fs) }
    private val prevA = DoubleArray(3); private val v = DoubleArray(3)
    private val dt = 1 / cfg.fs

    /** Returns (band-passed acceleration magnitude m/s², velocity magnitude mm/s). */
    fun push(s: Sample): Pair<Double, Double> {
        val raw = doubleArrayOf(s.x, s.y, s.z)
        var a2 = 0.0; var v2 = 0.0
        for (i in 0 until 3) {
            val a = lp[i].step(hp[i].step(raw[i]))
            val vInt = v[i] + ((a + prevA[i]) / 2) * dt
            prevA[i] = a; v[i] = vInt
            val vf = vhp[i].step(vInt)
            a2 += a * a; v2 += vf * vf
        }
        return sqrt(a2) to sqrt(v2) * 1000
    }
}

/** Short-term / long-term average trigger on band-passed acceleration. */
class StaLta(private val staS: Double, private val ltaS: Double, private val fs: Double) {
    private var sta = 0.0; private var lta = 0.0; private var n = 0
    fun push(x: Double): Double {
        val e = x * x
        val aS = 1 / max(1.0, staS * fs); val aL = 1 / max(1.0, ltaS * fs)
        sta += aS * (e - sta); lta += aL * (e - lta); n++
        if (n < ltaS * fs * 0.5 || lta <= 1e-12) return 0.0
        return sta / lta
    }
}

object Dsp {
    fun measuredRateHz(ts: List<Double>): Double {
        if (ts.size < 3) return 0.0
        val d = (1 until ts.size).map { ts[it] - ts[it - 1] }.sorted()
        val med = d[d.size / 2]
        return if (med > 0) 1000 / med else 0.0
    }
    fun dominantHz(x: List<Double>, fs: Double): Double {
        if (x.size < 4) return 0.0
        var sum = 0.0; for (v in x) sum += v          // same summation order as reduce
        val mean = sum / x.size
        var zc = 0
        for (i in 1 until x.size) if ((x[i - 1] - mean) * (x[i] - mean) < 0) zc++
        return (zc / 2.0) * (fs / x.size)
    }
    fun lowFreqRatio(x: List<Double>, fs: Double, cutHz: Double = 3.0): Double {
        if (x.isEmpty()) return 0.0
        val lp = Biquad.lowpass(cutHz, fs)
        var lo = 0.0; var tot = 0.0
        for (v in x) { val l = lp.step(v); lo += l * l; tot += v * v }
        return if (tot > 0) min(1.0, lo / tot) else 0.0
    }
}
