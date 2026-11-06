// Tremor Witness Mesh — new code (not from bitchat/SafeMesh). GPL-3.0 as part of this app.
package dev.dhruv.twmesh.core

import kotlin.math.abs
import kotlin.math.max
import kotlin.math.min

/**
 * Clock alignment for the offline quorum (BRIEF §5.2): "the last /api/time offset (kept from when online), plus mesh
 * time-exchange (NTP-style RTT over the link) when offline".
 *
 * Every phone keeps one estimate of SERVER time: server ≈ raw + offsetMs, where raw is a monotonic clock
 * (SystemClock.elapsedRealtime on Android, so a user changing the wall clock can't move it). The estimate carries an
 * error bound errMs at the moment it was made, and the bound grows with the crystal drift while time passes.
 *
 *  - From the server (/api/time, Cristian's algorithm like the web app): best of N by lowest round trip, err = rtt/2.
 *  - From a neighbour over one Bluetooth hop (NTP's four timestamps): offset θ = ((t2 − t1) + (t3 − t4)) / 2,
 *    round trip δ = (t4 − t1) − (t3 − t2). The true offset is within θ ± δ/2 whatever the path asymmetry, so
 *    err = neighbour's own err + δ/2. A phone only adopts a neighbour's time when that error is smaller than its own,
 *    so errors strictly grow along a chain and two phones can never feed each other in a loop.
 *
 * Pure Kotlin (no Android) so it is unit-tested on the JVM.
 */
data class ClockFix(
    val offsetMs: Long,      // server time − raw clock
    val errMs: Long,         // error bound when the fix was made
    val atRaw: Long,         // raw clock when the fix was made
    val source: String,      // "server" or the neighbour's label
    val hops: Int,           // 0 = from the server, n = n Bluetooth hops away from a server-synced phone
) {
    /** Error bound at raw time [raw]: grows by the drift bound as time passes. */
    fun errAt(raw: Long): Long = errMs + ceilDiv(max(0L, raw - atRaw) * ClockMath.DRIFT_PPM, 1_000_000L)
    private fun ceilDiv(a: Long, b: Long) = (a + b - 1) / b
}

/** One neighbour answer: t1/t4 on the asking phone's raw clock, t2/t3 on the answering phone's server-time estimate. */
data class PeerSample(val peer: String, val t1: Long, val t2: Long, val t3: Long, val t4: Long, val peerErrMs: Long, val peerHops: Int)

object ClockMath {
    /**
     * Assumed drift bound of a phone's clock, parts per million. Phone crystals are specified around ±20–50 ppm; 100 is
     * deliberately pessimistic (an overestimate only makes phones re-sync sooner). Real drift: TODO(measure).
     */
    const val DRIFT_PPM = 100L
    /** Never trust a neighbour sample whose round trip is longer than this (a stuck or queued link). */
    const val MAX_RTT_MS = 2_000L
    const val MAX_HOPS = 7

    /** Cristian's algorithm: samples are (t0 raw, server time, t1 raw). Lowest round trip wins. */
    fun fromServer(samples: List<Triple<Long, Long, Long>>): ClockFix? {
        val best = samples.filter { it.third >= it.first }.minByOrNull { it.third - it.first } ?: return null
        val rtt = best.third - best.first
        val offset = best.second + rtt / 2 - best.third
        return ClockFix(offset, rtt / 2 + 1, best.third, "server", 0)    // +1: the server's integer-ms rounding
    }

    /** NTP four-timestamp sample → fix on the asking phone's raw clock, or null if unusable. */
    fun fromPeer(s: PeerSample): ClockFix? {
        val delta = (s.t4 - s.t1) - (s.t3 - s.t2)
        if (s.t4 < s.t1 || s.t3 < s.t2 || delta < 0 || delta > MAX_RTT_MS || s.peerErrMs < 0 || s.peerHops + 1 > MAX_HOPS) return null
        // θ = ((t2 − t1) + (t3 − t4)) / 2, rounded toward −∞ consistently; the +1 covers that rounding.
        val theta = Math.floorDiv((s.t2 - s.t1) + (s.t3 - s.t4), 2L)
        return ClockFix(theta, s.peerErrMs + (delta + 1) / 2 + 1, s.t4, s.peer, s.peerHops + 1)
    }

