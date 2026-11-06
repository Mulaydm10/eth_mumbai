// Tremor Witness Mesh — new code (not from bitchat/SafeMesh). GPL-3.0 as part of this app.
package dev.dhruv.twmesh.chain

import com.google.gson.Gson
import com.google.gson.JsonObject
import org.junit.Assert.assertEquals
import org.junit.Assume.assumeTrue
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.RobolectricTestRunner

/** Read-only checks against live Sepolia. Run with TWM_LIVE=1 (skipped otherwise: CI has no network). */
@RunWith(RobolectricTestRunner::class)
class LiveSepoliaTest {
    private val live = System.getenv("TWM_LIVE") == "1"
    private val v: JsonObject = Gson().fromJson(javaClass.classLoader!!.getResource("golden/chain-v1.json")!!.readText(), JsonObject::class.java)

    @Test fun `site registry address matches viem`() {
        assumeTrue(live)
        val ens = Ens()
        for (site in listOf("test2", "demo"))
            assertEquals(v["live"].asJsonObject[site].asJsonObject["registry"].asString, ens.siteRegistry(site))
    }

    @Test fun `live phones resolve to their owners`() {
        assumeTrue(live)
        val ens = Ens()
        for (site in listOf("test2", "demo")) {
            val (phones, block) = ens.listSitePhones(site)
            println("LIVE $site @ block $block: ${phones.size} phones; k=${ens.siteText(site, "tw.k")} window=${ens.siteText(site, "tw.window_ms")}")
            for (p in phones) {
                val r = ens.resolveAddress(p.name)
                println("  ${p.label} expiry=${p.expiry} resolves=${r == p.owner}")
                assertEquals(p.owner, r)
            }
        }
        println("  nonexistent resolves to: ${ens.resolveAddress("zz-not-a-phone.test2.tremorwitness.eth")}")
    }

    @Test fun `registration history covers every live phone now`() {
        assumeTrue(live)
        val h = Ens().registrationHistory("test2")
        val now = System.currentTimeMillis()
        println("LIVE history test2: ${h.intervals.size} intervals, ${h.phones.size} live, block ${h.block}")
        for (p in h.phones) org.junit.Assert.assertTrue(p.label,
            dev.dhruv.twmesh.core.Registry.registeredAt(h.intervals, p.label, p.owner, now))
    }
}
