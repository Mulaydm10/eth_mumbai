// Reference clock for phones (Cristian's algorithm on the phone side). Vercel servers are NTP-synced.
// Only used to align timestamps across phones at write time; readers never depend on it.
export function GET(): Response {
  return Response.json({ t: Date.now() }, { headers: { "cache-control": "no-store" } });
}
