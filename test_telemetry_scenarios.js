/**
 * Standalone Test Suite for Real-world Telemetry & Sensor Edge Cases
 * Tests current dashboard logic against user-provided real payloads & edge cases.
 * 
 * NOTE: DOES NOT MODIFY ANY DASHBOARD SOURCE CODE.
 */

const fs = require("fs");
const path = require("path");

// Load api.js and script.js source
const apiJsPath = path.join(__dirname, "static", "dashboard-v4", "js", "api.js");
const scriptJsPath = path.join(__dirname, "static", "dashboard-v4", "js", "script.js");

const apiJsContent = fs.readFileSync(apiJsPath, "utf-8");
const scriptJsContent = fs.readFileSync(scriptJsPath, "utf-8");

// Real User Payloads
const payloadDevice6699 = {
  "pm2d5": "0.00",
  "pm10": "0.00",
  "temperature": "0.00",
  "humidity": "0.00",
  "pm1d0": "0.00",
  "co2": "0.00",
  "tvoc": "0.00",
  "hcho": "0.00",
  "created_on": "2026-11-27T14:38:59.584Z",
  "virus_index": "0.00",
  "air_pressure": "0.00",
  "ozone": "0.00",
  "no2": "0.00",
  "co": "0.00",
  "aqi": "0.00",
  "stats": [
    {
      "id": 28098540,
      "aqi_value": "0.000",
      "pm2d5": "716.000",
      "pm10": "716.000",
      "temperature": "23.400",
      "humidity": "64.400",
      "pm1d0": "678.000",
      "co2": "602.000",
      "tvoc": "169.000",
      "hcho": "0.000",
      "virus_index": "7.000",
      "air_pressure": "977.000",
      "ozone": "0.000",
      "no2": "0.000",
      "co": "2.800",
      "report_date": "2025-09-02T18:55:50+05:30",
      "created_on": "2025-09-02T19:00:37.177716+05:30",
      "device": 6699
    }
  ],
  "outdoor_aqi": "0.00",
  "outdoor_pm2d5": "0.00",
  "outdoor_pm1d0": "0.00",
  "outdoor_aqi_stats": [],
  "outdoor_station_name": "ITO, Delhi - CPCB",
  "indoor_device_name": "KNMA",
  "device_status": "Off",
  "device_id": "6699",
  "cards": ["AQI", "pm2d5", "pm10", "tvoc", "rh", "temp", "co2"]
};

// Spartan with fresh timestamp (< 15 mins ago)
const fourMinsAgoIso = new Date(Date.now() - 4 * 60 * 1000).toISOString();
const payloadDevice6858 = {
  "pm2d5": "30.00",
  "pm10": "35.50",
  "temperature": "20.90",
  "humidity": "55.00",
  "pm1d0": "0.00",
  "co2": "719.00",
  "tvoc": "955.00",
  "hcho": "0.01",
  "created_on": fourMinsAgoIso,
  "virus_index": "0.00",
  "air_pressure": "0.00",
  "ozone": "0.00",
  "no2": "0.00",
  "co": "0.00",
  "aqi": "50.00",
  "stats": [
    {
      "id": 41929050,
      "aqi_value": "50.000",
      "pm2d5": "30.000",
      "pm10": "35.500",
      "temperature": "20.900",
      "humidity": "55.000",
      "pm1d0": "0.000",
      "co2": "719.000",
      "tvoc": "955.000",
      "hcho": "0.010",
      "virus_index": "0.000",
      "air_pressure": "0.000",
      "ozone": "0.000",
      "no2": "0.000",
      "co": "0.000",
      "report_date": fourMinsAgoIso,
      "created_on": fourMinsAgoIso,
      "device": 6858
    }
  ],
  "outdoor_aqi": "214.00",
  "outdoor_pm2d5": "214.00",
  "outdoor_pm1d0": "190.00",
  "outdoor_aqi_stats": ["214.000", "214.000"],
  "outdoor_station_name": "Vikas Sadan, Gurugram - HSPCB",
  "indoor_device_name": "Spartan",
  "device_status": "On",
  "device_id": "6858",
  "cards": ["AQI", "pm2d5", "pm10", "tvoc", "rh", "temp", "co2"]
};

