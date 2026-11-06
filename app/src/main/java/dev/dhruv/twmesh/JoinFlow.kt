// Tremor Witness Mesh — new code (not from bitchat/SafeMesh). GPL-3.0 as part of this app.
package dev.dhruv.twmesh

import dev.dhruv.twmesh.chain.Ens
import dev.dhruv.twmesh.chain.Invite
import dev.dhruv.twmesh.chain.Tw
import dev.dhruv.twmesh.chain.TwApi

/**
 * M1 join: invite → gas top-ups → /api/ens-register → check the name resolves on Sepolia to this phone's key.
 * Blocking; run on a background thread. Messages are plain words for the screen.
 */
class JoinFlow(
    private val api: TwApi = TwApi(),
    private val ens: Ens = Ens(),
    private val nowMs: () -> Long = System::currentTimeMillis,
    private val sleep: (Long) -> Unit = Thread::sleep,
    private val committee: String = Tw.COMMITTEE,
) {
    enum class State { RUNNING, DONE, WARN, FAILED }
    data class Step(val id: String, val text: String, val state: State)
    data class Result(val ok: Boolean, val name: String?, val expiry: Long, val resolved: Boolean, val error: String?)

    /** Checks that need no network. Returns a plain-words problem, or null if fine. */
    fun precheck(invite: Invite?, label: String): String? = when {
        invite == null -> "That is not a Tremor Witness invite. Scan the invite QR on the committee's dashboard."
        !Tw.LABEL_RE.matches(invite.site) -> "The invite names an invalid site."
        !invite.signedByCommittee(committee) -> "This invite was not signed by the site committee. Don't use it."
        invite.exp < nowMs() -> "This invite has expired (they last 30 minutes). Ask the committee for a new one."
        !Tw.LABEL_RE.matches(label) -> "Phone name: 3 to 32 characters, only a–z, 0–9 and -, not starting or ending with -."
        else -> null
    }

    fun run(invite: Invite?, label: String, address: String, onStep: (Step) -> Unit): Result {
        precheck(invite, label)?.let { onStep(Step("check", it, State.FAILED)); return Result(false, null, 0, false, it) }
        invite!!
        val site = invite.site.lowercase(); val name = Tw.phoneName(site, label)
        onStep(Step("check", "Invite for site \"$site\" is signed by the committee", State.DONE))

        // Gas top-ups are not needed to register (the committee pays); they let the phone write its own records later.
        for ((id, sepolia, what) in listOf(Triple("gas-arkiv", false, "Arkiv"), Triple("gas-sepolia", true, "Sepolia"))) {
            onStep(Step(id, "Getting a little $what gas for this phone…", State.RUNNING))
            val r = try { api.drip(address, sepolia) } catch (e: Exception) { null }
            onStep(
                if (r?.ok == true) Step(id, "$what gas: ${if (r.json["funded"]?.asBoolean == true) "topped up" else "already enough"}", State.DONE)
                else Step(id, "$what gas: not now (${r?.error ?: "no internet"}). Joining still works.", State.WARN)
            )
        }

        onStep(Step("register", "Registering $name… (can take a minute)", State.RUNNING))
        val reg = try { api.register(site, label, address, invite.raw) } catch (e: Exception) {
            val msg = "Could not reach the Tremor Witness server: ${e.message ?: "no internet"}"
            onStep(Step("register", msg, State.FAILED)); return Result(false, name, 0, false, msg)
        }
        if (!reg.ok) {
            val msg = reg.error ?: "registration failed (HTTP ${reg.code})"
            onStep(Step("register", msg, State.FAILED)); return Result(false, name, 0, false, msg)
        }
        val expiry = reg.json["expiry"]?.asLong ?: 0
        val left = reg.json["usesLeft"]?.takeIf { !it.isJsonNull }?.asInt
        onStep(Step("register", (if (reg.json["existing"]?.asBoolean == true) "$name was already this phone's: rejoined" else "Registered $name") +
            (left?.let { " ($it more phone${if (it == 1) "" else "s"} can join with this invite)" } ?: ""), State.DONE))

        onStep(Step("resolve", "Checking the name on Sepolia…", State.RUNNING))
        var got: String? = null
        for (i in 0 until 8) {                 // public RPCs lag a few blocks behind the server's transaction
            got = try { ens.resolveAddress(name) } catch (_: Exception) { null }
            if (got.equals(address, ignoreCase = true)) break
            sleep(5000)
        }
        val ok = got.equals(address, ignoreCase = true)
        onStep(
            if (ok) Step("resolve", "$name resolves to this phone's key", State.DONE)
            else Step("resolve", "Registered, but Sepolia doesn't show it yet (${got ?: "no answer"}). Check again later.", State.WARN)
        )
        return Result(true, name, expiry, ok, null)
    }
}
