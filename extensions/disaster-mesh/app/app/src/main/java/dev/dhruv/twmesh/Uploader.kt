// Tremor Witness Mesh — new code (not from bitchat/SafeMesh). GPL-3.0 as part of this app.
package dev.dhruv.twmesh

import android.content.Context
import android.util.Log
import com.google.gson.Gson
import dev.dhruv.twmesh.chain.Arkiv
import dev.dhruv.twmesh.chain.ArkivWriter
import dev.dhruv.twmesh.chain.TwApi
import dev.dhruv.twmesh.core.MeshMsg
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.sync.Mutex
import kotlinx.coroutines.sync.withLock
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.io.File
import java.math.BigInteger

/**
 * M6 (BRIEF §6): when this phone is online, it writes ITS OWN messages to Arkiv with its own key ($creator = phone),
 * as tremor-witness.v1.dtrigger / .checkin (R2/R3). Never other phones' messages. Test shaking signals are not uploaded.
 */
object Uploader {
    private const val TAG = "TwmUploader"
    data class Status(val uploaded: Int = 0, val pending: Int = 0, val lastError: String? = null, val lastEntity: String? = null)
    private val _status = MutableStateFlow(Status())
    val status: StateFlow<Status> = _status
    private val lock = Mutex()
    private val gson = Gson()
    private val MIN_BALANCE = BigInteger("2000000000000000")   // 0.002 tGLM (2 writes measured 0.00064 tGLM)

    private fun file(ctx: Context, site: String) = File(ctx.filesDir, "uploaded-$site.json")
    private fun load(ctx: Context, site: String): MutableMap<String, String> =
        try { gson.fromJson(file(ctx, site).readText(), HashMap<String, String>()::class.java) as MutableMap<String, String> } catch (_: Exception) { HashMap() }

    fun uploadable(m: MeshMsg) = when (m.type) { "checkin", "dmanual" -> true; "dtrigger" -> m.long("test") != 1L; else -> false }

    suspend fun uploadPending(ctx: Context) = withContext(Dispatchers.IO) {
        if (!lock.tryLock()) return@withContext
        try {
            val me = PhoneIdentity.get(ctx); val site = me.site ?: return@withContext
            val done = load(ctx, site)
            val todo = MeshState.ownMessages().filter { uploadable(it) && it.id !in done }.sortedBy { it.tMs }
            _status.value = _status.value.copy(uploaded = done.size, pending = todo.size)
            if (todo.isEmpty()) return@withContext
            val w = ArkivWriter()
            val pk = me.privateKeyForOwnWrites()
            if (w.balance(me.address) < MIN_BALANCE) {
                TwApi().drip(me.address)
                for (i in 0 until 10) { if (w.balance(me.address).signum() > 0) break; Thread.sleep(3000) }
            }
            for (m in todo) {
                val seq = m.long("seq") ?: 0
                val data = when (m.type) {
                    "checkin" -> Arkiv.calldata(Arkiv.Checkin(m.site, m.sender, m.tMs, m.str("status")!!, m.str("note") ?: "", m.long("armMs") ?: 0, seq), Arkiv.randomSalt())
                    "dmanual" -> Arkiv.calldata(Arkiv.DTrigger(m.site, m.sender, m.tMs, 0, 0, "manual", "", seq), Arkiv.randomSalt())
                    else -> Arkiv.calldata(Arkiv.DTrigger(m.site, m.sender, m.tMs, m.long("ppvUm") ?: 0, m.long("fDomCHz") ?: 0, "auto", m.str("label") ?: "structural", seq), Arkiv.randomSalt())
                }
                val r = w.write(data, pk)
                done[m.id] = r.entityKey
                file(ctx, site).writeText(gson.toJson(done))
                Log.i(TAG, "uploaded ${m.type} seq $seq → ${r.entityKey}")
                _status.value = Status(done.size, todo.size - todo.indexOf(m) - 1, null, r.entityKey)
            }
        } catch (e: Exception) {
            Log.w(TAG, "upload failed: ${e.message}")
            val offline = e is java.io.IOException || e.cause is java.io.IOException
            _status.value = _status.value.copy(lastError = if (offline) "no internet" else e.message?.take(80) ?: "error")
        } finally { lock.unlock() }
    }
}