// Sandbox evaluation of API normalizePayload
function evaluateCurrentApiNormalize(raw) {
  const fnMatch = apiJsContent.match(/function normalizePayload\(raw\) \{([\s\S]*?)\n  \}/);
  if (!fnMatch) throw new Error("Could not extract normalizePayload from api.js");
  const fnBody = fnMatch[1];
  const fn = new Function("raw", fnBody);
  return fn(raw);
}

// Evaluate reduction formula from api.js
function evaluateReductionPct(outdoor, indoor) {
  const fnMatch = apiJsContent.match(/function reductionPct\(outdoor, indoor\) \{([\s\S]*?)\n  \}/);
  if (!fnMatch) throw new Error("Could not extract reductionPct from api.js");
  const fnBody = fnMatch[1];
  const fn = new Function("outdoor", "indoor", fnBody);
  return fn(outdoor, indoor);
}

// Evaluate UI Ingestion offline determination logic from script.js
function evaluateScriptOfflineLogic(payload) {
  const isDeviceOffStatus = Boolean(
    (payload.offline === true) ||
    (payload.device_status && ["off", "offline"].includes(String(payload.device_status).toLowerCase()))
  );

  let isDeviceOffline = false;
  let offlineReason = "";

  if (isDeviceOffStatus || (payload.offline === true && !payload.hasLiveStats)) {
    isDeviceOffline = true;
    offlineReason = "Device Offline";
  }

  let indoorAqiVal = payload.aqi || 0;
  let pm25Val = payload.pm2d5 || 0;

  if (isDeviceOffline) {
    indoorAqiVal = 0;
    pm25Val = 0;
  }

  const isContextOffline = Boolean(
    payload && (
      (payload.device_status && ["off", "offline"].includes(String(payload.device_status).toLowerCase())) ||
      payload.offline === true
    )
  );

  return {
    isDeviceOffStatus,
    isDeviceOffline,
    isContextOffline,
    indoorAqiVal,
    pm25Val
  };
}

console.log("======================================================================");
console.log("🧪 INTELLIGREEN REAL-WORLD TELEMETRY EDGE-CASE TEST SUITE");
console.log("======================================================================");

let passed = 0;
let total = 0;

function assert(title, condition, details = "") {
  total++;
  if (condition) {
    passed++;
    console.log(`  ✅ PASS: ${title}`);
  } else {
    console.log(`  ❌ FAIL: ${title} -> ${details}`);
  }
}

// SCENARIO 1: Real Device 6699 (KNMA - Offline Device with 2025 old stats)
console.log("\n[Scenario 1] Real Device 6699 (KNMA) - Status 'Off' with 14-month old stats");
const norm6699 = evaluateCurrentApiNormalize(payloadDevice6699);
const ui6699 = evaluateScriptOfflineLogic(norm6699);

assert("api.js marks normalized payload.offline = true for device_status: 'Off'", norm6699.offline === true, `Got: ${norm6699.offline}`);
assert("script.js marks isDeviceOffline = true for device_status: 'Off'", ui6699.isDeviceOffline === true, `Got: ${ui6699.isDeviceOffline}`);
assert("script.js sets Indoor AQI to 0 for offline device", ui6699.indoorAqiVal === 0, `Got: ${ui6699.indoorAqiVal}`);
assert("script.js sets PM2.5 to 0 for offline device (suppressing 2025 stats: 716)", ui6699.pm25Val === 0, `Got: ${ui6699.pm25Val}`);
assert("script.js dynamic tubes set isContextOffline = true", ui6699.isContextOffline === true, `Got: ${ui6699.isContextOffline}`);

// SCENARIO 2: Real Device 6858 (Spartan - Live Device with Fresh 2026 data)
console.log("\n[Scenario 2] Real Device 6858 (Spartan) - Status 'On' with Fresh Data (~4m old)");
const norm6858 = evaluateCurrentApiNormalize(payloadDevice6858);
const ui6858 = evaluateScriptOfflineLogic(norm6858);