    /** Best sample per neighbour (lowest round trip), as fixes. */
    fun bestPerPeer(samples: List<PeerSample>): List<ClockFix> =
        samples.groupBy { it.peer }.mapNotNull { (_, l) -> l.mapNotNull { s -> fromPeer(s)?.let { s to it } }.minByOrNull { (s, _) -> (s.t4 - s.t1) - (s.t3 - s.t2) }?.second }

    /**
     * Choose which fix to keep. Candidates whose interval [offset ± err] doesn't overlap at least half of the other
     * candidates are dropped (a neighbour with a broken clock, or one lying, can't win against two honest ones);
     * among the rest, the smallest error bound now wins. The current fix is kept unless a candidate is strictly better.
     */
    fun select(current: ClockFix?, candidates: List<ClockFix>, rawNow: Long): ClockFix? {
        val agreeing = if (candidates.size < 3) candidates else candidates.filter { c ->
            val others = candidates.filter { it !== c }
            others.count { overlaps(c, it, rawNow) } * 2 >= others.size
        }
        val best = agreeing.minWithOrNull(compareBy<ClockFix> { it.errAt(rawNow) }.thenBy { it.source }) ?: return current
        return if (current == null || best.errAt(rawNow) < current.errAt(rawNow)) best else current
    }

    fun overlaps(a: ClockFix, b: ClockFix, rawNow: Long): Boolean {
        val ea = a.errAt(rawNow); val eb = b.errAt(rawNow)
        return max(a.offsetMs - ea, b.offsetMs - eb) <= min(a.offsetMs + ea, b.offsetMs + eb)
    }
}

/**
 * The phone's clock: server time when it has a fix, else the phone's own wall clock (Android's network time, which is
 * usually right but unchecked). [raw] must be monotonic within one boot; [wall] is epoch ms.
 */
class TimeKeeper(private val raw: () -> Long, private val wall: () -> Long) {
    @Volatile var fix: ClockFix? = null; private set

    fun now(): Long = fix?.let { raw() + it.offsetMs } ?: wall()
    /** Current error bound in ms, or null when the time is the phone's own unchecked clock. */
    fun errMs(): Long? = fix?.errAt(raw())
    fun rawNow(): Long = raw()
    fun clear() = synchronized(this) { fix = null }

    fun adoptServer(samples: List<Triple<Long, Long, Long>>): ClockFix? =
        ClockMath.fromServer(samples)?.also { synchronized(this) { fix = it } }   // the server is the reference: always take it

    /** Offer neighbour samples from one exchange round. Returns the new fix if it changed. */
    fun offerPeers(samples: List<PeerSample>): ClockFix? = synchronized(this) {
        val next = ClockMath.select(fix, ClockMath.bestPerPeer(samples), raw())
        if (next != null && next != fix) { fix = next; next } else null
    }

    // ---- persistence: the fix must survive an app restart (and, more loosely, a reboot) while offline
    data class Saved(val offsetMs: Long, val errMs: Long, val atRaw: Long, val atWall: Long, val source: String, val hops: Int, val boot: Int)

    fun save(boot: Int): Saved? = fix?.let { f -> val r = raw(); val w = wall()
        Saved(f.offsetMs, f.errAt(r), r, w, f.source, f.hops, boot) }

    /**
     * Same boot: the raw clock continued, so the fix is still valid as saved. After a reboot the raw clock restarted;
     * re-anchor on the wall clock: offset vs. wall at save time, error grown by the drift over the wall time since.
     * (If someone changed the wall clock while the phone was off, this is wrong; it is replaced at the next sync.)
     */
    fun restore(s: Saved, boot: Int) = synchronized(this) {
        fix = if (s.boot == boot && raw() >= s.atRaw) ClockFix(s.offsetMs, s.errMs, s.atRaw, s.source, s.hops)
        else {
            val serverAtSave = s.atRaw + s.offsetMs
            val wallOffset = serverAtSave - s.atWall                  // server − wall when saved
            val r = raw(); val w = wall()
            val grown = ClockFix(0, s.errMs, s.atWall, s.source, s.hops).errAt(w)
            ClockFix(w + wallOffset - r, grown, r, s.source, s.hops)
        }
    }
}
