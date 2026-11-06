// Tremor Witness Mesh — new code (not from bitchat/SafeMesh). GPL-3.0 as part of this app.
package dev.dhruv.twmesh

/** Kill switches for inherited SafeMesh/bitchat features that TW Mesh does not use (BRIEF §3: strip). */
object TwmFlags {
    /** Nostr relays (geohash channels, location notes, Nostr DMs): off. No relay connection is ever opened. */
    const val NOSTR = false
}
