/**
 * IntelliGreen Clean Air Cockpit - DevTools Console Interactive Test Controller
 * 
 * Instructions:
 * 1. Open the dashboard in your browser (e.g. http://localhost:8000/ or http://192.168.1.10:8000/)
 * 2. Press F12 to open Browser Developer Tools -> Click on the "Console" tab.
 * 3. Copy-paste this entire file into the Console and press Enter.
 * 4. Run any command:
 *      CockpitTester.testOfflineKNMA()     - Test Offline KNMA (status Off, 2025 date)
 *      CockpitTester.testLiveSpartan()     - Test Live Spartan (status On, fresh data)
 *      CockpitTester.testStale(25)         - Test custom minutes old (e.g. 25m -> Offline)
 *      CockpitTester.testStale(8)          - Test custom minutes old (e.g. 8m -> Online)
 *      CockpitTester.testOutdoorZero()     - Test Outdoor AQI = 0 (hides reduction card)
 *      CockpitTester.testInverse()         - Test Indoor AQI > Outdoor (hides negative reduction)
 *      CockpitTester.runAll()              - Runs all tests step-by-step with live visual transitions!
 *      CockpitTester.resetLive()           - Resumes normal auto-sync from server
 */

(() => {
  window.isCockpitTestMode = true;

  const baseSpartan = {
    "pm2d5": "30.00",
    "pm10": "35.50",
    "temperature": "20.90",
    "humidity": "55.00",
    "pm1d0": "0.00",
    "co2": "719.00",
    "tvoc": "955.00",
    "hcho": "0.01",
    "created_on": new Date().toISOString(),
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
        "report_date": new Date(Date.now() - 4 * 60 * 1000).toISOString(),
        "created_on": new Date().toISOString(),
        "device": 6858
      }
    ],
    "outdoor_aqi": "214.00",
    "outdoor_pm2d5": "214.00",
    "outdoor_pm1d0": "190.00",
    "outdoor_station_name": "Vikas Sadan, Gurugram - HSPCB",
    "indoor_device_name": "Spartan",
    "device_status": "On",
    "device_id": "6858",
    "cards": ["AQI", "pm2d5", "pm10", "tvoc", "rh", "temp", "co2"]
  };

  const baseKNMA = {
    "pm2d5": "0.00",
    "pm10": "0.00",
    "temperature": "0.00",
    "humidity": "0.00",
    "pm1d0": "0.00",
    "co2": "0.00",
    "tvoc": "0.00",
    "hcho": "0.00",
    "created_on": new Date().toISOString(),
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
        "report_date": "2025-09-02T18:55:50+05:30",
        "created_on": "2025-09-02T19:00:37+05:30",
        "device": 6699
      }
    ],
    "outdoor_aqi": "0.00",
    "outdoor_pm2d5": "0.00",
    "outdoor_station_name": "ITO, Delhi - CPCB",
    "indoor_device_name": "KNMA",
    "device_status": "Off",
    "device_id": "6699",
    "cards": ["AQI", "pm2d5", "pm10", "tvoc", "rh", "temp", "co2"]
  };

  function sendToDashboard(payload, label) {
    console.group(`🧪 [Test Scenario] ${label}`);
    window.isCockpitTestMode = true;

    const normalized = typeof window.CockpitAPI !== "undefined" && typeof window.CockpitAPI.normalizePayload === "function"
      ? window.CockpitAPI.normalizePayload(payload)
      : payload;

    console.log("👉 Normalized Payload:", normalized);
    console.log(`⏱️ Report Timestamp: ${normalized.timestamp || 'N/A'}`);
    console.log(`🏷️ Device Status: ${normalized.device_status} | Offline Flag: ${Boolean(normalized.offline)}`);

    if (typeof window.ingestSensorPayload === "function") {
      window.ingestSensorPayload(normalized);
    } else {
      console.warn("window.ingestSensorPayload not found on window object.");
    }

    console.groupEnd();
  }

  window.CockpitTester = {
    testOfflineKNMA() {
      sendToDashboard(baseKNMA, "Device 6699 (KNMA) - Status 'Off' + 2025 Timestamp");
      console.log("%c✅ Expected: All tubes flattened to 8% gray, AQI 0, PM2.5 0 µg/m³ (Offline)", "color: #f59e0b; font-weight: bold;");
    },

    testLiveSpartan() {
      const freshSpartan = JSON.parse(JSON.stringify(baseSpartan));
      freshSpartan.stats[0].report_date = new Date(Date.now() - 3 * 60 * 1000).toISOString();
      sendToDashboard(freshSpartan, "Device 6858 (Spartan) - Status 'On' + Fresh 3-min old data");
      console.log("%c✅ Expected: AQI 50 (Good/Green), PM2.5 30, CO2 719, Reduction Pill ~77%", "color: #10b981; font-weight: bold;");
    },

    testStale(minutesAgo = 25) {
      const staleSpartan = JSON.parse(JSON.stringify(baseSpartan));
      const targetTime = new Date(Date.now() - minutesAgo * 60 * 1000).toISOString();
      staleSpartan.stats[0].report_date = targetTime;
      staleSpartan.created_on = targetTime;

      const isOver15 = minutesAgo > 15;
      sendToDashboard(staleSpartan, `Device 6858 (Spartan) with data from ${minutesAgo} minutes ago`);
      if (isOver15) {
        console.log(`%c✅ Expected: Time diff > 15m (${minutesAgo} mins). Dashboard MUST switch to OFFLINE (0 values, gray tubes).`, "color: #ef4444; font-weight: bold;");
      } else {
        console.log(`%c✅ Expected: Time diff <= 15m (${minutesAgo} mins). Dashboard stays LIVE & ACTIVE.`, "color: #10b981; font-weight: bold;");
      }
    },

    testOutdoorZero() {
      const zeroOut = JSON.parse(JSON.stringify(baseSpartan));
      zeroOut.stats[0].report_date = new Date(Date.now() - 2 * 60 * 1000).toISOString();
      zeroOut.outdoor_aqi = "0.00";
      zeroOut.outdoor_pm2d5 = "0.00";
      sendToDashboard(zeroOut, "Outdoor AQI = 0 (Testing division-by-zero protection)");
      console.log("%c✅ Expected: Reduction card disappears cleanly, Outdoor AQI 0, NO NaN/Infinity.", "color: #38bdf8; font-weight: bold;");
    },

    testInverse() {
      const inv = JSON.parse(JSON.stringify(baseSpartan));
      inv.stats[0].report_date = new Date(Date.now() - 2 * 60 * 1000).toISOString();
      inv.stats[0].aqi_value = "120.000";
      inv.outdoor_aqi = "45.00";
      sendToDashboard(inv, "Inverse Pollution: Indoor AQI 120 > Outdoor AQI 45");
      console.log("%c✅ Expected: Reduction card hidden (no negative clean air claims).", "color: #a855f7; font-weight: bold;");
    },

    async runAll() {
      console.log("%c🚀 Starting Automated Live Visual Test Walkthrough (3 seconds per scenario)...", "color: #38bdf8; font-weight: bold; font-size: 14px;");
      
      this.testLiveSpartan();
      await new Promise(r => setTimeout(r, 3500));

      this.testStale(20);
      await new Promise(r => setTimeout(r, 3500));

      this.testOfflineKNMA();
      await new Promise(r => setTimeout(r, 3500));

      this.testOutdoorZero();
      await new Promise(r => setTimeout(r, 3500));

      this.testInverse();
      await new Promise(r => setTimeout(r, 3500));

      this.testLiveSpartan();
      console.log("%c🎉 Walkthrough Complete! All scenarios verified visually.", "color: #10b981; font-weight: bold; font-size: 14px;");
    },

    resetLive() {
      window.isCockpitTestMode = false;
      console.log("%c🔄 Test Mode Deactivated. Resuming automatic real-time server polling...", "color: #10b981; font-weight: bold;");
      if (typeof window.CockpitAPI !== "undefined" && typeof window.CockpitAPI.syncEngine === "function") {
        window.CockpitAPI.syncEngine(true);
      }
    }
  };

  console.clear();
  console.log("%c======================================================================", "color: #10b981; font-weight: bold;");
  console.log("%c🎛️ INTELLIGREEN COCKPIT CONSOLE TEST CONTROLLER READY!", "color: #10b981; font-weight: bold; font-size: 14px;");
  console.log("%c======================================================================", "color: #10b981; font-weight: bold;");
  console.log("%cCommands you can run right here in the console:", "color: #e2e8f0; font-weight: bold;");
  console.log("  👉 CockpitTester.testLiveSpartan()   -- Live fresh data (AQI 50, 77% clean air)");
  console.log("  👉 CockpitTester.testOfflineKNMA()   -- Offline device (0 values, gray bars)");
  console.log("  👉 CockpitTester.testStale(25)       -- Stale test: 25 mins old (switches to Offline)");
  console.log("  👉 CockpitTester.testStale(8)        -- Fresh test: 8 mins old (stays Online)");
  console.log("  👉 CockpitTester.testOutdoorZero()   -- Outdoor AQI = 0 (hides reduction box)");
  console.log("  👉 CockpitTester.testInverse()       -- Indoor > Outdoor (safe hiding)");
  console.log("  👉 CockpitTester.runAll()            -- Automatically runs all 5 tests with live transitions!");
  console.log("  👉 CockpitTester.resetLive()         -- Restores live server polling");
  console.log("%c======================================================================", "color: #10b981; font-weight: bold;");
})();
