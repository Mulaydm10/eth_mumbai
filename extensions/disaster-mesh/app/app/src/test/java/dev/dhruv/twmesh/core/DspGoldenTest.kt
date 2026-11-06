// Tremor Witness Mesh — new code (not from bitchat/SafeMesh). GPL-3.0 as part of this app.
package dev.dhruv.twmesh.core

import com.google.gson.Gson
import com.google.gson.JsonObject
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test
import kotlin.math.abs
import kotlin.math.max

/** The Kotlin DSP must track the TypeScript dsp.ts sample by sample (dsp-v1.json, 5 signals, 50–400 Hz). */
class DspGoldenTest {
    private val v = Gson().fromJson(javaClass.classLoader!!.getResource("golden/dsp-v1.json")!!.readText(), JsonObject::class.java)
    private fun close(exp: Double, got: Double) = abs(exp - got) <= 1e-9 * max(1.0, abs(exp))

    @Test fun `velocity, acceleration, STA-LTA and features match per sample`() {
        var worst = 0.0
        for (c in v["cases"].asJsonArray.map { it.asJsonObject }) {
            val fs = c["fs"].asDouble
            val s = c["samples"].asJsonArray.map { it.asJsonObject }.map { Sample(it["t"].asDouble, it["x"].asDouble, it["y"].asDouble, it["z"].asDouble) }
            val vt = VelocityTracker(BandConfig.default(fs)); val tr = StaLta(0.15, 5.0, fs)
            val acc = c["accBand"].asJsonArray.map { it.asDouble }; val vel = c["velMmS"].asJsonArray.map { it.asDouble }; val rat = c["ratio"].asJsonArray.map { it.asDouble }
            s.forEachIndexed { i, p ->
                val (a, vv) = vt.push(p); val r = tr.push(a)
                worst = maxOf(worst, abs(vel[i] - vv) / max(1.0, abs(vel[i])))
                assertTrue("${c["kind"]}@$fs acc[$i] ${acc[i]} vs $a", close(acc[i], a))
                assertTrue("${c["kind"]}@$fs vel[$i] ${vel[i]} vs $vv", close(vel[i], vv))
                assertTrue("${c["kind"]}@$fs ratio[$i] ${rat[i]} vs $r", close(rat[i], r))
            }
            assertEquals(c["dominantHzZ"].asDouble, Dsp.dominantHz(s.map { it.z }, fs), 1e-9)
            assertEquals(c["dominantHzX"].asDouble, Dsp.dominantHz(s.map { it.x }, fs), 1e-9)
            assertEquals(c["lowFreqZ"].asDouble, Dsp.lowFreqRatio(s.map { it.z }, fs), 1e-9)
            assertEquals(c["lowFreqX"].asDouble, Dsp.lowFreqRatio(s.map { it.x }, fs), 1e-9)
            assertEquals(c["rate"].asDouble, Dsp.measuredRateHz(s.take(50).map { it.t }), 1e-9)
        }
        println("DSP worst relative velocity difference vs TypeScript: $worst")
    }
}
