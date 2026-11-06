// Tremor Witness Mesh — new code (not from bitchat/SafeMesh). GPL-3.0 as part of this app.
package dev.dhruv.twmesh.chain

import org.bouncycastle.asn1.x9.X9IntegerConverter
import org.bouncycastle.crypto.digests.KeccakDigest
import org.bouncycastle.crypto.digests.SHA256Digest
import org.bouncycastle.crypto.ec.CustomNamedCurves
import org.bouncycastle.crypto.params.ECDomainParameters
import org.bouncycastle.crypto.params.ECPrivateKeyParameters
import org.bouncycastle.crypto.signers.ECDSASigner
import org.bouncycastle.crypto.signers.HMacDSAKCalculator
import org.bouncycastle.math.ec.ECAlgorithms
import org.bouncycastle.math.ec.ECPoint
import org.bouncycastle.math.ec.FixedPointCombMultiplier
import java.math.BigInteger
import java.security.SecureRandom

/** Hex helpers ("0x"-prefixed, lowercase). */
object Hex {
    fun encode(b: ByteArray): String = "0x" + b.joinToString("") { "%02x".format(it) }
    fun decode(s: String): ByteArray {
        val h = s.removePrefix("0x").removePrefix("0X")
        require(h.length % 2 == 0) { "odd hex length" }
        return ByteArray(h.length / 2) { h.substring(it * 2, it * 2 + 2).toInt(16).toByte() }
    }
}

fun keccak256(b: ByteArray): ByteArray = KeccakDigest(256).run { update(b, 0, b.size); ByteArray(32).also { doFinal(it, 0) } }
fun keccak256(s: String): ByteArray = keccak256(s.toByteArray(Charsets.UTF_8))

/** Ethereum secp256k1 keys, EIP-55 addresses and EIP-191 personal_sign (same results as viem). */
object Eth {
    private val curve = CustomNamedCurves.getByName("secp256k1")
    private val domain = ECDomainParameters(curve.curve, curve.g, curve.n, curve.h)
    private val halfN = curve.n.shiftRight(1)

    fun newPrivateKey(rnd: SecureRandom = SecureRandom()): ByteArray {
        while (true) {
            val k = ByteArray(32).also { rnd.nextBytes(it) }
            val v = BigInteger(1, k)
            if (v.signum() > 0 && v < curve.n) return k
        }
    }

    /** Uncompressed public key, 65 bytes (0x04 || X || Y). */
    fun publicKey(priv: ByteArray): ByteArray =
        FixedPointCombMultiplier().multiply(domain.g, BigInteger(1, priv)).normalize().getEncoded(false)

    fun addressOfPublicKey(pub65: ByteArray): String = checksum(keccak256(pub65.copyOfRange(1, 65)).copyOfRange(12, 32))
    fun address(priv: ByteArray): String = addressOfPublicKey(publicKey(priv))

    /** EIP-55 mixed-case checksum. */
    fun checksum(addr20: ByteArray): String {
        val hex = Hex.encode(addr20).removePrefix("0x")
        val h = Hex.encode(keccak256(hex)).removePrefix("0x")
        return "0x" + hex.mapIndexed { i, c -> if (c.isLetter() && h[i].digitToInt(16) >= 8) c.uppercaseChar() else c }.joinToString("")
    }
    fun checksum(addr: String): String = checksum(Hex.decode(addr))

    /** EIP-191 version 0x45 ("personal_sign") hash of a UTF-8 message. */
    fun hashMessage(message: String): ByteArray {
        val m = message.toByteArray(Charsets.UTF_8)
        return keccak256("\u0019Ethereum Signed Message:\n${m.size}".toByteArray(Charsets.UTF_8) + m)
    }

    /** 65-byte r||s||v signature (v = 27/28), RFC 6979 deterministic, low-s: byte-identical to viem's signMessage. */
    fun signHash(hash: ByteArray, priv: ByteArray): ByteArray {
        val signer = ECDSASigner(HMacDSAKCalculator(SHA256Digest()))
        signer.init(true, ECPrivateKeyParameters(BigInteger(1, priv), domain))
        val (r, s0) = signer.generateSignature(hash)
        val s = if (s0 > halfN) curve.n - s0 else s0
        val pub = publicKey(priv)
        val recId = (0..1).first { recoverPublicKey(hash, r, s, it)?.contentEquals(pub) == true }
        return to32(r) + to32(s) + byteArrayOf((27 + recId).toByte())
    }
    fun signMessage(message: String, priv: ByteArray): String = Hex.encode(signHash(hashMessage(message), priv))

    /** Address that produced a 65-byte signature over a personal_sign message, or null if invalid. */
    fun recoverMessageAddress(message: String, signature: String): String? = try {
        val sig = Hex.decode(signature)
        if (sig.size != 65) null else {
            val v = sig[64].toInt() and 0xff
            val recId = when (v) { 27, 28 -> v - 27; 0, 1 -> v; else -> -1 }
            val r = BigInteger(1, sig.copyOfRange(0, 32)); val s = BigInteger(1, sig.copyOfRange(32, 64))
            if (recId < 0 || r.signum() <= 0 || s.signum() <= 0 || r >= curve.n || s >= curve.n) null
            else recoverPublicKey(hashMessage(message), r, s, recId)?.let { addressOfPublicKey(it) }
        }
    } catch (_: Exception) { null }

    private fun recoverPublicKey(hash: ByteArray, r: BigInteger, s: BigInteger, recId: Int): ByteArray? {
        val n = curve.n
        val x = r + BigInteger.valueOf((recId / 2).toLong()) * n
        if (x >= curve.curve.field.characteristic) return null
        val conv = X9IntegerConverter()
        val enc = conv.integerToBytes(x, 1 + conv.getByteLength(curve.curve))
        enc[0] = if (recId and 1 == 1) 0x03 else 0x02
        val bigR: ECPoint = curve.curve.decodePoint(enc)
        if (!bigR.multiply(n).isInfinity) return null
        val e = BigInteger(1, hash)
        val rInv = r.modInverse(n)
        val q = ECAlgorithms.sumOfTwoMultiplies(domain.g, (BigInteger.ZERO - e).mod(n) * rInv % n, bigR, rInv * s % n)
        return q.normalize().getEncoded(false)
    }

    private fun to32(v: BigInteger): ByteArray {
        val b = v.toByteArray()
        return when {
            b.size == 32 -> b
            b.size > 32 -> b.copyOfRange(b.size - 32, b.size)
            else -> ByteArray(32 - b.size) + b
        }
    }

    private operator fun Array<BigInteger>.component1() = this[0]
    private operator fun Array<BigInteger>.component2() = this[1]
}
