// Tremor Witness Mesh — new code (not from bitchat/SafeMesh). GPL-3.0 as part of this app.
package dev.dhruv.twmesh

import android.content.Context
import com.google.gson.Gson
import dev.dhruv.twmesh.chain.Ens
import dev.dhruv.twmesh.chain.EnsPhone
import dev.dhruv.twmesh.core.RegistrationInterval
import dev.dhruv.twmesh.core.Registry
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import java.io.File

/**
 * M2: the site's phone roster, fetched from ENS on Sepolia whenever online and saved on the phone, so the mesh can
 * check "is this a registered phone?" with no internet (BRIEF §5.3). Stored with its fetch time and block number.
 */
data class RosterSnapshot(
    val site: String,
    val fetchedAtMs: Long,
    val block: Long,
    val phones: List<EnsPhone>,
    val intervals: List<RegistrationInterval>,
    val k: Int?,               // tw.k (construction tier)
    val windowMs: Long?,       // tw.window_ms
    val dk: Int?,              // tw.dk (disaster tier, R2: may be missing)
    val dWindowMs: Long?,      // tw.dwindow_ms
) {
    /** Mesh as-of rule: [heardAtMs] = when this phone first heard the message. */
    fun isRegistered(label: String, addr: String, tMs: Long, heardAtMs: Long) =
        Registry.asOfCheck(intervals, dev.dhruv.twmesh.core.Trigger("", label, addr, tMs, 0.0, 0.0, "structural", heardAtMs)) ==
            dev.dhruv.twmesh.core.AsOf.OK
    fun ageMs(now: Long = System.currentTimeMillis()) = now - fetchedAtMs
}

class RosterStore private constructor(private val dir: File) {
    companion object {
        @Volatile private var inst: RosterStore? = null
        fun get(ctx: Context) = inst ?: synchronized(this) { inst ?: RosterStore(ctx.applicationContext.filesDir).also { inst = it } }
        private val gson = Gson()
    }

    private val _current = MutableStateFlow<RosterSnapshot?>(null)
    val current: StateFlow<RosterSnapshot?> = _current

    private fun file(site: String) = File(dir, "roster-${site.lowercase()}.json")

    fun load(site: String): RosterSnapshot? =
        (_current.value?.takeIf { it.site == site } ?: try { gson.fromJson(file(site).readText(), RosterSnapshot::class.java) } catch (_: Exception) { null })
            ?.also { _current.value = it }

    fun save(s: RosterSnapshot) {
        val tmp = File(dir, file(s.site).name + ".tmp"); tmp.writeText(gson.toJson(s)); tmp.renameTo(file(s.site))
        _current.value = s
    }

    /** Blocking network fetch; keeps the old snapshot if anything fails. */
    fun refresh(site: String, ens: Ens = Ens()): Result<RosterSnapshot> = runCatching {
        val h = ens.registrationHistory(site)
        fun num(key: String) = ens.siteText(site, key)?.trim()?.toLongOrNull()
        RosterSnapshot(site, System.currentTimeMillis(), h.block, h.phones, h.intervals,
            num("tw.k")?.toInt(), num("tw.window_ms"), num("tw.dk")?.toInt(), num("tw.dwindow_ms")).also { save(it) }
    }
}
