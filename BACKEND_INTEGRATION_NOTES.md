# IntelliGreen Clean Air Cockpit — Backend Integration & UI Adaptation Notes
**Version**: 4.2 Corporate  
**Target Environments**: Smart TVs (Samsung Tizen 5.0–7.0 / Chromium 69–79, LG webOS), Laptops, Tablets, and Smartphones.

---

## 1. Executive Summary
This package contains the complete, production-ready frontend template and static asset bundle for the **IntelliGreen Clean Air Cockpit**. All files are structured according to standard Django application layouts:
- `templates/dashboard-v4/` (`base.html`, `index.html`)
- `static/dashboard-v4/` (`css/style.css`, `js/api.js`, `js/script.js`, `js/jquery-3.3.1.min.js`, `assets/`)

### Modular JavaScript Architecture:
- **`api.js` (Data & Networking Layer)**: Manages CPCB / EPA parameter registries and thresholds, real-time 25-second telemetry synchronization (`/get-real-time-data/<id>/`), Open-Meteo & reverse geocoding weather services (`WeatherService`), WebSocket handlers, and race-condition request cancellation (`AbortController`).
- **`script.js` (UI Presentation Layer)**: Manages DOM rendering, tube charts, theme switching (Dark/Light), layout adaptations (Single Monitor Sprout/Bulb vs multi-monitor list), drawer controls, and Smart TV responsive scaling.

Zero testing docks, test sliders, revoked diagnostics tables, or debug mock bars exist in this deliverable. It is 100% clean production code ready for backend deployment.

---

## 2. Smart TV Adaptation & Browser Compatibility (Tizen / webOS)
Older Smart TV browsers (notably Samsung Tizen 5.0–6.5 running Chromium 69–79) have strict limitations that will break modern CSS3 and ES2020+ JavaScript. The following architectural adaptations have been implemented and validated:

### A. CSS Audit & Hardening
1. **Flexbox `gap` Eliminated**:
   - Chromium < 84 does not support `gap` inside `display: flex`.
   - All flex containers now use margin spacing (`margin-right`, `margin-bottom` on children), guaranteeing layout integrity across older TVs.
2. **`grid-gap` Fallback**:
   - Display grid containers retain explicit `grid-gap` fallbacks alongside `gap`.
3. **No CSS `inset`**:
   - Modern `inset: 0` shorthand has been replaced with explicit `top: 0; right: 0; bottom: 0; left: 0;`.
4. **No CSS `aspect-ratio`**:
   - Replaced with explicit `rem`-based proportional dimensions (`width` and `height`).
5. **Color & Math Function Safety**:
   - Zero modern color functions (`oklch()`, `color-mix()`, `:has()`, `@layer`, space-separated `rgb(r g b / a)`). Standard HEX and `rgba(r, g, b, a)` are used exclusively.
6. **Backdrop Filter Support**:
   - Added `-webkit-backdrop-filter` alongside `backdrop-filter`, with solid/rgba fallback backgrounds on all cards.

### B. JavaScript Engine Safety
1. **Zero Optional Chaining (`?.`)**:
   - Replaced with standard null/undefined checks (`if (obj && obj.prop)`) so older TV JavaScript engines do not throw syntax errors that halt dashboard execution.
2. **Zero Nullish Coalescing (`??`)**:
   - Replaced with explicit falsy / null checks (`val != null ? val : fallback`).
3. **Zero `String.prototype.replaceAll()` or `Array.prototype.at()`**:
   - Replaced with standard regex `.replace(/.../g, ...)` and array indexing `[arr.length - 1]`.

---

## 3. Responsive Scaling & Visual Polish
1. **Brand Identity**:
   - Company logo increased to `4.5rem` on TV/desktop and `2.85rem` on mobile.
   - Navigation drawer icons increased to `26px` SVG stroke and `44px` brand emblem.
2. **Card Row Heights & Topbar Spacing**:
   - Card rows reduced to `17.5rem` (from `20rem`) and top margin increased to `1.6rem` to prevent vertical overcrowding on 1080p and 4K TV displays.
3. **Sleek Test Tube Sizing (Panel 3)**:
   - Air parameter tracks (`.corporate-bar-track`) updated to `max-width: 1.6rem;` and `height: 6.75rem;` (decreased from previous `2.75rem` / `2.15rem`). This provides an elegant, proportionate test-tube aesthetic and cleanly accommodates up to 10 dynamic air elements without horizontal overflow or overcrowding.
4. **Active Monitors in Dark Mode**:
   - Device site names render in crisp `#f8fafc` white in Dark Mode for high contrast and legibility from a distance.

---

## 4. Sprout Mascot & Eco Bulb Loop (Single Active Monitor)
When only a single active monitor is present (`totalCount <= 1`), Panel 4 ("Active Monitors") displays an animated alternating sustainability character loop:
* **Sprout Mascot** (`leaf_mascot.png`): Cheerful clean air sprout character with floating breeze particles & emerald glow.
* **Eco Sustainability Bulb** (`eco_bulb_clean.png`): Green eco globe bulb highlighting carbon consciousness and environmental wellness.
* **Behavior**: Automatically loops between characters every 6 seconds, and toggles on click.
* When 2 or more devices are active, the mascot container gracefully collapses (`display: none`) and the full scrollable device list appears automatically.

---

## 5. Dynamic Air Quality & Race-Condition Safeguards
1. **Indoor AQI vs PM2.5 Dynamic Display (Controlled via `cards` parameter)**:
   - If the `cards` parameter array returned by the API (or template context) does **not** contain `"AQI"`, Panel 1 dynamically switches to display **Indoor PM2.5** (value, condition label, and CPCB color coding) in place of Indoor AQI.
   - If `"AQI"` is present in `cards`, Panel 1 displays Indoor AQI normally.
   - Panel 3 (dynamic air element tubes) automatically renders the pollutant metrics (`pm2d5`, `pm10`, `co2`, `tvoc`, `rh`, `temp`, etc.) while cleanly excluding AQI from the test tubes bars.
2. **Pollution Reduction Box Safety**:
   - When Indoor AQI > Outdoor AQI (e.g., indoor pollution spike), the green "Reduction %" pill automatically hides to prevent showing negative or nonsensical reduction claims.
3. **Offline Monitor Status**:
   - When a device is offline (`dev.offline === true`), all test tubes and metrics immediately zero out (`0`), and the status dot displays neutral grey.
4. **Race-Condition & Stale Data Prevention**:
   - **Abort In-Flight Requests**: When the user clicks a device, `selectDevice()` invokes `window.getRealTimeData(true)` which aborts any in-flight `fetch` via `AbortController`.
   - **Target ID Verification**: Responses are checked against `targetId === activeNow` before updating the UI, preventing device A's delayed response from overwriting device B's data.
   - **Chained Sync Timer**: Polling uses chained `setTimeout` (`scheduleNextSync`) rather than `setInterval`, ensuring network latency never causes requests to stack.

---

## 6. Backend Integration Checklist
- [x] Copy `templates/dashboard-v4/base.html` and `index.html` to your Django `templates/` directory.
- [x] Copy `static/dashboard-v4/` to your Django `static/` directory.
- [x] Run `python manage.py collectstatic`.
- [x] Verify that the real-time endpoint `/get-real-time-data/<device_id>/` returns JSON with standard keys (`aqi`, `pm2d5`, `pm10`, `co2`, `tvoc`, `temp`, `rh`, `outdoor_aqi`, `outdoor_pm2_5`, etc.).