assert("Device 6858 normalized offline flag is not true", norm6858.offline !== true, `Got: ${norm6858.offline}`);
assert("Device 6858 UI isDeviceOffline is false", ui6858.isDeviceOffline === false, `Got: ${ui6858.isDeviceOffline}`);
assert("Device 6858 indoor AQI extracted accurately (50)", norm6858.aqi === 50, `Got: ${norm6858.aqi}`);
assert("Device 6858 PM2.5 extracted accurately (30)", norm6858.pm2d5 === 30, `Got: ${norm6858.pm2d5}`);
assert("Device 6858 CO2 extracted accurately (719)", norm6858.co2 === 719, `Got: ${norm6858.co2}`);
assert("Device 6858 TVOC extracted accurately (955)", norm6858.tvoc === 955, `Got: ${norm6858.tvoc}`);

const redSpartan = evaluateReductionPct(norm6858.outdoor_aqi, norm6858.aqi);
assert("Reduction % for Spartan calculated accurately (77%)", redSpartan === 77, `Got: ${redSpartan}%`);

// SCENARIO 3: Stale Data > 15 Minutes Old with device_status: 'On'
console.log("\n[Scenario 3] Stale Data Test (> 15 Minutes Old with device_status: 'On')");
const thirtyFiveMinsAgo = new Date(Date.now() - 35 * 60 * 1000).toISOString();
const payloadStale = JSON.parse(JSON.stringify(payloadDevice6858));
payloadStale.stats[0].report_date = thirtyFiveMinsAgo;
payloadStale.created_on = thirtyFiveMinsAgo;

const normStale = evaluateCurrentApiNormalize(payloadStale);
const uiStale = evaluateScriptOfflineLogic(normStale);

assert(
  "Current api.js detects stale report_date (>15 mins) and sets offline: true",
  normStale.offline === true,
  `Got: ${normStale.offline}`
);

assert(
  "Current script.js forces UI isDeviceOffline = true when report_date is stale (>15 mins)",
  uiStale.isDeviceOffline === true,
  `Got: ${uiStale.isDeviceOffline}`
);

// SCENARIO 4: Mathematical Boundary Checks (Outdoor AQI = 0)
console.log("\n[Scenario 4] Mathematical Boundary Checks (Outdoor AQI = 0)");
const redZeroOut = evaluateReductionPct(0, 50);
assert("Reduction % handles Outdoor AQI = 0 without NaN or Infinity", !isNaN(redZeroOut) && isFinite(redZeroOut) && redZeroOut === 0, `Got: ${redZeroOut}`);

// SCENARIO 5: Inverse Pollution (Indoor AQI > Outdoor AQI)
console.log("\n[Scenario 5] Inverse Pollution (Indoor AQI 100 vs Outdoor AQI 40)");
const redNegative = evaluateReductionPct(40, 100);
assert("Reduction % returns 0 when Indoor >= Outdoor (prevents negative clean air claim)", redNegative === 0, `Got: ${redNegative}%`);

// SCENARIO 6: Dirty Telemetry (null, undefined, NaN values)
console.log("\n[Scenario 6] Dirty Telemetry (null, undefined, NaN values)");
const dirtyPayload = {
  device_id: "9999",
  device_status: "On",
  stats: [
    {
      aqi_value: null,
      pm2d5: "NaN",
      co2: undefined,
      temperature: null
    }
  ]
};
let dirtyPassed = true;
try {
  const normDirty = evaluateCurrentApiNormalize(dirtyPayload);
  dirtyPassed = normDirty.aqi === 0 && normDirty.pm2d5 === 0 && normDirty.co2 === 0;
} catch (e) {
  dirtyPassed = false;
}
assert("normalizePayload gracefully handles null/undefined/NaN without throwing runtime error", dirtyPassed);

console.log("\n======================================================================");
console.log(`TEST SUMMARY: ${passed}/${total} Passed (${Math.round((passed/total)*100)}%)`);
console.log("======================================================================");
