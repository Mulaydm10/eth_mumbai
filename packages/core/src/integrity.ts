// T1: gap evidence. Every phone numbers its readings 1, 2, 3… (seq). Readings are created `readonly` on Arkiv, so they
// cannot be edited; the only tampering left is deletion by the phone's owner. A missing seq number between two present
// ones is therefore a visible gap: "deleted, or never uploaded". Pure, so any verifier gets the same answer.

export interface SeqGap {
  from: number; // first missing seq
  to: number; // last missing seq
}

/** Missing seq ranges strictly between the lowest and highest seq seen (duplicates ignored). */
export function seqGaps(seqs: number[]): SeqGap[] {
  const s = [...new Set(seqs.filter((n) => Number.isInteger(n) && n > 0))].sort((a, b) => a - b);
  const gaps: SeqGap[] = [];
  for (let i = 1; i < s.length; i++) if (s[i]! > s[i - 1]! + 1) gaps.push({ from: s[i - 1]! + 1, to: s[i]! - 1 });
  return gaps;
}

export const gapCount = (g: SeqGap[]) => g.reduce((n, x) => n + (x.to - x.from + 1), 0);
