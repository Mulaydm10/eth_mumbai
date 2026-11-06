# EXP-0001: disaster-tier shaking threshold

Status: **starting value from published data; phone validation TODO(measure).** Opened 2026-11-06.

## Question
At what peak velocity should one phone report "disaster-strength shaking" (`dtrigger`)? The level must be far above
construction vibration, which the Tremor Witness construction pipeline already detects at about 0.3–3 mm/s several
times a day near piling (BRIEF §5.1). Construction vibration must never arm the mesh.

## Method (no invented numbers)
1. **Published intensity ↔ ground-velocity relation.** USGS ShakeMap uses the ground-motion-to-intensity conversion of
   Worden, Gerstenberger, Rhoades & Wald (2012), *Probabilistic relationships between ground-motion parameters and
   Modified Mercalli Intensity in California*, BSSA 102(1):204–221, doi:10.1785/0120110156. The coefficients were read
   from ShakeMap's own implementation (`shakelib/gmice/wgrw12.py`, class WGRW12, PGV in cm/s, log10):
   - MMI = 3.78 + 1.47·log10(PGV) for −1.21 ≤ log10(PGV) < 0.53
   - MMI = 2.89 + 3.16·log10(PGV) for log10(PGV) ≥ 0.53
2. **Pick the intensity.** MMI **VI** is the first level described as "strong" (felt by all, some heavy furniture
   moved, slight damage). Inverting the upper segment: PGV = 10^((6 − 2.89)/3.16) cm/s = **9.64 cm/s = 96.4 mm/s**.
   For reference, MMI V gives 46.5 mm/s and MMI VII gives 199 mm/s.
3. **Chosen starting threshold: PPV ≥ 96.4 mm/s** on a structural (not handling) event: `Detector.DISASTER_PPV_MMS`.
   That is about 30× the top of the construction range above.

## Detection chain
- Same DSP as the web app (`packages/core/src/dsp.ts`), ported to Kotlin and checked sample by sample against the
  TypeScript (`dsp-v1.json`: 5 synthetic signals at 50–400 Hz, worst relative difference 3·10⁻¹⁴).
- Same event state machine and constants as the web app's construction pipeline: STA/LTA > 4, 1.2 s window, 1.5 s
  refractory, 0.3 mm/s floor, handling = tilt > 15° or band acceleration > 30 m/s².
- **Deliberate difference:** the web pipeline also calls an event "handling" when more than 50 % of its energy is
  below 3 Hz. Earthquake shaking is often dominated by 1–5 Hz. A synthetic 2–6 Hz quake burst has a low-frequency
  share of 0.47–0.70 (`dsp-v1.json`; `DetectorTest`), so that rule would throw real earthquakes away. The disaster
  tier does not use it. Hand sway is covered instead by (a) the tilt check (a phone lying on a floor doesn't tilt) and
  (b) the quorum: k registered phones must agree within the window.

## Known limitations (to measure, not to guess)
- **The band-pass removes energy below 2 Hz** (to remove sway and integration drift). Long-period shaking under 2 Hz
  is therefore under-measured. How much: TODO(measure) by replaying published strong-motion records through the DSP.
- **Phone ≠ free-field ground sensor.** A phone on a floor inside a building measures the floor, which may amplify or
  damp the ground motion. TODO(measure).
- **Delivered sample rate varies** (emulator: 20 Hz; phones typically far higher). The band's upper corner is
  min(25 Hz, 0.42·fs). The effect at low rates is TODO(measure).
- **Battery** while listening: TODO(measure).

## Validation plan (BRIEF: a shake table or drop test is NOT a valid calibration)
1. **Replay real records:** run published accelerograms (e.g. from the USGS/CESMD strong-motion archive) through the
   Kotlin DSP at phone sample rates. Compare our PPV with the record's published PGV, and check intensity-VI records
   cross the threshold while intensity IV–V records don't.
2. **False positives:** leave phones listening for days at an active construction site (piling, compaction) and in
   ordinary homes. The expected number of disaster-tier events is 0; any event is logged with its features.
3. Revisit the threshold only from 1–2 results, and log every change here.

## Results so far
| Date | What | Result |
|---|---|---|
| 2026-11-06 | DSP port vs TypeScript, 5 synthetic signals | identical to 3·10⁻¹⁴ |
| 2026-11-06 | Synthetic strong burst (6 m/s², 2–6 Hz) | 234 mm/s, structural, disaster ✓ |
| 2026-11-06 | Same burst at 0.3 m/s² | event, not a disaster ✓ |
| 2026-11-06 | Strong burst while the phone tilts 45° | handling, not a disaster ✓ |
| 2026-11-06 | Emulator sensor console, ±25 m/s² square wave | 1275 mm/s, but tilt 27° → handling ✓ (an artificial signal, not a calibration) |
