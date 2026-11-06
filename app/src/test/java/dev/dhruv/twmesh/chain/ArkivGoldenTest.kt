// Tremor Witness Mesh — new code (not from bitchat/SafeMesh). GPL-3.0 as part of this app.
package dev.dhruv.twmesh.chain

import com.google.gson.Gson
import com.google.gson.JsonObject
import org.junit.Assert.assertEquals
import org.junit.Test
import java.math.BigInteger
import kotlin.math.roundToLong

/** R2/R3: our Arkiv dtrigger/checkin writes must be byte-identical to packages/chain/src/mesh.ts (arkiv-v1.json). */
class ArkivGoldenTest {
    private val v = Gson().fromJson(javaClass.classLoader!!.getResource("golden/arkiv-v1.json")!!.readText(), JsonObject::class.java)
    private val pk = Hex.decode(v["key"].asString)

    @Test fun `calldata and signed transaction match the SDK for every case`() {
        assertEquals(v["address"].asString, Eth.address(pk))
        val cases = v["cases"].asJsonArray.map { it.asJsonObject }
        assertEquals(4, cases.size)
        for (c in cases) {
            val i = c["input"].asJsonObject
            val salt = BigInteger(1, ByteArray(16) { c["saltByte"].asInt.toByte() })
            val data = when (c["kind"].asString) {
                "dtrigger" -> Arkiv.calldata(Arkiv.DTrigger(i["site"].asString, i["sensor"].asString, i["tMs"].asLong,
                    (i["ppvMmS"].asDouble * 1000).roundToLong(), (i["fDomHz"].asDouble * 100).roundToLong(),
                    i["kind"].asString, i["label"]?.asString ?: "", i["seq"].asLong), salt)
                else -> Arkiv.calldata(Arkiv.Checkin(i["site"].asString, i["sensor"].asString, i["tMs"].asLong, i["status"].asString,
                    i["note"]?.asString ?: "", i["armMs"]?.asLong ?: 0, i["seq"].asLong), salt)
            }
            assertEquals("${c["kind"]} calldata", c["calldata"].asString, Hex.encode(data))
            assertEquals(Arkiv.ADDRESS, c["to"].asString)
            val tx = c["tx"].asJsonObject
            val raw = Tx.signEip1559(v["chainId"].asLong, tx["nonce"].asLong, BigInteger(tx["maxPriorityFeePerGas"].asString),
                BigInteger(tx["maxFeePerGas"].asString), tx["gas"].asLong, Arkiv.ADDRESS, BigInteger(tx["value"].asString), data, pk)
            assertEquals("${c["kind"]} raw tx", c["rawTx"].asString, Hex.encode(raw))
        }
    }
}
