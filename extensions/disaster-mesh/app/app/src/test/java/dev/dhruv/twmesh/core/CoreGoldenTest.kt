// Tremor Witness Mesh — new code (not from bitchat/SafeMesh). GPL-3.0 as part of this app.
package dev.dhruv.twmesh.core

import com.google.gson.Gson
import com.google.gson.JsonObject
import org.junit.Assert.assertEquals
import org.junit.Test

/** BRIEF §9: the Kotlin quorum/as-of must reproduce the TypeScript originals exactly (core-v1.json, 307 cases). */
class CoreGoldenTest {
    private val v = Gson().fromJson(javaClass.classLoader!!.getResource("golden/core-v1.json")!!.readText(), JsonObject::class.java)
    private val inf = v["infinity"].asDouble

    private fun interval(o: JsonObject) = RegistrationInterval(
        o["label"].asString, o["owner"].asString, o["fromMs"].asLong,
        o["toMs"].asDouble.let { if (it >= inf) Long.MAX_VALUE else it.toLong() })

    @Test fun `registeredAt edges`() {
        val r = v["regAt"].asJsonObject
        val iv = r["intervals"].asJsonArray.map { interval(it.asJsonObject) }
        for (c in r["checks"].asJsonArray.map { it.asJsonObject })
            assertEquals("at ${c["at"]}", c["ok"].asBoolean, Registry.registeredAt(iv, "a-m", iv[0].owner.uppercase(), c["at"].asLong, c["slack"].asLong))
    }

    @Test fun `quorum and as-of match the TypeScript on every case`() {
        val cases = v["cases"].asJsonArray.map { it.asJsonObject }
        assertEquals(307, cases.size)
        cases.forEachIndexed { n, c ->
            val intervals = c["intervals"].asJsonArray.map { interval(it.asJsonObject) }
            val triggers = c["triggers"].asJsonArray.map { it.asJsonObject }.map { t ->
                Trigger(t["id"].asString, t["sensor"].asString, t["creator"].asString, t["tMs"].asLong, t["ppvMmS"].asDouble,
                    t["fDomHz"].asDouble, t["label"].asString, t["createdAtMs"]?.asLong)
            }
            val asOf = c["asOf"].asJsonArray.map { it.asString }
            if (asOf.isNotEmpty()) assertEquals("case $n asOf", asOf, triggers.map { Registry.asOfCheck(intervals, it).js })

            val live: ((Trigger) -> Boolean)? = if (c["useRegistry"].asBoolean) { t -> Registry.asOfCheck(intervals, t) == AsOf.OK } else null
            val r = Quorum.compute(triggers, QuorumParams(c["k"].asInt, c["windowMs"].asLong, live))
            val expEvents = c["events"].asJsonArray.map { it.asJsonObject }
            assertEquals("case $n events", expEvents.size, r.events.size)
            expEvents.zip(r.events).forEach { (e, a) ->
                assertEquals("case $n tMs", e["tMs"].asLong, a.tMs)
                assertEquals("case $n sensors", e["sensors"].asJsonArray.map { it.asString }, a.sensors)
                assertEquals("case $n members", e["memberIds"].asJsonArray.map { it.asString }, a.members.map { it.id })
                assertEquals(e["ppvMinMmS"].asDouble, a.ppvMinMmS, 0.0)
                assertEquals(e["ppvMaxMmS"].asDouble, a.ppvMaxMmS, 0.0)
            }
            assertEquals("case $n rejected",
                c["rejected"].asJsonArray.map { it.asJsonObject.let { o -> o["id"].asString to o["reason"].asString } },
                r.rejected.map { it.first.id to it.second.js })
        }
    }
}
