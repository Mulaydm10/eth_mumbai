// Tremor Witness Mesh — new code (not from bitchat/SafeMesh). GPL-3.0 as part of this app.
package dev.dhruv.twmesh

import android.content.Context
import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener
import android.hardware.SensorManager
import android.util.Log
import dev.dhruv.twmesh.core.Detector
import dev.dhruv.twmesh.core.Sample
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlin.math.roundToLong

/**
 * BRIEF §5.1: the phone's own strong-shaking detection. Linear acceleration (+ gravity for tilt) at ~100 Hz into the
 * Detector (DSP ported from the web app). A disaster-tier event becomes a signed `dtrigger` on the mesh.
 * Runs while the app process lives (the mesh's foreground service keeps it). Battery cost: TODO(measure).
 */
object ShakeSensor : SensorEventListener {
    private const val TAG = "TwmShake"
    data class Status(val running: Boolean = false, val rateHz: Double = 0.0, val nowMmS: Double = 0.0,
                      val lastEvent: Detector.Event? = null, val lastEventWallMs: Long = 0, val unavailable: Boolean = false)
    private val _status = MutableStateFlow(Status())
    val status: StateFlow<Status> = _status
    private var sm: SensorManager? = null
    private var detector = Detector()
    private val gravity = doubleArrayOf(0.0, 0.0, 9.81)
    private var bootOffsetMs = 0.0   // wall time − sensor time
    private var lastUi = 0L
    private var peakSinceUi = 0.0

    fun start(ctx: Context) {
        if (sm != null) return
        val m = ctx.applicationContext.getSystemService(Context.SENSOR_SERVICE) as SensorManager
        val lin = m.getDefaultSensor(Sensor.TYPE_LINEAR_ACCELERATION)
        val grav = m.getDefaultSensor(Sensor.TYPE_GRAVITY)
        if (lin == null) { _status.value = Status(unavailable = true); Log.w(TAG, "no linear acceleration sensor"); return }
        sm = m; detector = Detector()
        m.registerListener(this, lin, 10_000)              // 10 ms = 100 Hz requested; the delivered rate is measured
        grav?.let { m.registerListener(this, it, 50_000) }
        _status.value = Status(running = true)
        Log.i(TAG, "listening")
    }

    fun stop() { sm?.unregisterListener(this); sm = null; _status.value = Status() }

    override fun onAccuracyChanged(sensor: Sensor?, accuracy: Int) {}

    override fun onSensorChanged(e: SensorEvent) {
        if (e.sensor.type == Sensor.TYPE_GRAVITY) { for (i in 0..2) gravity[i] = e.values[i].toDouble(); return }
        val tMs = e.timestamp / 1e6
        if (bootOffsetMs == 0.0) bootOffsetMs = System.currentTimeMillis() - tMs
        val ev = detector.push(Sample(tMs, e.values[0].toDouble(), e.values[1].toDouble(), e.values[2].toDouble()), gravity)
        peakSinceUi = maxOf(peakSinceUi, detector.lastVelMmS)
        val now = System.currentTimeMillis()
        if (ev != null) onEvent(ev, (ev.t0 + bootOffsetMs).toLong())
        if (now - lastUi > 500) {
            _status.value = _status.value.copy(running = true, rateHz = detector.fs, nowMmS = peakSinceUi)
            lastUi = now; peakSinceUi = 0.0
        }
    }

    private fun onEvent(ev: Detector.Event, wallMs: Long) {
        Log.i(TAG, "event ppv=%.2f fDom=%.1f lowF=%.2f tilt=%.1f label=%s disaster=%s".format(ev.ppvMmS, ev.fDomHz, ev.lowF, ev.tiltDeg, ev.label, ev.disaster))
        _status.value = _status.value.copy(lastEvent = ev, lastEventWallMs = wallMs)
        // Only disaster-strength shaking goes on the mesh (construction-level events never arm it). Handling-labelled
        // strong events are sent too, labelled, so other phones see them; the quorum ignores them.
        if (ev.ppvMmS >= Detector.DISASTER_PPV_MMS)
            MeshState.send("dtrigger", mapOf("ppvUm" to (ev.ppvMmS * 1000).roundToLong(), "fDomCHz" to (ev.fDomHz * 100).roundToLong(), "label" to ev.label))
    }
}
