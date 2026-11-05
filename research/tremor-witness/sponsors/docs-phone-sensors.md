# Docs study: phone-sensors (docs agent, started 01:27 IST)

## Phone sensors on Chrome Android. Confidence: HIGH for API shape/HTTPS/visibility; MEDIUM for 60 Hz cap (2016-era commit, not re-verified on current Chrome); NOT FOUND for hardware-specific achievable rates and Chrome-Android screen-off behaviour (inferred from spec).
### Sources (fetched)
- MDN Sensor APIs: https://developer.mozilla.org/en-US/docs/Web/API/Sensor_APIs
- Chrome for Developers "Sensors for the web": https://developer.chrome.com/docs/capabilities/web-apis/generic-sensor
- W3C Generic Sensor spec https://w3c.github.io/sensors/ (sections 4.2.3 Focused Area, 4.2.4 Visibility State, 4.3.1 Limit maximum sampling frequency)
- W3C Accelerometer spec https://w3c.github.io/accelerometer/ (LinearAccelerationSensor, quantization/throttling security note)
- MDN devicemotion event; MDN Screen Wake Lock API https://developer.mozilla.org/en-US/docs/Web/API/Screen_Wake_Lock_API
### Facts + verbatim
1. API choice: LinearAccelerationSensor = "acceleration applied to the device along all three axes, but without the contribution of gravity" (MDN). Accelerometer includes gravity. Permission/policy name for both: 'accelerometer'. Chrome doc list of motion sensors: Accelerometer, Gyroscope, LinearAccelerationSensor, AbsoluteOrientationSensor, RelativeOrientationSensor, GravitySensor. W3C accelerometer spec example: `let sensor = new LinearAccelerationSensor({frequency: 60});`
2. Frequency: "Reading frequency is decided by you ... a number that specifies the number of readings per second ... The actual reading frequency depends on device hardware and consequently may be less than requested." (MDN). Chromium commit "[Sensors] Allow Sensor API only on secure top-level browsing contexts and add frequency checks" (https://chromium.googlesource.com/chromium/src/+/febb0c97b0e7a59fbd1e3ca9bbf00759e684d4b0^): requested frequencies above 60 Hz are capped to 60 Hz; negative throws; a W3C issue (w3c/sensors#367) quotes the runtime error 'Maximum allowed frequency value for this sensor type is 60 Hz.' Another Chromium change: DeviceMotion code requests 60 Hz but clamps to the platform max. => plan for <=60 Hz, i.e. Nyquist 30 Hz; fine for construction vibration envelope/PGV-ish features but NOT for broadband seismology. Real device rates vary (often 50-100 Hz raw but capped).
3. HTTPS: "Because Generic Sensor API is a powerful feature, the browser only allows it on secure contexts ... to use Generic Sensor API you'll need to access your page through HTTPS. During development ... http://localhost" (Chrome doc). MDN: "available only in secure contexts (HTTPS)".
4. Permission: "Sensor readings may not be taken unless the user grants permission to a specific sensor type using the Permissions API and/or if access is not blocked by the server Permissions-Policy." Check: `navigator.permissions.query({ name: "accelerometer" })` (MDN). Errors: NotAllowedError, NotReadableError, SecurityError (policy) at construction. Chrome Android does not show a prompt for motion sensors by default in the versions documented (permission state typically 'granted'); not verified -- test on target phone. (iOS DeviceMotionEvent.requestPermission is irrelevant for Chrome Android.)
5. Only main frame / same-origin subframes by default (Permissions Policy); cross-origin iframe needs `<iframe allow="accelerometer">`.
6. Background / lock screen: Chrome doc: "Sensor readings are only accessible by a visible web page, i.e., when the user is actually interacting with it." W3C 4.2.4: "Sensor readings are only available for the active documents whose visibility state is 'visible'." and 4.2.3 focus check. => When the screen locks or the tab is backgrounded, document.visibilityState becomes 'hidden' and readings STOP (inference from spec; Chrome Android-specific lock behaviour not separately documented). A PWA cannot sample in a service worker (sensors not exposed there; Chrome doc: Generic Sensor "opens future opportunities for ... service workers" i.e. not yet). => Product implication: phone must stay awake, foreground, screen on, ideally plugged in. 
7. Screen Wake Lock: `navigator.wakeLock.request("screen")` -- "prevents the screen from turning off, dimming or locking"; secure context only; Permissions Policy `screen-wake-lock` default allowlist self; released automatically when the document becomes inactive/hidden so re-acquire on visibilitychange; can be rejected for "power save mode, low battery, or a document that is not active or visible". MDN: "Baseline 2025. Newly available. Since March 2025 ... works across the latest devices and browser versions." Snippet (MDN verbatim):
```js
let wakeLock = null;
try { wakeLock = await navigator.wakeLock.request("screen"); } catch (err) { console.error(`${err.name}, ${err.message}`); }
wakeLock.addEventListener("release", () => { console.log("Wake Lock has been released"); });
document.addEventListener("visibilitychange", async () => {
  if (wakeLock !== null && document.visibilityState === "visible") { wakeLock = await navigator.wakeLock.request("screen"); }
});
```
8. Security-driven degradation: W3C accelerometer spec has a reading quantization/throttling mitigation (browser may reduce precision). Don't expect micro-g resolution; calibrate by comparison to a reference during the demo.
9. DeviceMotionEvent fallback: `window.addEventListener('devicemotion', e => e.acceleration / e.accelerationIncludingGravity / e.interval)`; secure context only (MDN); Chromium implements it on top of the same sensors at 60 Hz clamped to platform max. Use as fallback if LinearAccelerationSensor construction throws.
Working snippet (assembled from the docs above; untested on device):
```js
async function startSensor(onSample) {
  try { await navigator.wakeLock?.request('screen') } catch {}
  const s = new LinearAccelerationSensor({ frequency: 60 })
  s.addEventListener('reading', () => onSample({ t: performance.timeOrigin + performance.now(), x: s.x, y: s.y, z: s.z }))
  s.addEventListener('error', e => console.warn(e.error.name))
  s.start(); return s
}
```
### Unknowns / test-on-device list
- Actual achievable Hz on the specific Android phones; whether Chrome Android prompts for motion-sensors permission; whether 'reading' timestamps are monotonic (use s.timestamp); behaviour when Android Doze/battery saver kicks in with screen on; whether Chrome throttles rAF/timers in an installed PWA when the screen is on but dimmed (wake lock keeps it from dimming).
- Chrome Android release notes for sensor frequency cap changes after 2016 not checked.

## Sources fetched / blocked / tools used
Fetched OK: MDN Sensor_APIs (WebFetch), MDN Screen_Wake_Lock_API (WebFetch + curl), MDN devicemotion_event (curl), developer.chrome.com generic-sensor (curl), W3C sensors + accelerometer specs (curl), WebSearch for the 60 Hz commit/issue.
Not found: official statement for Chrome Android on locked-screen behaviour (inferred); browser-compat table contents (JS-rendered).
Tools: curl, WebFetch, WebSearch.
