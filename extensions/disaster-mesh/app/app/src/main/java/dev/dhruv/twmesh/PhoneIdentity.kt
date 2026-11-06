// Tremor Witness Mesh — new code (not from bitchat/SafeMesh). GPL-3.0 as part of this app.
package dev.dhruv.twmesh

import android.content.Context
import android.content.SharedPreferences
import androidx.security.crypto.EncryptedSharedPreferences
import androidx.security.crypto.MasterKey
import dev.dhruv.twmesh.chain.Eth
import dev.dhruv.twmesh.chain.Hex
import dev.dhruv.twmesh.chain.Tw

/**
 * The phone's own Ethereum key (its ENS owner and Arkiv $creator) and its site membership.
 * The key is encrypted at rest with an AES key held in Android Keystore (EncryptedSharedPreferences);
 * Android Keystore itself has no secp256k1, so the key can't live inside it directly. Never exported, never logged.
 */
class PhoneIdentity private constructor(private val prefs: SharedPreferences) {
    companion object {
        @Volatile private var instance: PhoneIdentity? = null
        fun get(ctx: Context): PhoneIdentity = instance ?: synchronized(this) {
            instance ?: PhoneIdentity(
                EncryptedSharedPreferences.create(
                    ctx.applicationContext, "twm_identity",
                    MasterKey.Builder(ctx.applicationContext).setKeyScheme(MasterKey.KeyScheme.AES256_GCM).build(),
                    EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
                    EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM,
                )
            ).also { instance = it }
        }
    }

    private fun key(): ByteArray = synchronized(this) {
        prefs.getString("pk", null)?.let { Hex.decode(it) }
            ?: Eth.newPrivateKey().also { prefs.edit().putString("pk", Hex.encode(it)).commit() }
    }

    val address: String get() = prefs.getString("addr", null) ?: Eth.address(key()).also { prefs.edit().putString("addr", it).apply() }
    fun signMessage(message: String): String = Eth.signMessage(message, key())
    /** Only for this phone's own Arkiv writes (ArkivWriter); never logged or exported. */
    internal fun privateKeyForOwnWrites(): ByteArray = key()

    /** Per-site message number for this phone (Arkiv `seq`: gaps = missing uploads). */
    @Synchronized fun nextSeq(site: String): Long {
        val k = "seq.$site"; val n = prefs.getLong(k, 0) + 1
        prefs.edit().putLong(k, n).commit(); return n
    }

    // ---- membership (set after a successful /api/ens-register + Sepolia check)
    val site: String? get() = prefs.getString("site", null)
    val label: String? get() = prefs.getString("label", null)
    val ensName: String? get() = site?.let { s -> label?.let { Tw.phoneName(s, it) } }
    val expiry: Long get() = prefs.getLong("expiry", 0)
    val resolvedOk: Boolean get() = prefs.getBoolean("resolved", false)

    fun saveMembership(site: String, label: String, expiry: Long, resolved: Boolean) {
        prefs.edit().putString("site", site).putString("label", label).putLong("expiry", expiry).putBoolean("resolved", resolved).apply()
    }
}
