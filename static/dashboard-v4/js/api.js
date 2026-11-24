/**
 * IntelliGreen Clean Air Cockpit - API & Telemetry Data Services
 * Dedicated Network, API Integration, and Data Synchronization Layer
 *
 * Responsibilities:
 *  - CPCB / EPA Parameter Threshold Registry & Validations
 *  - Continuous 25-Second Telemetry Synchronization Engine (/get-real-time-data/<id>/)
 *  - Public Weather & Wind Conditions API Service (Open-Meteo & Reverse Geocoding)
 *  - Real-Time Polling & WebSocket Handlers
 *  - Asynchronous Request Lifecycle with AbortController & Race-Condition Safeguards
 */

(function (window, document) {
  "use strict";

  // =========================================================================
  // 1. Parameter Thresholds & Validation Engine (CPCB & Scientific Registry)
  // =========================================================================
  const PARAM_REGISTRY = {
    pm2d5: {
      name: "PM2.5",
      title: "PM2.5",
      unit: "µg/m³",
      scaleMax: 300,
      thresholds: [
        { max: 30, color: "#10b981", label: "Good" },
        { max: 60, color: "#22c55e", label: "Satisfactory" },
        { max: 90, color: "#f59e0b", label: "Moderate" },
        { max: 120, color: "#f97316", label: "Poor" },
        { max: 250, color: "#ef4444", label: "Very Poor" },
        { max: Infinity, color: "#be123c", label: "Severe" }
      ]
    },
    pm10: {
      name: "PM10",
      title: "PM10",
      unit: "µg/m³",
      scaleMax: 500,
      thresholds: [
        { max: 50, color: "#10b981", label: "Good" },
        { max: 100, color: "#22c55e", label: "Satisfactory" },
        { max: 250, color: "#f59e0b", label: "Moderate" },
        { max: 350, color: "#f97316", label: "Poor" },
        { max: 430, color: "#ef4444", label: "Very Poor" },
        { max: Infinity, color: "#be123c", label: "Severe" }
      ]
    },
    co2: {
      name: "CO₂",
      title: "Carbon Dioxide",
      unit: "ppm",
      scaleMax: 2000,
      thresholds: [
        { max: 600, color: "#10b981", label: "Excellent" },
        { max: 1000, color: "#22c55e", label: "Good" },
        { max: 1500, color: "#f59e0b", label: "Moderate" },
        { max: Infinity, color: "#ef4444", label: "High" }
      ]
    },
    tvoc: {
      name: "TVOC",
      title: "Total Volatile Organics",
      unit: "ppb",
      scaleMax: 3000,
      thresholds: [
        { max: 220, color: "#10b981", label: "Good" },
        { max: 660, color: "#22c55e", label: "Moderate" },
        { max: 2200, color: "#f59e0b", label: "Poor" },
        { max: Infinity, color: "#ef4444", label: "Severe" }
      ]
    },
    temp: {
      name: "Temperature",
      title: "Temperature",
      unit: "°C",
      scaleMax: 50,
      thresholds: [
        { max: 18, color: "#38bdf8", label: "Cool" },
        { max: 26, color: "#10b981", label: "Comfortable" },
        { max: 32, color: "#f59e0b", label: "Warm" },
        { max: Infinity, color: "#ef4444", label: "Hot" }
      ]
    },
    rh: {
      name: "Humidity",
      title: "Relative Humidity",
      unit: "%",
      scaleMax: 100,
      thresholds: [
        { max: 30, color: "#f59e0b", label: "Dry" },
        { max: 60, color: "#10b981", label: "Optimal" },
        { max: 70, color: "#22c55e", label: "Humid" },
        { max: Infinity, color: "#38bdf8", label: "High" }
      ]
    },
    hcho: {
      name: "HCHO",
      title: "Formaldehyde",
      unit: "mg/m³",
      scaleMax: 0.5,
      thresholds: [
        { max: 0.08, color: "#10b981", label: "Safe" },
        { max: 0.1, color: "#22c55e", label: "Acceptable" },
        { max: 0.3, color: "#f59e0b", label: "Elevated" },
        { max: Infinity, color: "#ef4444", label: "Hazardous" }
      ]
    },
    co: {
      name: "CO",
      title: "Carbon Monoxide",
      unit: "ppm",
      scaleMax: 20,
      thresholds: [
        { max: 2, color: "#10b981", label: "Good" },
        { max: 9, color: "#22c55e", label: "Moderate" },
        { max: 15, color: "#f59e0b", label: "Unhealthy" },
        { max: Infinity, color: "#ef4444", label: "Hazardous" }
      ]
    },
    ozone: {
      name: "Ozone",
      title: "Ground-level Ozone (O₃)",
      unit: "ppb",
      scaleMax: 200,
      thresholds: [
        { max: 50, color: "#10b981", label: "Good" },
        { max: 100, color: "#22c55e", label: "Moderate" },
        { max: 168, color: "#f59e0b", label: "Unhealthy" },
        { max: Infinity, color: "#ef4444", label: "Very Unhealthy" }
      ]
    },
    no2: {
      name: "NO₂",
      title: "Nitrogen Dioxide",
      unit: "ppb",
      scaleMax: 200,
      thresholds: [
        { max: 40, color: "#10b981", label: "Good" },
        { max: 80, color: "#22c55e", label: "Moderate" },
        { max: 180, color: "#f59e0b", label: "Poor" },
        { max: Infinity, color: "#ef4444", label: "Severe" }
      ]
    },
    so2: {
      name: "SO₂",
      title: "Sulfur Dioxide",
      unit: "ppb",
      scaleMax: 200,
      thresholds: [
        { max: 40, color: "#10b981", label: "Good" },
        { max: 80, color: "#22c55e", label: "Moderate" },
        { max: 380, color: "#f59e0b", label: "Poor" },
        { max: Infinity, color: "#ef4444", label: "Severe" }
      ]
    },
    air_pressure: {
      name: "Pressure",
      title: "Barometric Pressure",
      unit: "hPa",
      scaleMax: 1100,
      thresholds: [
        { max: 1000, color: "#38bdf8", label: "Low" },
        { max: 1020, color: "#10b981", label: "Normal" },
        { max: Infinity, color: "#f59e0b", label: "High" }
      ]
    },
    virus_index: {
      name: "Virus Risk",
      title: "Airborne Virus Transmission Index",
      unit: "/10",
      scaleMax: 10,
      thresholds: [
        { max: 3, color: "#10b981", label: "Low" },
        { max: 6, color: "#f59e0b", label: "Medium" },
        { max: Infinity, color: "#ef4444", label: "High" }
      ]
    },
    noise: {
      name: "Sound",
      title: "Ambient Sound Level",
      unit: "dB",
      scaleMax: 120,
      thresholds: [
        { max: 50, color: "#10b981", label: "Quiet" },
        { max: 70, color: "#22c55e", label: "Moderate" },
        { max: 85, color: "#f59e0b", label: "Loud" },
        { max: Infinity, color: "#ef4444", label: "Very Loud" }
      ]
    },
    light: {
      name: "Light",
      title: "Ambient Illuminance",
      unit: "lux",
      scaleMax: 1000,
      thresholds: [
        { max: 200, color: "#38bdf8", label: "Dim" },
        { max: 500, color: "#10b981", label: "Optimal Office" },
        { max: Infinity, color: "#f59e0b", label: "Bright" }
      ]
    }
  };

  function validateParam(paramType, value) {
    if (value === null || value === undefined || isNaN(value)) {
      return { isValid: false, normalizedValue: 0, reason: "Missing or non-numeric" };
    }
    const num = parseFloat(value);
    const reg = PARAM_REGISTRY[paramType];
    const maxVal = reg ? reg.scaleMax * 2 : 10000;
    if (num < 0 || num > maxVal) {
      return { isValid: false, normalizedValue: Math.max(0, num), reason: "Out of range" };
    }
    return { isValid: true, normalizedValue: num };
  }

  function resolveParamKey(raw) {
    if (!raw) return "pm2d5";
    const k = String(raw).toLowerCase().trim().replace(/[\s\-_.]/g, "");
    if (k === "pm25" || k === "pm2d5") return "pm2d5";
    if (k === "pm10") return "pm10";
    if (k === "co2") return "co2";
    if (k === "tvoc" || k === "voc") return "tvoc";
    if (k === "humidity" || k === "rh") return "rh";
    if (k === "temperature" || k === "temp") return "temp";
    if (k === "hcho" || k === "formaldehyde") return "hcho";
    if (k === "co" || k === "carbonmonoxide") return "co";
    if (k === "ozone" || k === "o3") return "ozone";
    if (k === "no2") return "no2";
    if (k === "so2") return "so2";
    if (k === "pressure" || k === "airpressure") return "air_pressure";
    if (k === "virus" || k === "virusindex") return "virus_index";
    if (k === "noise" || k === "sound") return "noise";
    if (k === "light" || k === "lux") return "light";
    return k;
  }

  function predictPm25FromAqi(aqi) {
    if (typeof aqi !== "number" || isNaN(aqi) || aqi <= 0) return 0;
    if (aqi <= 50) return Math.round((aqi / 50) * 30 * 10) / 10;
    if (aqi <= 100) return Math.round((30 + ((aqi - 50) / 50) * 30) * 10) / 10;
    if (aqi <= 200) return Math.round((60 + ((aqi - 100) / 100) * 30) * 10) / 10;
    if (aqi <= 300) return Math.round((90 + ((aqi - 200) / 100) * 30) * 10) / 10;
    if (aqi <= 400) return Math.round((120 + ((aqi - 300) / 100) * 130) * 10) / 10;
    return Math.round((250 + ((aqi - 400) / 100) * 150) * 10) / 10;
  }

  function reductionPct(outdoor, indoor) {
    if (!outdoor || outdoor <= 0 || !indoor || indoor < 0) return 0;
    if (indoor >= outdoor) return 0;
    return Math.round(((outdoor - indoor) / outdoor) * 100);
  }

  // =========================================================================
  // 1b. Schema Normalization & Direct Telemetry Extractor
  // =========================================================================
  /**
   * Normalizes raw API response into standardized dashboard metrics.
   * Directly extracts latest telemetry from `stats[0]` without convoluted fallback chains.
   *
   * Real Backend Schema:
   *  - Root: device_id, indoor_device_name, outdoor_station_name, outdoor_aqi, outdoor_pm2d5, cards, stats: [...]
   *  - stats[0]: aqi_value, pm2d5, pm10, temperature, humidity, co2, tvoc, hcho, etc.
   */
  function normalizePayload(raw) {
    if (!raw || typeof raw !== "object") return raw;

    const p = { ...raw };
    const latestStat = Array.isArray(p.stats) && p.stats.length > 0 ? p.stats[0] : null;

    function pickFloat(statKey, rootKey, fallback = 0) {
      if (latestStat && latestStat[statKey] !== undefined && latestStat[statKey] !== null && latestStat[statKey] !== "") {
        const v = parseFloat(latestStat[statKey]);
        if (!isNaN(v)) return v;
      }
      if (p[rootKey] !== undefined && p[rootKey] !== null && p[rootKey] !== "") {
        const v = parseFloat(p[rootKey]);
        if (!isNaN(v)) return v;
      }
      return fallback;
    }

    if (latestStat) {
      p.aqi = pickFloat("aqi_value", "aqi");
      p.indoor_aqi = p.aqi;
      p.pm2d5 = pickFloat("pm2d5", "pm2d5");
      p.pm10 = pickFloat("pm10", "pm10");
      p.pm1d0 = pickFloat("pm1d0", "pm1d0");
      p.temp = pickFloat("temperature", "temp", pickFloat("temperature", "temperature"));
      p.temperature = p.temp;
      p.rh = pickFloat("humidity", "rh", pickFloat("humidity", "humidity"));
      p.humidity = p.rh;
      p.co2 = pickFloat("co2", "co2");
      p.tvoc = pickFloat("tvoc", "tvoc");
      p.hcho = pickFloat("hcho", "hcho");
      p.ozone = pickFloat("ozone", "ozone");
      p.no2 = pickFloat("no2", "no2");
      p.co = pickFloat("co", "co");
      p.virus_index = pickFloat("virus_index", "virus_index");
      p.air_pressure = pickFloat("air_pressure", "air_pressure");
      p.timestamp = latestStat.report_date || latestStat.created_on || p.created_on;
      p.hasLiveStats = true;
    } else {
      p.aqi = parseFloat(p.aqi) || parseFloat(p.indoor_aqi) || 0;
      p.indoor_aqi = p.aqi;
      p.pm2d5 = parseFloat(p.pm2d5) || 0;
      p.pm10 = parseFloat(p.pm10) || 0;
      p.temp = parseFloat(p.temperature !== undefined ? p.temperature : p.temp) || 0;
      p.temperature = p.temp;
      p.rh = parseFloat(p.humidity !== undefined ? p.humidity : p.rh) || 0;
      p.humidity = p.rh;
      p.co2 = parseFloat(p.co2) || 0;
      p.tvoc = parseFloat(p.tvoc) || 0;
      p.hcho = parseFloat(p.hcho) || 0;
      p.ozone = parseFloat(p.ozone) || 0;
      p.no2 = parseFloat(p.no2) || 0;
      p.co = parseFloat(p.co) || 0;
      p.pm1d0 = parseFloat(p.pm1d0) || 0;
      p.timestamp = p.created_on || p.timestamp;
      p.hasLiveStats = false;
    }

    p.outdoor_aqi = parseFloat(p.outdoor_aqi) || 0;
    p.outdoor_pm2_5 = parseFloat(p.outdoor_pm2d5 !== undefined ? p.outdoor_pm2d5 : p.outdoor_pm2_5) || 0;
    p.outdoor_pm2d5 = p.outdoor_pm2_5;

    if (p.device_status && ["off", "offline"].includes(String(p.device_status).toLowerCase())) {
      p.offline = true;
    }

    return p;
  }

  // =========================================================================
  // 2. Continuous Telemetry Synchronization Engine (/get-real-time-data/<id>/)
  // =========================================================================
  const SYNC_INTERVAL_MS = 50000; // 50 seconds standard continuous sync
  let syncTimer = null;
  let isSyncInProgress = false;
  let currentAbortController = null;
  let lastPayloadSeqId = 0;

  function applySyncedData(data) {
    if (!data) return;

    // Prevent race conditions during interactive testing
    if (window.isCockpitTestMode) {
      console.log("[Auto-Sync] Test Mode is active: Skipped overwriting active test scenario");
      return;
    }

    // Direct Extraction & Normalization from API response
    const normalized = normalizePayload(data);

    // Pass data cleanly to UI Ingestion
    if (typeof window.ingestSensorPayload === "function") {
      window.ingestSensorPayload(normalized);
    }

    // Update public weather panel if outdoor metrics present
    if (window.WeatherService && typeof window.WeatherService.updateFromSensor === "function") {
      window.WeatherService.updateFromSensor(normalized);
    }
  }

  function fallbackAjaxFetch(endpoint, targetId, callback) {
    if (typeof $ !== "undefined" && $.ajax) {
      $.ajax({
        type: "GET",
        url: endpoint,
        cache: false,
        timeout: 10000,
        success: function (data) {
          const activeNow = String(window.device_id || window.currentDeviceId || "");
          if (!targetId || !activeNow || String(targetId) === activeNow) {
            applySyncedData(data);
          }
        },
        error: function (err) {
          console.warn("[Auto-Sync] AJAX endpoint fallback notice:", err.statusText || err);
        },
        complete: function () {
          if (typeof callback === "function") callback();
        }
      });
    } else {
      if (typeof callback === "function") callback();
    }
  }

  function scheduleNextSync(ms) {
    const delay = typeof ms === "number" && ms > 0 ? ms : SYNC_INTERVAL_MS;
    clearTimeout(syncTimer);
    syncTimer = setTimeout(function () {
      getRealTimeData();
    }, delay);
  }

  function getRealTimeData(force) {
    // If interactive slider or test dock is active, pause auto-fetch to eliminate race conditions
    if (window.isCockpitTestMode && !force) {
      scheduleNextSync(SYNC_INTERVAL_MS);
      return;
    }

    const activeId = window.device_id || window.currentDeviceId;
    if (!activeId || String(activeId).includes("{{")) return;

    // When forced (e.g. user selected different monitor), abort pending request immediately
    if (force && currentAbortController) {
      try {
        currentAbortController.abort();
      } catch (e) {}
      isSyncInProgress = false;
    } else if (isSyncInProgress) {
      return;
    }
    isSyncInProgress = true;

    clearTimeout(syncTimer);
    const targetId = String(activeId);
    const endpoint = "/get-real-time-data/" + encodeURIComponent(targetId) + "/";
    const thisSeq = ++lastPayloadSeqId;

    // 1. Primary: Native fetch with AbortController timeout (10s)
    if (window.fetch) {
      currentAbortController = new AbortController();
      const controller = currentAbortController;
      const timeout = setTimeout(() => controller.abort(), 10000);

      fetch(endpoint, {
        headers: { Accept: "application/json" },
        cache: "no-store",
        signal: controller.signal
      })
        .then(function (res) {
          clearTimeout(timeout);
          if (!res.ok) throw new Error("HTTP " + res.status);
          return res.json();
        })
        .then(function (data) {
          // Check that target device is still active and this request is the latest sequence
          const activeNow = String(window.device_id || window.currentDeviceId || "");
          if (data && thisSeq === lastPayloadSeqId && (!activeNow || !targetId || targetId === activeNow)) {
            applySyncedData(data);
          }
        })
        .catch(function (err) {
          if (err && err.name === "AbortError") {
            return;
          }
          // On fetch failure, attempt jQuery ajax fallback
          fallbackAjaxFetch(endpoint, targetId);
        })
        .finally(function () {
          if (currentAbortController === controller) {
            isSyncInProgress = false;
            currentAbortController = null;
          }
          scheduleNextSync(SYNC_INTERVAL_MS);
        });
    } else {
      // 2. Secondary: Fallback for older legacy browsers
      fallbackAjaxFetch(endpoint, targetId, function () {
        isSyncInProgress = false;
        scheduleNextSync(SYNC_INTERVAL_MS);
      });
    }
  }

  function startDataSynchronization(ms) {
    scheduleNextSync(ms || SYNC_INTERVAL_MS);
  }

  function stopDataSynchronization() {
    clearTimeout(syncTimer);
  }

  function initDataSync() {
    getRealTimeData();
    scheduleNextSync(SYNC_INTERVAL_MS);
  }

  // =========================================================================
  // 3. Public Weather & Wind Conditions API Service (Open-Meteo & Geocoding)
  // =========================================================================
  const WMO_CODE_MAP = {
    0: "Clear Sky",
    1: "Mainly Clear",
    2: "Partly Cloudy",
    3: "Overcast",
    45: "Foggy",
    48: "Depositing Rime Fog",
    51: "Light Drizzle",
    53: "Moderate Drizzle",
    55: "Dense Drizzle",
    56: "Freezing Drizzle",
    57: "Dense Freezing Drizzle",
    61: "Slight Rain",
    63: "Moderate Rain",
    65: "Heavy Rain",
    66: "Freezing Rain",
    67: "Heavy Freezing Rain",
    71: "Slight Snow",
    73: "Moderate Snow",
    75: "Heavy Snow",
    77: "Snow Grains",
    80: "Rain Showers",
    81: "Moderate Showers",
    82: "Violent Showers",
    85: "Snow Showers",
    86: "Heavy Snow Showers",
    95: "Thunderstorm",
    96: "Thunderstorm with Hail",
    99: "Thunderstorm with Heavy Hail"
  };

  const WeatherService = {
    cachedData: null,
    lastFetchTime: 0,
    CACHE_DURATION_MS: 10 * 60 * 1000, // 10 minutes cache
    isFetching: false,

    async getCoordinates() {
      if (window.device_lat && window.device_lon) {
        const lat = parseFloat(window.device_lat);
        const lon = parseFloat(window.device_lon);
        if (!isNaN(lat) && !isNaN(lon) && (lat !== 0 || lon !== 0)) {
          return { lat, lon };
        }
      }
      return { lat: 28.6139, lon: 77.2090 }; // Delhi / NCR Default
    },

    degToCardinal(deg) {
      if (typeof deg !== "number" || isNaN(deg)) return "NW";
      const cardinals = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
      const index = Math.round((deg % 360) / 22.5) % 16;
      return cardinals[index];
    },

    async getCityName(lat, lon) {
      if (window.device_city) return window.device_city;
      if (window.device_location) return window.device_location;
      try {
        const geoUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`;
        const res = await fetch(geoUrl);
        if (res.ok) {
          const geo = await res.json();
          const city = geo.city || geo.locality || geo.principalSubdivision;
          if (city) return city;
        }
      } catch (e) {
        console.warn("Reverse geocode fetch skipped:", e);
      }
      return "Gurugram";
    },

    async fetchWeatherData(force = false) {
      if (window.isCockpitTestMode && !force) return;
      const now = Date.now();
      if (!force && this.cachedData && now - this.lastFetchTime < this.CACHE_DURATION_MS) {
        this.render(this.cachedData);
        return;
      }

      if (this.isFetching) return;
      this.isFetching = true;

      try {
        const coords = await this.getCoordinates();
        const cityPromise = this.getCityName(coords.lat, coords.lon);
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,wind_direction_10m&daily=temperature_2m_max,temperature_2m_min&timezone=auto`;

        const res = await fetch(weatherUrl);
        if (res.ok) {
          const data = await res.json();
          const cityName = await cityPromise;
          const currentTemp = Math.round(data.current?.temperature_2m ?? 24);
          const weatherCode = data.current?.weather_code ?? 0;
          const condition = WMO_CODE_MAP[weatherCode] || "Clear Sky";
          const maxTemp = Math.round(data.daily?.temperature_2m_max?.[0] ?? currentTemp + 4);
          const minTemp = Math.round(data.daily?.temperature_2m_min?.[0] ?? currentTemp - 5);
          const windSpeed = Math.round(data.current?.wind_speed_10m ?? 8);
          const windDirection = Math.round(data.current?.wind_direction_10m ?? 290);
          const cardinal = this.degToCardinal(windDirection);

          const weatherData = {
            city: cityName,
            tempVal: currentTemp,
            tempUnit: "°C",
            temp: `${currentTemp}°C`,
            condition: condition,
            highTemp: maxTemp,
            lowTemp: minTemp,
            range: `H: ${maxTemp}° • L: ${minTemp}°`,
            windSpeed: windSpeed,
            windDirection: windDirection,
            cardinal: cardinal
          };

          this.cachedData = weatherData;
          this.lastFetchTime = now;
          this.render(weatherData);
          return;
        }
      } catch (err) {
        console.warn("Public weather API request fallback:", err.message || err);
      } finally {
        this.isFetching = false;
      }

      this.renderFallback();
    },

    updateFromSensor(payload) {
      if (!payload) return;
      if (payload.outdoor_temperature !== undefined || payload.temp_outdoor !== undefined) {
        const t = Math.round(parseFloat(payload.outdoor_temperature || payload.temp_outdoor));
        const valEl = document.getElementById("outdoorWeatherVal");
        if (valEl && !isNaN(t)) valEl.textContent = t;
      }
      if (payload.city || payload.location || payload.device_location) {
        const cityEl = document.getElementById("outdoorWeatherCity");
        if (cityEl) cityEl.textContent = payload.city || payload.location || payload.device_location;
      }
      if (payload.weather_condition) {
        const condEl = document.getElementById("outdoorWeatherCondition");
        if (condEl) condEl.textContent = payload.weather_condition;
      }
      if (payload.weather_high !== undefined) {
        const highEl = document.getElementById("weatherHighTemp");
        if (highEl) highEl.innerHTML = `${payload.weather_high}&deg;`;
      }
      if (payload.weather_low !== undefined) {
        const lowEl = document.getElementById("weatherLowTemp");
        if (lowEl) lowEl.innerHTML = `${payload.weather_low}&deg;`;
      }
      const windSpeed = payload.wind_speed || payload.wind_speed_10m;
      if (windSpeed !== undefined) {
        const s = Math.round(parseFloat(windSpeed));
        const windSpeedEl = document.getElementById("windSpeedVal");
        if (windSpeedEl && !isNaN(s)) windSpeedEl.textContent = s;
      }
    },

    render(data) {
      if (!data) return;
      const cityEl = document.getElementById("outdoorWeatherCity");
      const valEl = document.getElementById("outdoorWeatherVal");
      const unitEl = document.getElementById("outdoorWeatherUnit");
      const condEl = document.getElementById("outdoorWeatherCondition");
      const highEl = document.getElementById("weatherHighTemp");
      const lowEl = document.getElementById("weatherLowTemp");
      const windSpeedEl = document.getElementById("windSpeedVal");

      if (cityEl && data.city) cityEl.textContent = data.city;
      if (valEl && data.tempVal !== undefined) {
        valEl.textContent = data.tempVal;
      } else if (valEl && data.temp) {
        valEl.textContent = String(data.temp).replace(/[^0-9\-]/g, "");
      }
      if (unitEl) {
        unitEl.innerHTML = data.tempUnit && data.tempUnit !== "°" ? data.tempUnit : "&deg;C";
      }
      if (condEl && data.condition) condEl.textContent = data.condition;
      if (highEl && data.highTemp !== undefined) highEl.innerHTML = `${String(data.highTemp).replace(/[^0-9\-]/g, "")}&deg;`;
      if (lowEl && data.lowTemp !== undefined) lowEl.innerHTML = `${String(data.lowTemp).replace(/[^0-9\-]/g, "")}&deg;`;
      if (windSpeedEl && data.windSpeed !== undefined) windSpeedEl.textContent = data.windSpeed;
    },

    renderFallback() {
      this.render({
        city: "Gurugram",
        tempVal: 28,
        tempUnit: "&deg;C",
        temp: "28&deg;C",
        condition: "Partly Cloudy",
        highTemp: 29,
        lowTemp: 18,
        range: "H: 29° • L: 18°",
        windSpeed: 16,
        windDirection: 315,
        cardinal: "NW"
      });
    }
  };

  // =========================================================================
  // 4. WebSocket & Realtime Polling Utilities
  // =========================================================================
  let pollingIntervalId = null;
  let activeWebSocket = null;

  function startRealtimePolling(url, intervalMs = 50000) {
    stopRealtimePolling();
    const poll = async () => {
      try {
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          applySyncedData(data);
        }
      } catch (err) {
        console.warn("Polling request notice:", err);
      }
    };
    poll();
    pollingIntervalId = setInterval(poll, intervalMs);
  }

  function stopRealtimePolling() {
    if (pollingIntervalId) {
      clearInterval(pollingIntervalId);
      pollingIntervalId = null;
    }
  }

  function connectWebSocket(wsUrl) {
    disconnectWebSocket();
    try {
      activeWebSocket = new WebSocket(wsUrl);
      activeWebSocket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          applySyncedData(data);
        } catch (e) {
          console.error("Failed to parse WebSocket message:", e);
        }
      };
      activeWebSocket.onerror = (err) => console.warn("WebSocket notice:", err);
    } catch (e) {
      console.warn("WebSocket connection skipped:", e);
    }
  }

  function disconnectWebSocket() {
    if (activeWebSocket) {
      activeWebSocket.close();
      activeWebSocket = null;
    }
  }

  // =========================================================================
  // 5. Global Export & Backward Compatibility
  // =========================================================================
  window.CockpitAPI = {
    PARAM_REGISTRY,
    validateParam,
    predictPm25FromAqi,
    reductionPct,
    resolveParamKey,
    normalizePayload,
    getRealTimeData,
    scheduleNextSync,
    startDataSynchronization,
    stopDataSynchronization,
    initDataSync,
    WeatherService,
    startRealtimePolling,
    stopRealtimePolling,
    connectWebSocket,
    disconnectWebSocket
  };

  // Backward-compatibility global aliases for existing callers
  window.PARAM_REGISTRY = PARAM_REGISTRY;
  window.validateParam = validateParam;
  window.normalizePayload = normalizePayload;
  window.getRealTimeData = getRealTimeData;
  window.startDataSynchronization = startDataSynchronization;
  window.stopDataSynchronization = stopDataSynchronization;
  window.WeatherService = WeatherService;

  // Auto-launch telemetry sync on DOM Ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initDataSync);
  } else {
    initDataSync();
  }
})(window, document);
