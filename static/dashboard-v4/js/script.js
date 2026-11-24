/**
 * IntelliGreen Technologies — Clean Air Cockpit
 * Real-Time Monitoring & Validation Engine
 * 
 * Powered by dynamic parameter thresholds, real sensor ingestion,
 * and high-performance device management for large-scale enterprise deployments.
 */

(function () {
  "use strict";

  // --- 1. Universal Proportional Scaling Engine (Landscape Desktops, TVs & Video Walls) ---
  function handleDashboardResize() {
    var width = window.innerWidth;
    var height = window.innerHeight;
    var isLandscapeDesktopOrTV = width > 1024 && width > height;

    if (isLandscapeDesktopOrTV) {
      // Calculate scale factor based on 1440x810 base
      var scale = Math.min(width / 1440, height / 810);
      document.documentElement.style.fontSize = (scale * 16) + "px";
      if (document.body) {
        document.body.classList.add("mode-landscape-tv");
      }
    } else {
      // Mobile & Portrait Tablet mode: reset to 16px and allow natural vertical flow
      document.documentElement.style.fontSize = "16px";
      if (document.body) {
        document.body.classList.remove("mode-landscape-tv");
      }
    }
  }

  // Execute immediately and on all viewport change events
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", handleDashboardResize);
  } else {
    handleDashboardResize();
  }
  window.addEventListener("load", handleDashboardResize);
  window.addEventListener("resize", handleDashboardResize);
  window.addEventListener("orientationchange", handleDashboardResize);

  // Expose global scaler for testing and dynamic checks
  window.handleDashboardResize = handleDashboardResize;

  // --- Parameter Thresholds & Validation Engine ---
  // Default parameters matching the specification; superseded by window.parameters if provided.
  const DEFAULT_PARAMETERS = {
    good: "#00B050",
    satisfactory: "#669900",
    moderate: "#974444ff",
    poor: "#FFC000",
    verypoor: "#ff0000",
    severe: "#C00000",
    pm2d5: {
      elementId: "#pm25_status",
      percent: 250,
      data: [
        { status: "good", min: -1, max: 30, caption: "Good" },
        { status: "satisfactory", min: 30, max: 60, caption: "Satisfactory" },
        { status: "moderate", min: 60, max: 90, caption: "Moderate" },
        { status: "poor", min: 90, max: 120, caption: "Poor" },
        { status: "verypoor", min: 120, max: 250, caption: "Very Poor" },
        { status: "severe", min: 250, max: 300000, caption: "Severe" }
      ]
    },
    pm1d0: {
      elementId: "#pm1_status",
      percent: 200,
      data: [
        { status: "good", min: -1, max: 15, caption: "Good" },
        { status: "satisfactory", min: 15, max: 40, caption: "Satisfactory" },
        { status: "moderate", min: 40, max: 60, caption: "Moderate" },
        { status: "poor", min: 60, max: 125, caption: "Poor" },
        { status: "verypoor", min: 125, max: 200, caption: "Very Poor" },
        { status: "severe", min: 200, max: 300000, caption: "Severe" }
      ]
    },
    pm10: {
      elementId: "#pm10_status",
      percent: 430,
      data: [
        { status: "good", min: -1, max: 50, caption: "Good" },
        { status: "satisfactory", min: 50, max: 100, caption: "Satisfactory" },
        { status: "moderate", min: 100, max: 250, caption: "Moderate" },
        { status: "poor", min: 250, max: 350, caption: "Poor" },
        { status: "verypoor", min: 350, max: 430, caption: "Very Poor" },
        { status: "severe", min: 430, max: 300000, caption: "Severe" }
      ]
    },
    co2: {
      elementId: "#co2_status",
      percent: 2500,
      data: [
        { status: "good", min: -1, max: 1000, caption: "Good" },
        { status: "poor", min: 1001, max: 1500, caption: "Poor" },
        { status: "verypoor", min: 1501, max: 2500, caption: "Very Poor" },
        { status: "severe", min: 2501, max: 300000, caption: "Severe" }
      ]
    },
    tvoc: {
      elementId: "#tvoc_status",
      percent: 2200,
      data: [
        { status: "good", min: -1, max: 400, caption: "Low" },
        { status: "satisfactory", min: 400, max: 2200, caption: "Moderate" },
        { status: "moderate", min: 2200, max: 300000, caption: "High" }
      ]
    },
    rh: {
      elementId: "#rh_status",
      percent: 65,
      data: [
        { status: "poor", min: -1, max: 20, caption: "Uncomfortable" },
        { status: "good", min: 20, max: 65, caption: "Comfortable" },
        { status: "poor", min: 65, max: 300000, caption: "Uncomfortable" }
      ]
    },
    temperature: {
      elementId: "#temp_status",
      percent: 27,
      data: [
        { status: "poor", min: -1, max: 17, caption: "Uncomfortable" },
        { status: "good", min: 17, max: 27, caption: "Comfortable" },
        { status: "poor", min: 27, max: 300000, caption: "Uncomfortable" }
      ]
    },
    temp: {
      elementId: "#temp_status",
      percent: 27,
      data: [
        { status: "poor", min: -1, max: 17, caption: "Uncomfortable" },
        { status: "good", min: 17, max: 27, caption: "Comfortable" },
        { status: "poor", min: 27, max: 300000, caption: "Uncomfortable" }
      ]
    },
    hcho: {
      elementId: "#hcho_status",
      percent: 0.75,
      data: [
        { status: "good", min: -1, max: 100, caption: "Good" },
        { status: "satisfactory", min: 100, max: 300, caption: "Satisfactory" },
        { status: "moderate", min: 300, max: 750, caption: "Moderate" },
        { status: "severe", min: 750, max: 300000, caption: "High" }
      ]
    },
    virus_index: {
      elementId: "#virus_index_status",
      percent: 10,
      data: [
        { status: "good", min: -1, max: 3, caption: "Good" },
        { status: "satisfactory", min: 3, max: 6, caption: "Satisfactory" },
        { status: "poor", min: 6, max: 8, caption: "Poor" },
        { status: "severe", min: 8, max: 10, caption: "Severe" }
      ]
    },
    air_pressure: {
      elementId: "#air_pressure_status",
      percent: 1031,
      data: [
        { status: "poor", min: -1, max: 970, caption: "Uncomfortable" },
        { status: "good", min: 970, max: 1030, caption: "Comfortable" },
        { status: "poor", min: 1030, max: 300000, caption: "Uncomfortable" }
      ]
    },
    ozone: {
      elementId: "#ozone_status",
      percent: 71,
      data: [
        { status: "good", min: -1, max: 30, caption: "good" },
        { status: "poor", min: 30, max: 70, caption: "Poor" },
        { status: "severe", min: 70, max: 300000, caption: "Severe" }
      ]
    },
    no2: {
      elementId: "#no2_status",
      percent: 251,
      data: [
        { status: "good", min: -1, max: 100, caption: "Good" },
        { status: "poor", min: 100, max: 250, caption: "Comfortable" },
        { status: "severe", min: 250, max: 300000, caption: "Severe" }
      ]
    },
    co: {
      elementId: "#co_status",
      percent: 71,
      data: [
        { status: "good", min: -1, max: 35, caption: "Good" },
        { status: "poor", min: 35, max: 70, caption: "Poor" },
        { status: "severe", min: 70, max: 300000, caption: "Severe" }
      ]
    },
    indoor_aqi: {
      elementId: "#indoor_aqi_status",
      percent: 501,
      data: [
        { status: "good", min: -1, max: 50, caption: "Good", icon_color: "#a8df5f" },
        { status: "satisfactory", min: 51, max: 100, caption: "Satisfactory", icon_color: "#a8df5f" },
        { status: "moderate", min: 101, max: 200, caption: "Moderate", icon_color: "#a8df5f" },
        { status: "poor", min: 201, max: 300, caption: "Poor", icon_color: "#a8df5f" },
        { status: "verypoor", min: 301, max: 400, caption: "Very Poor", icon_color: "#a8df5f" },
        { status: "severe", min: 401, max: 300000, caption: "Severe", icon_color: "#a8df5f" }
      ]
    },
    outdoor_aqi: {
      elementId: "#outdoor_aqi_status",
      percent: 501,
      data: [
        { status: "good", min: -1, max: 50, caption: "Good", icon_color: "#a8df5f" },
        { status: "satisfactory", min: 51, max: 100, caption: "Satisfactory", icon_color: "#a8df5f" },
        { status: "moderate", min: 101, max: 200, caption: "Moderate", icon_color: "#a8df5f" },
        { status: "poor", min: 201, max: 300, caption: "Poor", icon_color: "#a8df5f" },
        { status: "verypoor", min: 301, max: 400, caption: "Very Poor", icon_color: "#a8df5f" },
        { status: "severe", min: 401, max: 300000, caption: "Severe", icon_color: "#C00000" }
      ]
    },
    validate: function (param_type, value) {
      let _color = "#66bb6a";
      let _caption = "";
      let _element_id = "";
      let _status = "Good";
      let _percent = 100;

      if (param_type === "temp") param_type = "temperature";
      if (param_type === "humidity") param_type = "rh";
      if (param_type === "aqi") param_type = "indoor_aqi";
      if (param_type === "pm25") param_type = "pm2d5";
      if (param_type === "pm1") param_type = "pm1d0";

      const target = this[param_type];
      if (target && Array.isArray(target.data)) {
        const numVal = parseFloat(value) || 0;
        for (let i = 0; i < target.data.length; i++) {
          const item = target.data[i];
          if (numVal >= item.min && numVal <= item.max) {
            _color = this[item.status] || _color;
            _caption = item.caption;
            _element_id = target.elementId;
            _status = item.status;
            if (param_type === "hcho") {
              _percent = parseFloat((numVal * 100) / target.percent).toFixed(2);
            } else {
              _percent = parseInt((numVal * 100) / target.percent, 10);
            }
            break;
          }
        }
      }
      return {
        color: _color,
        caption: _caption,
        elementId: _element_id,
        status: _status,
        percent: _percent
      };
    }
  };

  /**
   * Universal Parameter Validator
   * Normalizes parameter aliases and queries parameters.validate
   */
  function validateParam(paramType, value) {
    const params = window.parameters || DEFAULT_PARAMETERS;
    let clean = String(paramType).toLowerCase().replace(/[\s\.\-_]/g, "");

    const aliasMap = {
      temp: "temperature",
      temperature: "temperature",
      t: "temperature",
      humidity: "rh",
      rh: "rh",
      aqi: "indoor_aqi",
      indooraqi: "indoor_aqi",
      indoor_aqi: "indoor_aqi",
      outdooraqi: "outdoor_aqi",
      outdoor_aqi: "outdoor_aqi",
      outaqi: "outdoor_aqi",
      pm25: "pm2d5",
      pm2d5: "pm2d5",
      pm2_5: "pm2d5",
      pm10: "pm10",
      pm_10: "pm10",
      pm1: "pm1d0",
      pm1d0: "pm1d0",
      pm1_0: "pm1d0",
      tvoc: "tvoc",
      voc: "tvoc",
      co2: "co2",
      hcho: "hcho",
      formaldehyde: "hcho",
      virusindex: "virus_index",
      virus_index: "virus_index",
      virus: "virus_index",
      airpressure: "air_pressure",
      air_pressure: "air_pressure",
      pressure: "air_pressure",
      ozone: "ozone",
      o3: "ozone",
      no2: "no2",
      co: "co"
    };

    const targetKey = aliasMap[clean] || clean;

    if (params && typeof params.validate === "function") {
      const res = params.validate(targetKey, value);
      if (res && res.color) return res;
    }
    return DEFAULT_PARAMETERS.validate(targetKey, value);
  }

  /** Safe value extractor with fallback */
  function getVal(d, keys, fallback = 0) {
    if (!d) return fallback;
    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      if (d[k] !== undefined && d[k] !== null && d[k] !== "") {
        const parsed = parseFloat(d[k]);
        return isNaN(parsed) ? fallback : parsed;
      }
    }
    return fallback;
  }

  /** Reduction Percentage Calculation */
  function reductionPct(outdoor, indoor) {
    const outVal = parseFloat(outdoor);
    const inVal = parseFloat(indoor);
    if (isNaN(outVal) || isNaN(inVal) || outVal <= 0) return 0;
    return Math.max(0, Math.min(100, Math.round(((outVal - inVal) / outVal) * 100)));
  }

  /**
   * Predicts Outdoor PM2.5 from Outdoor AQI using the inverse CPCB NAQI formula.
   */
  function predictPm25FromAqi(aqi) {
    const val = parseFloat(aqi);
    if (isNaN(val) || val <= 0) return 0;

    let pm25;
    if (val <= 50) {
      pm25 = (val / 50) * 30;
    } else if (val <= 100) {
      pm25 = 30 + ((val - 50) / 50) * 30;
    } else if (val <= 200) {
      pm25 = 60 + ((val - 100) / 100) * 30;
    } else if (val <= 300) {
      pm25 = 90 + ((val - 200) / 100) * 30;
    } else if (val <= 400) {
      pm25 = 120 + ((val - 300) / 100) * 130;
    } else {
      pm25 = 250 + ((val - 400) / 100) * 130;
    }
    return Math.round(pm25 * 10) / 10;
  }

  // --- Dynamic Tube Parameter Registry (All 15 Customizable Tubes) ---
  const PARAMETER_REGISTRY = {
    pm2d5: {
      name: "PM2.5",
      label: "PM2.5",
      unit: "µg/m³",
      extract: (d) => (d && d.pm2d5 !== undefined ? d.pm2d5 : getVal(d, ["pm2d5", "pm25", "pm2_5"])),
      format: (v) => (v % 1 === 0 ? v : Number(v).toFixed(1)),
      validate: (v) => validateParam("pm2d5", v)
    },
    pm10: {
      name: "PM10",
      label: "PM10",
      unit: "µg/m³",
      extract: (d) => (d && d.pm10 !== undefined ? d.pm10 : getVal(d, ["pm10", "pm_10"])),
      format: (v) => Math.round(v),
      validate: (v) => validateParam("pm10", v)
    },
    pm1d0: {
      name: "PM1.0",
      label: "PM1.0",
      unit: "µg/m³",
      extract: (d) => (d && d.pm1d0 !== undefined ? d.pm1d0 : getVal(d, ["pm1d0", "pm1", "pm1_0"])),
      format: (v) => (v % 1 === 0 ? v : Number(v).toFixed(1)),
      validate: (v) => validateParam("pm1d0", v)
    },
    co2: {
      name: "Carbon Dioxide",
      label: "CO₂",
      unit: "ppm",
      extract: (d) => (d && d.co2 !== undefined ? d.co2 : getVal(d, ["co2"])),
      format: (v) => Math.round(v),
      validate: (v) => validateParam("co2", v)
    },
    temp: {
      name: "Temperature",
      label: "Temp",
      unit: "°C",
      extract: (d) => (d && (d.temp !== undefined ? d.temp : d.temperature !== undefined ? d.temperature : getVal(d, ["temperature", "temp", "t"]))),
      format: (v) => (v % 1 === 0 ? v : Number(v).toFixed(1)),
      validate: (v) => validateParam("temperature", v)
    },
    temperature: {
      name: "Temperature",
      label: "Temp",
      unit: "°C",
      extract: (d) => (d && (d.temp !== undefined ? d.temp : d.temperature !== undefined ? d.temperature : getVal(d, ["temperature", "temp", "t"]))),
      format: (v) => (v % 1 === 0 ? v : Number(v).toFixed(1)),
      validate: (v) => validateParam("temperature", v)
    },
    rh: {
      name: "Relative Humidity",
      label: "RH",
      unit: "%",
      extract: (d) => (d && (d.rh !== undefined ? d.rh : d.humidity !== undefined ? d.humidity : getVal(d, ["humidity", "rh"]))),
      format: (v) => Math.round(v),
      validate: (v) => validateParam("rh", v)
    },
    tvoc: {
      name: "TVOC",
      label: "TVOC",
      unit: "ppm",
      extract: (d) => (d && d.tvoc !== undefined ? d.tvoc : getVal(d, ["tvoc", "voc"])),
      format: (v) => Math.round(v),
      validate: (v) => validateParam("tvoc", v)
    },
    hcho: {
      name: "Formaldehyde",
      label: "HCHO",
      unit: "mg/m³",
      extract: (d) => (d && d.hcho !== undefined ? d.hcho : getVal(d, ["hcho", "formaldehyde"])),
      format: (v) => Number(v).toFixed(2),
      validate: (v) => validateParam("hcho", v)
    },
    virus_index: {
      name: "Virus Index",
      label: "Virus",
      unit: "idx",
      extract: (d) => (d && d.virus_index !== undefined ? d.virus_index : getVal(d, ["virus_index", "virusindex", "virus"])),
      format: (v) => (v % 1 === 0 ? v : Number(v).toFixed(1)),
      validate: (v) => validateParam("virus_index", v)
    },
    air_pressure: {
      name: "Air Pressure",
      label: "Pressure",
      unit: "hPa",
      extract: (d) => (d && d.air_pressure !== undefined ? d.air_pressure : getVal(d, ["air_pressure", "airpressure", "pressure"])),
      format: (v) => Math.round(v),
      validate: (v) => validateParam("air_pressure", v)
    },
    ozone: {
      name: "Ozone",
      label: "Ozone",
      unit: "µg/m³",
      extract: (d) => (d && d.ozone !== undefined ? d.ozone : getVal(d, ["ozone", "o3"])),
      format: (v) => Math.round(v),
      validate: (v) => validateParam("ozone", v)
    },
    no2: {
      name: "Nitrogen Dioxide",
      label: "NO2",
      unit: "µg/m³",
      extract: (d) => (d && d.no2 !== undefined ? d.no2 : getVal(d, ["no2"])),
      format: (v) => Math.round(v),
      validate: (v) => validateParam("no2", v)
    },
    co: {
      name: "Carbon Monoxide",
      label: "CO",
      unit: "mg/m³",
      extract: (d) => (d && d.co !== undefined ? d.co : getVal(d, ["co"])),
      format: (v) => (v % 1 === 0 ? v : Number(v).toFixed(1)),
      validate: (v) => validateParam("co", v)
    },
    indoor_aqi: {
      name: "Indoor AQI",
      label: "AQI",
      unit: "",
      extract: (d) => (d && (d.aqi !== undefined ? d.aqi : d.indoor_aqi !== undefined ? d.indoor_aqi : getVal(d, ["aqi", "indoor_aqi"]))),
      format: (v) => Math.round(v),
      validate: (v) => validateParam("indoor_aqi", v)
    },
    outdoor_aqi: {
      name: "Outdoor AQI",
      label: "Out AQI",
      unit: "",
      extract: (d) => getVal(d, ["outdoor_aqi", "outdooraqi"]),
      format: (v) => Math.round(v),
      validate: (v) => validateParam("outdoor_aqi", v)
    }
  };

  const DEFAULT_CARDS = ["AQI", "pm2d5", "pm10", "co2", "temp", "rh", "tvoc"];

  function getActiveCards() {
    if (Array.isArray(window.cards) && window.cards.length > 0) {
      return window.cards;
    }
    return DEFAULT_CARDS;
  }

  function resolveParamKey(raw) {
    if (!raw) return null;
    const clean = String(raw).toLowerCase().replace(/[\s\.\-_]/g, "");
    const aliasMap = {
      aqi: "indoor_aqi",
      indooraqi: "indoor_aqi",
      outdooraqi: "outdoor_aqi",
      outaqi: "outdoor_aqi",
      pm2d5: "pm2d5",
      pm25: "pm2d5",
      pm10: "pm10",
      pm1d0: "pm1d0",
      pm1: "pm1d0",
      tvoc: "tvoc",
      voc: "tvoc",
      rh: "rh",
      humidity: "rh",
      temp: "temp",
      temperature: "temp",
      t: "temp",
      hcho: "hcho",
      co2: "co2",
      virusindex: "virus_index",
      virus_index: "virus_index",
      virus: "virus_index",
      airpressure: "air_pressure",
      air_pressure: "air_pressure",
      pressure: "air_pressure",
      ozone: "ozone",
      o3: "ozone",
      no2: "no2",
      co: "co"
    };
    return aliasMap[clean] || (PARAMETER_REGISTRY[clean] ? clean : null);
  }

  // --- DOM Elements ---
  const liveClockEl = document.getElementById("liveClock");
  const statusDot = document.getElementById("statusDot");
  const monitoringStatus = document.getElementById("monitoringStatus");
  const locationsPanel = document.getElementById("locationsPanel");
  const locationListEl = document.getElementById("locationList");
  const locationTotalCount = document.getElementById("locationTotalCount");
  const deviceSearchBox = document.getElementById("deviceSearchBox");
  const deviceSearchTrigger = document.getElementById("deviceSearchTrigger");
  const deviceSearchInput = document.getElementById("deviceSearchInput");
  const deviceSearchClear = document.getElementById("deviceSearchClear");
  const tileMascotView = document.getElementById("tileMascotView");

  // Panel 1: Indoor AQI / PM2.5 Dynamic Display
  const indoorCard = document.getElementById("indoorCard");
  const indoorCardBg = document.getElementById("indoorCardBg");
  const indoorTitleEl = document.getElementById("indoor-title");
  const indoorAqiValueEl = document.getElementById("indoorAqiValue");
  const indoorConditionEl = document.getElementById("indoorCondition");
  const currentZoneNameEl = document.getElementById("currentZoneName");
  const indoorMetricLabelEl = document.getElementById("indoorMetricLabel");
  const indoorAqiSubEl = document.getElementById("indoorAqiSub");
  const indoorLastUpdatedTimeEl = document.getElementById("indoorLastUpdatedTime");

  // Panel 2: Outdoor AQI
  const outdoorAqiValueEl = document.getElementById("outdoorAqiValue");
  const outdoorConditionEl = document.getElementById("outdoorCondition");
  const outdoorPm25El = document.getElementById("outdoorPm25");
  const outdoorPm10El = document.getElementById("outdoorPm10");
  const gaugeArc = document.getElementById("gaugeArc");
  const gaugeNeedle = document.getElementById("gaugeNeedle");
  const outdoorStationEl = document.getElementById("outdoorStation") || document.querySelector(".corporate-source");

  // Panel 3: Air Elements
  const corporateBarsEl = document.getElementById("corporateBars");
  const pm25DisplayEl = document.getElementById("pm25Display");
  const pm25CatLabelEl = document.getElementById("pm25CatLabel");

  // Panel 5: Impact & Reduction / Panel 2 AQI Reduction
  const aqiReductionEl = document.getElementById("aqiReduction") || document.getElementById("outdoorAqiReductionVal");
  const pmReductionEl = document.getElementById("pmReduction");
  const ringAqiArc = document.getElementById("ringAqiArc");
  const ringPmArc = document.getElementById("ringPmArc");
  const RING_CIRCUMFERENCE = 251.33;

  // Theme Toggle Elements
  const themeToggleBtn = document.getElementById("themeToggleBtn");
  const themeToggleText = document.getElementById("themeToggleText");
  const themeIconSun = document.querySelector(".theme-icon-sun");
  const themeIconMoon = document.querySelector(".theme-icon-moon");

  // Toast
  const cockpitToast = document.getElementById("cockpitToast");
  let toastTimer = null;

  function showToast(message) {
    if (!cockpitToast) return;
    cockpitToast.textContent = message;
    cockpitToast.classList.add("is-visible");
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      cockpitToast.classList.remove("is-visible");
    }, 2800);
  }

  // --- Indoor Card Scenic Backgrounds (Himalayan / Mountain Peaks 1–12) ---
  const INDOOR_LANDSCAPES = [
    { id: "mountain-1", name: "Mountain Peak 1", url: "assets/mountain_1.png" },
    { id: "mountain-2", name: "Mountain Peak 2", url: "assets/mountain_2.png" },
    { id: "mountain-3", name: "Mountain Peak 3", url: "assets/mountain_3.png" },
    { id: "mountain-4", name: "Mountain Peak 4", url: "assets/mountain_4.png" },
    { id: "mountain-5", name: "Mountain Peak 5", url: "assets/mountain_5.jpeg" },
    { id: "mountain-6", name: "Mountain Peak 6", url: "assets/mountain_6.jpeg" },
    { id: "mountain-7", name: "Mountain Peak 7", url: "assets/mountain_7.jpeg" },
    { id: "mountain-8", name: "Mountain Peak 8", url: "assets/mountain_8.jpeg" },
    { id: "mountain-9", name: "Mountain Peak 9", url: "assets/mountain_9.jpeg" },
    { id: "mountain-10", name: "Mountain Peak 10", url: "assets/mountain_10.jpeg" },
    { id: "mountain-11", name: "Mountain Peak 11", url: "assets/mountain_11.jpeg" },
    { id: "mountain-12", name: "Mountain Peak 12", url: "assets/mountains_12.jpeg" }
  ];
  let currentLandscapeIndex = 0;
  let landscapeAutoTimer = null;

  function resolveAssetUrl(url) {
    if (window.STATIC_ASSETS_URL) {
      return window.STATIC_ASSETS_URL + url.replace(/^assets\//, "");
    }
    const refImg = document.querySelector(".brand-emblem") || document.getElementById("leafMascotImg");
    if (refImg && refImg.src && refImg.src.includes("/assets/")) {
      const basePath = refImg.src.substring(0, refImg.src.indexOf("/assets/") + 8);
      return basePath + url.replace(/^assets\//, "");
    }
    return url;
  }

  function preloadMountainImages() {
    INDOOR_LANDSCAPES.forEach((item) => {
      const img = new Image();
      img.src = resolveAssetUrl(item.url);
    });
  }

  function setIndoorLandscape(index, withFade = true) {
    currentLandscapeIndex = ((index % INDOOR_LANDSCAPES.length) + INDOOR_LANDSCAPES.length) % INDOOR_LANDSCAPES.length;
    const landscape = INDOOR_LANDSCAPES[currentLandscapeIndex];
    if (!indoorCardBg) return;

    const resolvedUrl = resolveAssetUrl(landscape.url);
    if (withFade) {
      indoorCardBg.classList.add("is-fading");
      setTimeout(() => {
        indoorCardBg.style.backgroundImage = `url("${resolvedUrl}")`;
        requestAnimationFrame(() => {
          indoorCardBg.classList.remove("is-fading");
        });
      }, 420);
    } else {
      indoorCardBg.style.backgroundImage = `url("${resolvedUrl}")`;
    }
  }

  function nextIndoorLandscape() {
    setIndoorLandscape(currentLandscapeIndex + 1, true);
  }

  function startLandscapeAutoLoop(intervalMs = 20000) {
    stopLandscapeAutoLoop();
    landscapeAutoTimer = setInterval(() => {
      nextIndoorLandscape();
    }, intervalMs);
  }

  function stopLandscapeAutoLoop() {
    if (landscapeAutoTimer) {
      clearInterval(landscapeAutoTimer);
      landscapeAutoTimer = null;
    }
  }

  function restartLandscapeAutoLoop(intervalMs = 20000) {
    startLandscapeAutoLoop(intervalMs);
  }

  // --- Single Active Monitor Mascot Loop (leaf_mascot.png & eco_bulb_clean.png) ---
  let mascotTimer = null;
  let currentMascotIsLeaf = true;

  function toggleMascotCharacter() {
    const leaf = document.getElementById("leafMascotImg");
    const bulb = document.getElementById("ecoBulbImg");
    if (!leaf || !bulb) return;

    currentMascotIsLeaf = !currentMascotIsLeaf;
    if (currentMascotIsLeaf) {
      bulb.classList.remove("is-active");
      leaf.classList.add("is-active");
    } else {
      leaf.classList.remove("is-active");
      bulb.classList.add("is-active");
    }
  }

  function startMascotLoop(intervalMs = 6000) {
    stopMascotLoop();
    mascotTimer = setInterval(toggleMascotCharacter, intervalMs);
  }

  function stopMascotLoop() {
    if (mascotTimer) {
      clearInterval(mascotTimer);
      mascotTimer = null;
    }
  }

  function updateMascotVisibility() {
    if (!tileMascotView) return;
    const totalCount = Array.isArray(allDevices) ? allDevices.length : 0;
    const locationsPanel = document.getElementById("locationsPanel");
    const isSingleActive = totalCount <= 1 && !searchKeyword.trim();
    if (locationsPanel) {
      if (isSingleActive) {
        locationsPanel.classList.add("has-single-monitor");
      } else {
        locationsPanel.classList.remove("has-single-monitor");
      }
    }
    // When active monitor number is only one (or zero), display mascot scene below it in a loop
    if (isSingleActive) {
      tileMascotView.style.display = "flex";
      startMascotLoop(6000);
    } else {
      tileMascotView.style.display = "none";
      stopMascotLoop();
    }
  }

  // --- Live IST Clock & Current Time Tile ---
  const digitalTimeHMEl = document.getElementById("digitalTimeHM");
  const digitalTimeSecEl = document.getElementById("digitalTimeSec");
  const digitalDateStrEl = document.getElementById("digitalDateStr");
  const digitalTzTextEl = document.getElementById("digitalTzText");

  function updateClock() {
    const now = new Date();

    // 1. Format top header clock if present
    if (liveClockEl) {
      const formatted = now.toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        weekday: "short",
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
      });
      liveClockEl.textContent = `${formatted} IST`;
    }

    // 2. Format Current Time & Wind tile clock elements
    try {
      const istOptions = { timeZone: "Asia/Kolkata", hour12: false };
      const hours = now.toLocaleTimeString("en-IN", { ...istOptions, hour: "2-digit" }).padStart(2, "0");
      const minutes = now.toLocaleTimeString("en-IN", { ...istOptions, minute: "2-digit" }).padStart(2, "0");
      const seconds = now.toLocaleTimeString("en-IN", { ...istOptions, second: "2-digit" }).padStart(2, "0");

      const weekday = now.toLocaleDateString("en-IN", { ...istOptions, weekday: "short" }).toUpperCase();
      const day = now.toLocaleDateString("en-IN", { ...istOptions, day: "2-digit" });
      const month = now.toLocaleDateString("en-IN", { ...istOptions, month: "short" }).toUpperCase();

      if (digitalTimeHMEl) digitalTimeHMEl.textContent = `${hours}:${minutes}`;
      if (digitalTimeSecEl) digitalTimeSecEl.textContent = `:${seconds}`;
      if (digitalDateStrEl) digitalDateStrEl.textContent = `${weekday}, ${day} ${month}`;
      if (digitalTzTextEl) digitalTzTextEl.textContent = "IST";
    } catch (e) {
      const h = String(now.getHours()).padStart(2, "0");
      const m = String(now.getMinutes()).padStart(2, "0");
      const s = String(now.getSeconds()).padStart(2, "0");
      if (digitalTimeHMEl) digitalTimeHMEl.textContent = `${h}:${m}`;
      if (digitalTimeSecEl) digitalTimeSecEl.textContent = `:${s}`;
    }
  }

  // --- Dynamic Tubes Renderer (Panel 3) ---
  function renderDynamicTubes(cardsList, dataContext) {
    if (!corporateBarsEl) return;
    const cards = (Array.isArray(cardsList) && cardsList.length > 0) ? cardsList : DEFAULT_CARDS;

    const resolvedParams = [];
    cards.forEach((rawKey) => {
      const clean = String(rawKey).trim().toUpperCase();
      if (clean === "AQI" || clean === "INDOOR_AQI" || clean === "OUTDOOR_AQI") {
        return; // AQI is displayed in Panel 1 & 2, not in the Panel 3 air element tubes
      }
      const k = resolveParamKey(rawKey);
      if (k && PARAMETER_REGISTRY[k] && k !== "indoor_aqi" && k !== "outdoor_aqi") {
        resolvedParams.push({ ...PARAMETER_REGISTRY[k], key: k });
      }
    });

    if (corporateBarsEl.style && corporateBarsEl.style.setProperty) {
      corporateBarsEl.style.setProperty("--bars-count", resolvedParams.length);
    }

    if (resolvedParams.length === 0) return;

    // Check if DOM rebuild is necessary
    const existingItems = corporateBarsEl.querySelectorAll(".corporate-bar-item");
    const needRebuild = existingItems.length !== resolvedParams.length ||
      Array.from(existingItems).some((item, idx) => {
        const itemParam = item.dataset ? item.dataset.param : item.getAttribute("data-param");
        return itemParam !== resolvedParams[idx].key;
      });

    if (needRebuild) {
      corporateBarsEl.innerHTML = "";
      resolvedParams.forEach((def) => {
        const item = document.createElement("div");
        item.className = "corporate-bar-item";
        if (item.dataset) {
          item.dataset.param = def.key;
        } else {
          item.setAttribute("data-param", def.key);
        }

        const track = document.createElement("div");
        track.className = "corporate-bar-track";
        const span = document.createElement("span");
        span.id = `bar-${def.key}`;
        track.appendChild(span);

        const lbl = document.createElement("span");
        lbl.className = "bar-param-label";
        lbl.textContent = def.label || def.name;

        const val = document.createElement("strong");
        val.className = "bar-param-val";
        val.id = `val-${def.key}`;
        val.textContent = "--";

        item.appendChild(track);
        item.appendChild(lbl);
        item.appendChild(val);
        corporateBarsEl.appendChild(item);
      });
    }

    // Update bar height, background color, and values via validateParam
    const isContextOffline = Boolean(
      (dataContext && (dataContext.offline === true && !dataContext.hasLiveStats))
    );

    resolvedParams.forEach((def) => {
      let rawVal = def.extract(dataContext);
      let valInfo = def.validate(rawVal);
      let formattedVal = def.format(rawVal);

      // Percentage height for visual track (clamped between 8% and 100%)
      let pct = Math.max(8, Math.min(100, parseFloat(valInfo.percent) || 0));
      let barColor = valInfo.color;

      // When device is offline, all parameters must be zero and visual tracks flattened
      if (isContextOffline) {
        rawVal = 0;
        formattedVal = "0";
        pct = 8;
        barColor = "#94a3b8";
      }

      const barSpan = document.getElementById(`bar-${def.key}`);
      const valStrong = document.getElementById(`val-${def.key}`);
      const itemEl = barSpan ? barSpan.closest(".corporate-bar-item") : null;

      if (barSpan) {
        barSpan.style.height = `${pct}%`;
        barSpan.style.backgroundColor = barColor;
      }
      if (valStrong) {
        valStrong.textContent = `${formattedVal}`;
      }
      if (itemEl) {
        itemEl.setAttribute(
          "title",
          isContextOffline
            ? `${def.name}: 0 (Offline)`
            : `${def.name}: ${formattedVal}${def.unit ? " " + def.unit : ""} (${valInfo.caption})`
        );
      }
    });
  }

  function renderTubes(cardsList, dataContext) {
    return renderDynamicTubes(cardsList, dataContext || currentSensorData);
  }
  window.renderTubes = renderTubes;
  window.renderDynamicTubes = renderDynamicTubes;

  // =========================================================================
  // Panel 4: Monitored Devices & Locations Management (Scrollable & Searchable)
  // =========================================================================
  let allDevices = [];
  let filteredDevices = [];
  let currentDeviceId = null;
  let searchKeyword = "";

  function getRawDeviceList() {
    if (Array.isArray(window.device_list) && window.device_list.length > 0) {
      return window.device_list;
    }
    return [
      { device_id: "6699", device_name: "KNMA" },
      { device_id: "6863", device_name: "SBI-4th floor Left side" },
      { device_id: "6855", device_name: "Demo Mr. Lalit" }
    ];
  }

  function initDeviceList() {
    allDevices = getRawDeviceList();

    // Default active device
    if (!currentDeviceId) {
      currentDeviceId = window.device_id || (allDevices[0] && allDevices[0].device_id) || "6699";
    }

    filterAndRenderDevices();
  }

  window.setDeviceList = function (list) {
    if (Array.isArray(list)) {
      window.device_list = list.slice();
      allDevices = list.slice();
      if (allDevices.length > 0 && !allDevices.some((d) => String(d.device_id) === String(currentDeviceId))) {
        currentDeviceId = allDevices[0].device_id;
      }
      filterAndRenderDevices();
    }
  };

  function filterAndRenderDevices(preserveScroll = false) {
    const q = searchKeyword.toLowerCase().trim();
    if (q) {
      filteredDevices = allDevices.filter((d) => {
        const nameMatch = d.device_name && String(d.device_name).toLowerCase().includes(q);
        const idMatch = d.device_id && String(d.device_id).toLowerCase().includes(q);
        return nameMatch || idMatch;
      });
    } else {
      filteredDevices = allDevices.slice();
    }

    renderDeviceListDOM(preserveScroll);
  }

  function renderDeviceListDOM(preserveScroll = false) {
    if (!locationListEl) return;
    const prevScroll = (preserveScroll && typeof locationListEl.scrollTop === "number") ? locationListEl.scrollTop : 0;
    locationListEl.innerHTML = "";

    const totalCount = allDevices.length;
    const filteredCount = filteredDevices.length;

    // Optional Total Count Badge (if element exists)
    if (locationTotalCount) {
      if (searchKeyword.trim().length > 0) {
        locationTotalCount.textContent = `${filteredCount} of ${totalCount}`;
      } else {
        locationTotalCount.textContent = `${totalCount.toLocaleString()} device${totalCount === 1 ? "" : "s"}`;
      }
    }

    // Empty Search State
    if (filteredCount === 0) {
      const emptyEl = document.createElement("div");
      emptyEl.className = "corporate-location-empty";
      emptyEl.innerHTML = `
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          <line x1="8" y1="11" x2="14" y2="11"></line>
        </svg>
        <span>No devices matching "<strong>${escapeHtml(searchKeyword)}</strong>"</span>
      `;
      locationListEl.appendChild(emptyEl);
      updateMascotVisibility();
      return;
    }

    // Render All Matching Devices (Smoothly Scrollable)
    filteredDevices.forEach((dev, idx) => {
      const isSelected = String(dev.device_id) === String(currentDeviceId);

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `corporate-location ${isSelected ? "is-active" : ""}`;
      btn.setAttribute("role", "option");
      btn.setAttribute("aria-selected", isSelected ? "true" : "false");
      btn.setAttribute("data-device-id", String(dev.device_id));
      btn.setAttribute("aria-label", `Select device ${dev.device_name} (ID: ${dev.device_id})`);

      btn.innerHTML = `
        <span class="corporate-location-icon location-${idx % 3}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect width="16" height="20" x="4" y="2" rx="2" ry="2"></rect>
            <path d="M9 22v-4h6v4"></path>
            <path d="M8 6h.01"></path>
            <path d="M16 6h.01"></path>
            <path d="M8 10h.01"></path>
            <path d="M16 10h.01"></path>
            <path d="M8 14h.01"></path>
            <path d="M16 14h.01"></path>
          </svg>
        </span>
        <span class="corporate-location-name">
          <strong title="${escapeHtml(dev.device_name)}">${escapeHtml(dev.device_name)}</strong>
          <small>
            <span class="${dev.offline ? "corporate-offline-dot" : "corporate-online-dot"}"></span>
            ${dev.offline ? "Offline" : "Online"} · ID: #${escapeHtml(String(dev.device_id))}
          </small>
        </span>
        <span class="corporate-device-badge">${isSelected ? "Active" : "Select"}</span>
      `;

      btn.addEventListener("click", () => {
        $("#navCompare").attr("href", `/compare/${dev.device_id}`);
        selectDevice(dev);
      });

      locationListEl.appendChild(btn);
    });

    if (preserveScroll && typeof locationListEl.scrollTop === "number") {
      locationListEl.scrollTop = prevScroll;
    }

    updateMascotVisibility();
  }

  function escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function selectDevice(dev) {
    if (!dev) return;
    currentDeviceId = dev.device_id;
    window.device_id = dev.device_id;
    window.currentDeviceId = dev.device_id;

    if (currentZoneNameEl) {
      currentZoneNameEl.textContent = dev.device_name;
    }

    // Update selection highlight in DOM without losing scroll position
    if (locationListEl) {
      const items = locationListEl.querySelectorAll(".corporate-location");
      items.forEach((item) => {
        const isSelected = item.getAttribute("data-device-id") === String(dev.device_id);
        item.classList.toggle("is-active", isSelected);
        item.setAttribute("aria-selected", isSelected ? "true" : "false");
        const badge = item.querySelector(".corporate-device-badge");
        if (badge) badge.textContent = isSelected ? "Active" : "Select";
      });
    }

    showToast(`Switching to: ${dev.device_name} (ID: ${dev.device_id})`);

    // If device is flagged offline, reflect immediately
    if (dev.offline) {
      if (statusDot) {
        statusDot.style.backgroundColor = "#64748b";
        statusDot.style.boxShadow = "none";
      }
      if (monitoringStatus) {
        monitoringStatus.textContent = "Offline";
      }
      if (indoorConditionEl) {
        indoorConditionEl.textContent = "Offline";
        indoorConditionEl.style.color = "#94a3b8";
      }
    }

    // Fetch live device data immediately with force=true to abort old pending request and show latest data
    if (!window.isCockpitTestMode) {
      if (typeof window.getRealTimeData === "function") {
        window.getRealTimeData(true);
      }
      if (typeof WeatherService !== "undefined" && typeof WeatherService.fetchWeatherData === "function") {
        WeatherService.fetchWeatherData(true);
      }
    }
  }

  function initLocationControls() {
    // Expandable Search: click magnifying glass icon to expand & focus with animation
    if (deviceSearchTrigger && deviceSearchBox && deviceSearchInput) {
      deviceSearchTrigger.addEventListener("click", (e) => {
        e.stopPropagation();
        const isExpanded = deviceSearchBox.classList.contains("is-expanded");
        if (!isExpanded) {
          deviceSearchBox.classList.add("is-expanded");
          if (typeof deviceSearchInput.focus === "function") {
            deviceSearchInput.focus();
          }
        } else {
          // If already expanded and empty, toggle collapse
          if (!searchKeyword.trim()) {
            clearSearch();
          } else if (typeof deviceSearchInput.focus === "function") {
            deviceSearchInput.focus();
          }
        }
      });
    }

    // Real-time filtering as text is typed
    if (deviceSearchInput) {
      deviceSearchInput.addEventListener("input", (e) => {
        searchKeyword = e.target.value;
        filterAndRenderDevices();
      });

      // Collapse on Escape
      deviceSearchInput.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          clearSearch();
        }
      });
    }

    // Close button (×): clear & collapse search
    if (deviceSearchClear) {
      deviceSearchClear.addEventListener("click", (e) => {
        e.stopPropagation();
        clearSearch();
      });
    }

    // Collapse when clicking outside if input is empty
    document.addEventListener("click", (e) => {
      if (deviceSearchBox && deviceSearchBox.classList.contains("is-expanded")) {
        if (!deviceSearchBox.contains(e.target) && !searchKeyword.trim()) {
          deviceSearchBox.classList.remove("is-expanded");
        }
      }
    });
  }

  function clearSearch() {
    searchKeyword = "";
    if (deviceSearchInput) {
      deviceSearchInput.value = "";
    }
    if (deviceSearchBox) {
      deviceSearchBox.classList.remove("is-expanded");
    }
    filterAndRenderDevices();
  }

  // =========================================================================
  // Real-Time Sensor Data Ingestion & Cockpit Updates
  // =========================================================================
  const OFFLINE_THRESHOLD_MS = 15 * 60 * 1000; // 15 minutes threshold for offline status
  let lastSuccessfulDataReceivedTime = Date.now();
  let currentSensorData = null;

  // Schema Normalization & Direct Telemetry Extractor (from stats[0] or root)
  function normalizePayload(raw) {
    if (window.CockpitAPI && typeof window.CockpitAPI.normalizePayload === "function") {
      return window.CockpitAPI.normalizePayload(raw);
    }
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
    return p;
  }

  function ingestSensorPayload(rawPayload) {
    if (!rawPayload) return;
    const payload = normalizePayload(rawPayload);
    currentSensorData = payload;
    window.lastSensorPayload = payload;
    lastSuccessfulDataReceivedTime = Date.now();

    if (typeof WeatherService !== "undefined" && typeof WeatherService.updateFromSensor === "function") {
      WeatherService.updateFromSensor(payload);
    }

    // 1. Device identification & location sync
    const devId = payload.device_id || payload.id;
    const locName = payload.indoor_device_name || payload.name || payload.location;

    if (devId) {
      currentDeviceId = String(devId);
      window.device_id = String(devId);
      window.currentDeviceId = String(devId);
    }

    // Determine Offline Status:
    // Only zero out displays when explicitly offline AND no live stats exist
    let isDeviceOffline = false;
    let offlineReason = "";

    if (payload.offline === true && !payload.hasLiveStats) {
      isDeviceOffline = true;
      offlineReason = "Device Offline";
    }

    // Synchronize offline status with devices in allDevices list (for indicator dot)
    const isDeviceOffStatus = (payload.offline === true) ||
      (payload.device_status && ["off", "offline"].includes(String(payload.device_status).toLowerCase()));

    if (devId && Array.isArray(allDevices)) {
      const devObj = allDevices.find((d) => String(d.device_id) === String(devId));
      if (devObj) {
        devObj.offline = isDeviceOffStatus;
      }
    }

    // If device exists in device_list, use its name; otherwise fallback to payload's indoor_device_name
    let displayLocationName = locName;
    if (devId && allDevices.length > 0) {
      const match = allDevices.find((d) => String(d.device_id) === String(devId));
      if (match) {
        displayLocationName = match.device_name;
      }
    }
    if (displayLocationName && currentZoneNameEl) {
      currentZoneNameEl.textContent = displayLocationName;
    }

    // Update Indoor Last Updated Timestamp display
    const rawTime = payload.timestamp || payload.time || payload.created_on;
    let dataTimestamp = null;
    if (rawTime) {
      if (typeof rawTime === "number") {
        dataTimestamp = rawTime > 1e11 ? rawTime : rawTime * 1000;
      } else if (typeof rawTime === "string") {
        const parsed = Date.parse(rawTime);
        if (!isNaN(parsed)) {
          dataTimestamp = parsed;
        } else if (rawTime.includes(" ")) {
          const reParsed = Date.parse(rawTime.replace(" ", "T"));
          if (!isNaN(reParsed)) dataTimestamp = reParsed;
        }
      }
    }

    const updateTargetDate = dataTimestamp ? new Date(dataTimestamp) : new Date(lastSuccessfulDataReceivedTime || Date.now());
    const timeTarget = indoorLastUpdatedTimeEl || document.getElementById("indoorLastUpdatedTime");
    if (timeTarget) {
      timeTarget.textContent = updateTargetDate.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true
      });
      timeTarget.setAttribute("datetime", updateTargetDate.toISOString());
    }

    // Update active highlight in locations panel
    filterAndRenderDevices();

    // 2. Direct Extraction of values (no long fallback chains)
    let rawIndoorAqi = payload.aqi !== undefined ? payload.aqi : 0;
    let indoorAqiVal = (rawIndoorAqi !== null && !isNaN(rawIndoorAqi)) ? rawIndoorAqi : 0;

    let outdoorAqiVal = payload.outdoor_aqi !== undefined ? payload.outdoor_aqi : 0;
    if (!outdoorAqiVal || outdoorAqiVal <= 0) {
      const aqiEl = document.getElementById("outdoorAqiValue");
      if (aqiEl && aqiEl.textContent) {
        outdoorAqiVal = parseFloat(aqiEl.textContent.trim()) || 0;
      }
    }

    let rawPm25 = payload.pm2d5 !== undefined ? payload.pm2d5 : 0;
    let pm25Val = (rawPm25 !== null && !isNaN(rawPm25)) ? rawPm25 : 0;

    // When device is truly offline with no stats, enforce all indoor parameters to zero
    if (isDeviceOffline) {
      indoorAqiVal = 0;
      rawIndoorAqi = 0;
      pm25Val = 0;
      rawPm25 = 0;
    }

    // Check if indoor AQI or PM2.5 are validly present
    const hasIndoorAqi = rawIndoorAqi !== null && !isNaN(rawIndoorAqi) && rawIndoorAqi > 0;
    const hasIndoorPm25 = rawPm25 !== null && !isNaN(rawPm25) && rawPm25 >= 0;

    let outdoorPm25Val = payload.outdoor_pm2_5 !== undefined ? payload.outdoor_pm2_5 : (payload.outdoor_pm2d5 || 0);
    const outdoorPm10Val = payload.outdoor_pm1d0 !== undefined ? payload.outdoor_pm1d0 : (payload.outdoor_pm10 || 0);

    // Fallback: If outdoor PM2.5 is not provided (> 0), predict it from Outdoor AQI
    let isOutdoorPm25Predicted = false;
    if ((!outdoorPm25Val || outdoorPm25Val <= 0 || isNaN(outdoorPm25Val)) && outdoorAqiVal > 0) {
      outdoorPm25Val = predictPm25FromAqi(outdoorAqiVal);
      isOutdoorPm25Predicted = true;
    }

    // 3. Validate values against parameters object
    const indoorAqiInfo = validateParam("indoor_aqi", indoorAqiVal);
    const outdoorAqiInfo = validateParam("outdoor_aqi", outdoorAqiVal);
    const pm25Info = validateParam("pm2d5", pm25Val);

    // 4. Panel 1: Indoor AQI / PM2.5 Dynamic Display
    // If the cards parameter does not contain "AQI", then Indoor PM2.5 is displayed in place of Indoor AQI.
    const activeCards = (payload && Array.isArray(payload.cards) && payload.cards.length > 0)
      ? payload.cards
      : (Array.isArray(window.cards) && window.cards.length > 0 ? window.cards : DEFAULT_CARDS);
    const hasAqiCard = activeCards.some((c) => String(c).trim().toUpperCase() === "AQI");
    const isIndoorAqiDisabled = !hasAqiCard;

    const effectiveHasIndoorAqi = hasIndoorAqi && !isIndoorAqiDisabled && !isDeviceOffline;
    const showIndoorPm25Instead = (isIndoorAqiDisabled || (!hasIndoorAqi && hasIndoorPm25)) && !isDeviceOffline;

    if (isDeviceOffline) {
      if (indoorTitleEl) indoorTitleEl.textContent = isIndoorAqiDisabled ? "Indoor PM2.5" : "Indoor AQI";
      if (indoorAqiValueEl) indoorAqiValueEl.textContent = "0";
      if (indoorMetricLabelEl) indoorMetricLabelEl.textContent = isIndoorAqiDisabled ? "Indoor PM2.5" : "Air quality index";
      if (indoorAqiSubEl) indoorAqiSubEl.textContent = isIndoorAqiDisabled ? "0 µg/m³" : "0";
      if (indoorConditionEl) {
        indoorConditionEl.textContent = "Offline";
        indoorConditionEl.style.color = "#94a3b8";
      }
    } else if (showIndoorPm25Instead) {
      const formattedPm25 = hasIndoorPm25 ? (pm25Val % 1 === 0 ? pm25Val : pm25Val.toFixed(1)) : "--";
      if (indoorTitleEl) indoorTitleEl.textContent = "Indoor PM2.5";
      if (indoorAqiValueEl) indoorAqiValueEl.textContent = formattedPm25;
      if (indoorMetricLabelEl) indoorMetricLabelEl.textContent = "Indoor PM2.5";
      if (indoorAqiSubEl) indoorAqiSubEl.textContent = hasIndoorPm25 ? `${formattedPm25} µg/m³` : "--";
      if (indoorConditionEl) {
        indoorConditionEl.textContent = hasIndoorPm25 ? pm25Info.caption : "--";
        indoorConditionEl.style.color = hasIndoorPm25 ? pm25Info.color : "";
      }
    } else if (effectiveHasIndoorAqi) {
      if (indoorTitleEl) indoorTitleEl.textContent = "Indoor AQI";
      if (indoorAqiValueEl) indoorAqiValueEl.textContent = Math.round(indoorAqiVal);
      if (indoorMetricLabelEl) indoorMetricLabelEl.textContent = "Air quality index";
      if (indoorAqiSubEl) indoorAqiSubEl.textContent = Math.round(indoorAqiVal);
      if (indoorConditionEl) {
        indoorConditionEl.textContent = indoorAqiInfo.caption;
        indoorConditionEl.style.color = indoorAqiInfo.color;
      }
    } else {
      if (indoorTitleEl) indoorTitleEl.textContent = isIndoorAqiDisabled ? "Indoor PM2.5" : "Indoor AQI";
      if (indoorAqiValueEl) indoorAqiValueEl.textContent = "--";
      if (indoorMetricLabelEl) indoorMetricLabelEl.textContent = isIndoorAqiDisabled ? "Indoor PM2.5" : "Air quality index";
      if (indoorAqiSubEl) indoorAqiSubEl.textContent = "--";
      if (indoorConditionEl) {
        indoorConditionEl.textContent = "--";
        indoorConditionEl.style.color = "";
      }
    }

    // 5. Panel 2: Outdoor AQI & Gauge
    if (outdoorAqiValueEl) outdoorAqiValueEl.textContent = Math.round(outdoorAqiVal);
    if (outdoorConditionEl) {
      outdoorConditionEl.textContent = outdoorAqiInfo.caption;
      outdoorConditionEl.style.color = outdoorAqiInfo.color;
    }
    // Find the element by either ID (outdoorPm25 or outdoor_pm2_5)
    const pm25TargetEl = document.getElementById("outdoorPm25")
      || document.getElementById("outdoor_pm2_5")
      || document.getElementById("outdoor_pm25");

    if (pm25TargetEl && outdoorPm25Val > 0) {
      pm25TargetEl.textContent = outdoorPm25Val % 1 === 0 ? outdoorPm25Val : outdoorPm25Val.toFixed(1);
      if (isOutdoorPm25Predicted) {
        pm25TargetEl.setAttribute("title", "Predicted from Outdoor AQI (CPCB formula)");
      }
    }
    if (outdoorPm10El) {
      outdoorPm10El.textContent = outdoorPm10Val % 1 === 0 ? outdoorPm10Val : outdoorPm10Val.toFixed(1);
    }
    if (outdoorStationEl) {
      if (payload.outdoor_station_name) {
        const rawStation = String(payload.outdoor_station_name)
          .replace(/\s*[-·]\s*1-h\s*avg\s*$/i, "")
          .replace(/\s*1-h\s*avg\s*$/i, "")
          .trim();
        outdoorStationEl.textContent = `${rawStation} · 1-h avg`;
      } else {
        outdoorStationEl.textContent = "Outdoor reference · 1-h avg";
      }
    }

    // Panel 2: AQI Reduction (Disappears if Indoor >= Outdoor, supports PM2.5 fallback, hidden if offline)
    const outdoorReductionBox = document.getElementById("outdoorReductionBox");
    const outdoorAqiReductionValEl = document.getElementById("outdoorAqiReductionVal");
    const outNum = parseFloat(outdoorAqiVal);
    const inNum = parseFloat(indoorAqiVal);

    if (outdoorReductionBox) {
      if (isDeviceOffline) {
        outdoorReductionBox.style.setProperty("display", "none", "important");
        outdoorReductionBox.classList.add("is-hidden");
      } else if (effectiveHasIndoorAqi && !isNaN(outNum) && !isNaN(inNum) && outNum > 0 && inNum > 0 && inNum < outNum) {
        // Condition 1: When Indoor AQI is available and strictly less than Outdoor AQI
        const aqiReductionPct = Math.round(((outNum - inNum) / outNum) * 100);
        const aqiDiff = Math.round(outNum - inNum);
        if (outdoorAqiReductionValEl) {
          outdoorAqiReductionValEl.textContent = `${aqiReductionPct}%`;
          outdoorAqiReductionValEl.setAttribute(
            "title",
            `Outdoor AQI: ${Math.round(outNum)} → Indoor AQI: ${Math.round(inNum)} (${aqiDiff} pts cleaner indoor)`
          );
        }
        outdoorReductionBox.style.setProperty("display", "flex", "important");
        outdoorReductionBox.classList.remove("is-hidden");
      } else if (!effectiveHasIndoorAqi && hasIndoorPm25 && outdoorPm25Val > 0 && pm25Val > 0 && pm25Val < outdoorPm25Val) {
        // Condition 2: Fallback when Indoor AQI is absent or disabled but PM2.5 is cleaner indoor than outdoor
        const pmDiff = (outdoorPm25Val - pm25Val).toFixed(1);
        const pmReductionPct = Math.round(((outdoorPm25Val - pm25Val) / outdoorPm25Val) * 100);
        if (outdoorAqiReductionValEl) {
          outdoorAqiReductionValEl.textContent = `${pmReductionPct}%`;
          outdoorAqiReductionValEl.setAttribute(
            "title",
            `Outdoor PM2.5: ${outdoorPm25Val} → Indoor PM2.5: ${pm25Val} (${pmDiff} µg/m³ cleaner indoor)`
          );
        }
        outdoorReductionBox.style.setProperty("display", "flex", "important");
        outdoorReductionBox.classList.remove("is-hidden");
      } else {
        // If Indoor >= Outdoor, disappear the reduction card
        outdoorReductionBox.style.setProperty("display", "none", "important");
        outdoorReductionBox.classList.add("is-hidden");
      }
    }

    // Outdoor Gauge Arc & Needle
    const clampedOutAqi = Math.max(0, Math.min(500, outdoorAqiVal));
    if (gaugeArc) {
      gaugeArc.setAttribute("stroke-dasharray", `${clampedOutAqi} 500`);
      gaugeArc.style.stroke = outdoorAqiInfo.color;
    }
    if (gaugeNeedle) {
      const deg = (clampedOutAqi / 500) * 180;
      gaugeNeedle.style.transform = `rotate(${deg}deg)`;
    }

    // 6. Panel 3: PM2.5 & Air Elements
    if (pm25DisplayEl) {
      if (isDeviceOffline) {
        pm25DisplayEl.textContent = "0 µg/m³";
      } else {
        const displayPm25 = pm25Val % 1 === 0 ? pm25Val : pm25Val.toFixed(1);
        pm25DisplayEl.textContent = `${displayPm25} µg/m³`;
      }
    }
    if (pm25CatLabelEl) {
      if (isDeviceOffline) {
        pm25CatLabelEl.textContent = "Offline";
        pm25CatLabelEl.style.color = "#94a3b8";
      } else {
        pm25CatLabelEl.textContent = pm25Info.caption;
        pm25CatLabelEl.style.color = pm25Info.color;
      }
    }

    // Render Dynamic Tubes for active cards
    if (Array.isArray(payload.cards) && payload.cards.length > 0) {
      window.cards = payload.cards.slice();
    }
    renderDynamicTubes(getActiveCards(), payload);

    // 7. Panel 5: Purification Impact & Reduction
    const aqiRed = reductionPct(outdoorAqiVal, indoorAqiVal);
    const pmRed = reductionPct(outdoorPm25Val, pm25Val);

    if (aqiReductionEl) aqiReductionEl.textContent = `${aqiRed}%`;
    if (pmReductionEl) pmReductionEl.textContent = `${pmRed}%`;

    const filtrationNoticeEl = document.getElementById("filtrationNotice");
    if (filtrationNoticeEl) {
      filtrationNoticeEl.textContent = isOutdoorPm25Predicted
        ? "Effective filtration · est. from AQI"
        : "Effective filtration · live";
    }

    if (ringAqiArc) {
      const aqiOffset = RING_CIRCUMFERENCE * (1 - aqiRed / 100);
      ringAqiArc.style.strokeDashoffset = aqiOffset.toFixed(2);
    }
    if (ringPmArc) {
      const pmOffset = RING_CIRCUMFERENCE * (1 - pmRed / 100);
      ringPmArc.style.strokeDashoffset = pmOffset.toFixed(2);
    }

    // 8. Header Device Status Indicator
    const activeColor = hasIndoorAqi ? indoorAqiInfo.color : (hasIndoorPm25 ? pm25Info.color : "#64748b");
    if (statusDot) {
      statusDot.style.backgroundColor = isDeviceOffline ? "#64748b" : activeColor;
      statusDot.style.boxShadow = isDeviceOffline ? "none" : `0 0 10px ${activeColor}`;
    }
    if (monitoringStatus) {
      monitoringStatus.textContent = isDeviceOffline ? (offlineReason || "Offline") : "Live monitoring";
    }
  }

  // --- Dark / Light Theme System ---
  const THEME_STORAGE_KEY = "intelligreen_cockpit_theme_v2";

  function getPreferredTheme() {
    const urlParams = new URLSearchParams(window.location.search);
    const urlTheme = urlParams.get("theme");
    if (urlTheme === "dark" || urlTheme === "light") return urlTheme;
    const htmlTheme = document.documentElement.getAttribute("data-theme");
    if (htmlTheme === "dark" || htmlTheme === "light") return htmlTheme;
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved === "dark" || saved === "light") return saved;
    } catch (e) { }
    return "light";
  }

  function applyTheme(theme, save = false) {
    const isDark = theme === "dark";
    const mode = isDark ? "dark" : "light";

    document.documentElement.setAttribute("data-theme", mode);
    document.body.setAttribute("data-theme", mode);

    const cockpitEl = document.getElementById("cockpit");
    if (cockpitEl) {
      if (isDark) {
        cockpitEl.classList.add("corporate-dark");
        cockpitEl.classList.remove("corporate-light");
      } else {
        cockpitEl.classList.add("corporate-light");
        cockpitEl.classList.remove("corporate-dark");
      }
    }

    if (themeIconSun && themeIconMoon) {
      themeIconMoon.style.display = isDark ? "inline-block" : "none";
      themeIconSun.style.display = isDark ? "none" : "inline-block";
    }

    if (themeToggleText) {
      themeToggleText.textContent = isDark ? "Dark" : "Light";
    }

    if (themeToggleBtn) {
      themeToggleBtn.setAttribute(
        "title",
        isDark ? "Current: Dark Mode · Click for Light Mode" : "Current: Light Mode · Click for Dark Mode"
      );
    }

    if (save) {
      try {
        localStorage.setItem(THEME_STORAGE_KEY, mode);
      } catch (e) { }
    }
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute("data-theme") || "light";
    const next = current === "dark" ? "light" : "dark";
    applyTheme(next, true);
  }

  // --- Slide-out Navigation Sidebar ---
  const menuToggleBtn = document.getElementById("menuToggleBtn");
  const menuCloseBtn = document.getElementById("menuCloseBtn");
  const menuBackdrop = document.getElementById("menuBackdrop");
  const navSidebar = document.getElementById("navSidebar");

  function openMenu() {
    if (!navSidebar) return;
    navSidebar.classList.add("is-open");
    navSidebar.setAttribute("aria-hidden", "false");
    if (menuBackdrop) menuBackdrop.classList.add("is-open");
    if (menuToggleBtn) menuToggleBtn.setAttribute("aria-expanded", "true");
  }

  function closeMenu() {
    if (!navSidebar) return;
    navSidebar.classList.remove("is-open");
    navSidebar.setAttribute("aria-hidden", "true");
    if (menuBackdrop) menuBackdrop.classList.remove("is-open");
    if (menuToggleBtn) menuToggleBtn.setAttribute("aria-expanded", "false");
  }

  function toggleMenu() {
    if (!navSidebar) return;
    if (navSidebar.classList.contains("is-open")) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  function initMenuControls() {
    if (menuToggleBtn) {
      menuToggleBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleMenu();
      });
    }
    if (menuCloseBtn) menuCloseBtn.addEventListener("click", closeMenu);
    if (menuBackdrop) menuBackdrop.addEventListener("click", closeMenu);

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && navSidebar && navSidebar.classList.contains("is-open")) {
        closeMenu();
      }
    });

    const menuBtns = document.querySelectorAll(".nav-menu-btn");
    menuBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const action = btn.getAttribute("data-action") || btn.textContent.trim();
        document.querySelectorAll(".nav-menu-item").forEach((item) => item.classList.remove("active"));
        const parentItem = btn.closest(".nav-menu-item");
        if (parentItem) parentItem.classList.add("active");
        closeMenu();
        showToast(action === "Dashboard" ? "Dashboard view active" : `Opening ${action}...`);
      });
    });
  }

  // --- Real-Time Polling & WebSocket Handlers ---
  let realtimePollingTimer = null;
  let activeWebSocket = null;

  function startRealtimePolling(url, intervalMs = 25000) {
    if (!url) return;
    stopRealtimePolling();

    const fetchSensor = () => {
      fetch(url)
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json();
        })
        .then((data) => {
          ingestSensorPayload(data);
        })
        .catch((err) => {
          console.warn("[Realtime] Fetch failed:", err.message);
        });
    };

    fetchSensor();
    realtimePollingTimer = setInterval(fetchSensor, Math.max(1000, intervalMs));
    return realtimePollingTimer;
  }

  function stopRealtimePolling() {
    if (realtimePollingTimer) {
      clearInterval(realtimePollingTimer);
      realtimePollingTimer = null;
    }
  }

  function connectWebSocket(wsUrl) {
    if (!wsUrl) return;
    if (activeWebSocket) {
      try { activeWebSocket.close(); } catch (e) { }
    }
    try {
      activeWebSocket = new WebSocket(wsUrl);
      activeWebSocket.onmessage = (event) => {
        try {
          const payload = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
          ingestSensorPayload(payload);
        } catch (e) {
          console.warn("[WebSocket] Parse error:", e);
        }
      };
    } catch (e) {
      console.error("[WebSocket] Connection error:", e);
    }
    return activeWebSocket;
  }

  function disconnectWebSocket() {
    if (activeWebSocket) {
      try { activeWebSocket.close(); } catch (e) { }
      activeWebSocket = null;
    }
  }

  // --- Global Window API ---
  window.updateCockpitData = ingestSensorPayload;
  window.ingestSensorPayload = ingestSensorPayload;
  window.setDeviceList = function (newList) {
    if (Array.isArray(newList)) {
      window.device_list = newList;
      allDevices = newList;
      filterAndRenderDevices();
    }
  };
  window.getDeviceList = () => allDevices;
  window.setCards = function (newCards) {
    if (Array.isArray(newCards) && newCards.length > 0) {
      window.cards = newCards;
      if (currentSensorData) renderDynamicTubes(newCards, currentSensorData);
    }
  };
  window.getCards = getActiveCards;
  window.startRealtimePolling = startRealtimePolling;
  window.stopRealtimePolling = stopRealtimePolling;
  window.connectWebSocket = connectWebSocket;
  window.disconnectWebSocket = disconnectWebSocket;

  window.Cockpit = {
    setData: ingestSensorPayload,
    getData: () => currentSensorData,
    setCards: window.setCards,
    getCards: getActiveCards,
    setDeviceList: window.setDeviceList,
    getDeviceList: window.getDeviceList,
    setTheme: (t) => applyTheme(t, true),
    toggleTheme: toggleTheme,
    getTheme: () => document.documentElement.getAttribute("data-theme") || "light",
    openMenu: openMenu,
    closeMenu: closeMenu,
    toggleMenu: toggleMenu
  };

  // --- Check Embedded Server Data ---
  function checkEmbeddedData() {
    // 1. Django #cockpit-cards
    const cardsEl = document.getElementById("cockpit-cards");
    if (cardsEl && cardsEl.textContent.trim().length > 0) {
      const text = cardsEl.textContent.trim();
      if (!text.startsWith("<!--") && !text.includes("{{")) {
        try {
          const parsed = JSON.parse(text);
          if (Array.isArray(parsed) && parsed.length > 0) window.cards = parsed;
        } catch (e) { }
      }
    }

    // 2. Django #cockpit-data
    const dataEl = document.getElementById("cockpit-data");
    if (dataEl && dataEl.textContent.trim().length > 0) {
      const text = dataEl.textContent.trim();
      if (!text.startsWith("<!--") && !text.includes("{{")) {
        try {
          const parsed = JSON.parse(text);
          if (parsed && typeof parsed === "object") {
            ingestSensorPayload(parsed);
            return true;
          }
        } catch (e) { }
      }
    }

    // 3. window.res or window.sensorData
    if (window.res && typeof window.res === "object") {
      ingestSensorPayload(window.res);
      return true;
    }
    if (window.sensorData && typeof window.sensorData === "object") {
      ingestSensorPayload(window.sensorData);
      return true;
    }

    return false;
  }

  // =========================================================================
  // Public Weather & Wind Conditions API Service (Referenced from api.js)
  // =========================================================================
  const WeatherService = window.WeatherService || (window.CockpitAPI && window.CockpitAPI.WeatherService);

  // --- Initialization ---
  function init() {
    // 1. Theme
    applyTheme(getPreferredTheme());
    if (themeToggleBtn) {
      themeToggleBtn.addEventListener("click", toggleTheme);
    }

    // 2. Navigation Drawer
    initMenuControls();

    // 3. IST Clock
    updateClock();
    setInterval(updateClock, 1000);

    // 4. Panel 1 Scenic Background (Mountain Peak 1 by default, auto-cycles every 20s)
    preloadMountainImages();
    setIndoorLandscape(0, false);
    startLandscapeAutoLoop(20000);
    if (indoorCard) {
      indoorCard.addEventListener("click", () => {
        nextIndoorLandscape();
        startLandscapeAutoLoop(20000);
      });
    }

    // Proactively clean up any inspector elements or classes
    document.body.classList.remove("ui-inspector-mode");
    document.querySelectorAll(".inspector-dimension-badge, .inspector-grid-bar, #ig-test-toolbar").forEach((el) => el.remove());

    // 5. Locations Panel Setup
    initLocationControls();
    initDeviceList();
    if (tileMascotView) {
      tileMascotView.addEventListener("click", () => {
        toggleMascotCharacter();
      });
    }
    updateMascotVisibility();

    // 6. Check & Ingest initial sensor payload
    checkEmbeddedData();

    // 7. Public Weather & Wind Conditions API Service
    WeatherService.fetchWeatherData();
    setInterval(() => WeatherService.fetchWeatherData(), 10 * 60 * 1000);

    // 8. 15-Minute Data Freshness Watchdog
    setInterval(() => {
      const elapsed = Date.now() - lastSuccessfulDataReceivedTime;
      if (elapsed > OFFLINE_THRESHOLD_MS) {
        if (statusDot) {
          statusDot.style.backgroundColor = "#64748b";
          statusDot.style.boxShadow = "none";
        }
        if (monitoringStatus) {
          monitoringStatus.textContent = "Offline (No data > 15m)";
        }
        if (indoorConditionEl) {
          indoorConditionEl.textContent = "Offline";
          indoorConditionEl.style.color = "#94a3b8";
        }
        if (currentDeviceId && Array.isArray(allDevices)) {
          const currentDev = allDevices.find((d) => String(d.device_id) === String(currentDeviceId));
          if (currentDev && !currentDev.offline) {
            currentDev.offline = true;
            filterAndRenderDevices(true);
          }
        }
      }
    }, 30000);

    // 9. Check URL query parameters for test cases (?test=single_monitor, etc.)
    checkUrlTestParam();

    // 10. Initialize Single-Page Test Dock & Live Sliders
    initTestDock();
  }

  // =========================================================================
  // Cockpit Test Suite API: Testing & QA Verification Engine
  // =========================================================================
  const TEST_CASES = {
    default: {
      name: "Default Baseline (6 Monitors, 6 Tubes, Indoor AQI 41, Outdoor AQI 294)",
      devices: [
        { device_id: "6699", device_name: "KNMA", offline: true },
        { device_id: "6851", device_name: "Agoda", offline: false },
        { device_id: "6871", device_name: "Scope Minar", offline: false },
        { device_id: "7701", device_name: "Corporate Boardroom", offline: false },
        { device_id: "7702", device_name: "Executive Suite", offline: false },
        { device_id: "7703", device_name: "Cafeteria Hub", offline: false }
      ],
      cards: ["AQI", "pm2d5", "pm10", "co2", "tvoc", "rh", "temp"],
      payload: {
        device_id: "6699",
        indoor_device_name: "PTI First Floor",
        aqi: 41,
        pm2d5: 24.8,
        pm10: 25.0,
        co2: 730,
        tvoc: 1016,
        rh: 60,
        temp: 25.4,
        outdoor_aqi: 294,
        outdoor_pm2_5: 145.0,
        outdoor_pm10: 260.0,
        outdoor_station_name: "Nehru Nagar, Delhi - DPCC",
        outdoor_temperature: 16,
        weather_condition: "Clear Sky",
        weather_high: 25,
        weather_low: 13,
        wind_speed: 4,
        offline: false,
        cards: ["AQI", "pm2d5", "pm10", "co2", "tvoc", "rh", "temp"]
      }
    },
    indoor_gt_outdoor: {
      name: "Indoor AQI > Outdoor AQI (In: 210 Poor, Out: 55 Satisfactory -> Reduction Box Disappears)",
      devices: [
        { device_id: "6699", device_name: "KNMA", offline: false },
        { device_id: "6851", device_name: "Agoda", offline: false },
        { device_id: "6871", device_name: "Scope Minar", offline: false },
        { device_id: "7701", device_name: "Corporate Boardroom", offline: false },
        { device_id: "7702", device_name: "Executive Suite", offline: false },
        { device_id: "7703", device_name: "Cafeteria Hub", offline: false }
      ],
      cards: ["AQI", "pm2d5", "pm10", "co2", "tvoc", "rh", "temp"],
      payload: {
        device_id: "6699",
        indoor_device_name: "PTI First Floor",
        aqi: 210,
        pm2d5: 110.0,
        pm10: 165.0,
        co2: 950,
        tvoc: 1320,
        rh: 62,
        temp: 25.1,
        outdoor_aqi: 55,
        outdoor_pm2_5: 18.0,
        outdoor_pm10: 42.0,
        outdoor_station_name: "Nehru Nagar, Delhi - DPCC",
        outdoor_temperature: 18,
        weather_condition: "Clear Sky",
        weather_high: 26,
        weather_low: 14,
        wind_speed: 6,
        offline: false,
        cards: ["AQI", "pm2d5", "pm10", "co2", "tvoc", "rh", "temp"]
      }
    },
    indoor_aqi_disabled: {
      name: "Indoor AQI Disabled via cards Parameter (cards does not contain AQI -> Panel 1 shows Indoor PM2.5)",
      devices: [
        { device_id: "6699", device_name: "KNMA", offline: false },
        { device_id: "6851", device_name: "Agoda", offline: false },
        { device_id: "6871", device_name: "Scope Minar", offline: false },
        { device_id: "7701", device_name: "Corporate Boardroom", offline: false },
        { device_id: "7702", device_name: "Executive Suite", offline: false },
        { device_id: "7703", device_name: "Cafeteria Hub", offline: false }
      ],
      cards: ["pm2d5", "pm10", "co2", "tvoc", "rh", "temp"],
      payload: {
        device_id: "6699",
        indoor_device_name: "PTI First Floor",
        aqi: 41,
        pm2d5: 24.8,
        pm10: 25.0,
        co2: 730,
        tvoc: 1016,
        rh: 60,
        temp: 25.4,
        outdoor_aqi: 294,
        outdoor_pm2_5: 145.0,
        outdoor_pm10: 260.0,
        outdoor_station_name: "Nehru Nagar, Delhi - DPCC",
        outdoor_temperature: 16,
        weather_condition: "Clear Sky",
        weather_high: 25,
        weather_low: 13,
        wind_speed: 4,
        offline: false,
        cards: ["pm2d5", "pm10", "co2", "tvoc", "rh", "temp"]
      }
    },
    indoor_disabled_gt_outdoor: {
      name: "Indoor AQI Disabled & PM2.5 > Outdoor (cards does not contain AQI -> Shows PM2.5 in P1, In: 120 vs Out: 35 -> Reduction Disappears)",
      devices: [
        { device_id: "6699", device_name: "KNMA", offline: false },
        { device_id: "6851", device_name: "Agoda", offline: false },
        { device_id: "6871", device_name: "Scope Minar", offline: false },
        { device_id: "7701", device_name: "Corporate Boardroom", offline: false },
        { device_id: "7702", device_name: "Executive Suite", offline: false },
        { device_id: "7703", device_name: "Cafeteria Hub", offline: false }
      ],
      cards: ["pm2d5", "pm10", "co2", "tvoc", "rh", "temp"],
      payload: {
        device_id: "6699",
        indoor_device_name: "PTI First Floor",
        aqi: 210,
        pm2d5: 120.0,
        pm10: 175.0,
        co2: 920,
        tvoc: 1280,
        rh: 58,
        temp: 24.8,
        outdoor_aqi: 75,
        outdoor_pm2_5: 35.0,
        outdoor_pm10: 60.0,
        outdoor_station_name: "Nehru Nagar, Delhi - DPCC",
        outdoor_temperature: 19,
        weather_condition: "Clear Sky",
        weather_high: 27,
        weather_low: 15,
        wind_speed: 5,
        offline: false,
        cards: ["pm2d5", "pm10", "co2", "tvoc", "rh", "temp"]
      }
    },
    single_monitor: {
      name: "Single Active Monitor (Sprout Mascot & Eco Bulb Loop)",
      devices: [
        { device_id: "7701", device_name: "Corporate Boardroom", offline: false }
      ],
      cards: ["AQI", "pm2d5", "pm10", "co2", "tvoc", "rh", "temp"],
      payload: {
        device_id: "7701",
        indoor_device_name: "Corporate Boardroom",
        aqi: 38,
        pm2d5: 18.2,
        pm10: 22.0,
        co2: 680,
        tvoc: 540,
        rh: 55,
        temp: 24.0,
        outdoor_aqi: 280,
        outdoor_pm2_5: 138.0,
        outdoor_pm10: 245.0,
        outdoor_station_name: "Anand Vihar, Delhi - DPCC",
        outdoor_temperature: 18,
        weather_condition: "Clear Sky",
        weather_high: 26,
        weather_low: 14,
        wind_speed: 5,
        offline: false,
        cards: ["AQI", "pm2d5", "pm10", "co2", "tvoc", "rh", "temp"]
      }
    },
    multiple_tubes: {
      name: "Multiple Test Tubes (10 Dynamic Air Elements: PM2.5, PM10, CO2, TVOC, RH, Temp, HCHO, Ozone, NO2, CO)",
      devices: [
        { device_id: "6699", device_name: "KNMA", offline: true },
        { device_id: "6851", device_name: "Agoda", offline: false },
        { device_id: "6871", device_name: "Scope Minar", offline: false },
        { device_id: "7701", device_name: "Corporate Boardroom", offline: false },
        { device_id: "7702", device_name: "Executive Suite", offline: false },
        { device_id: "7703", device_name: "Cafeteria Hub", offline: false }
      ],
      cards: ["AQI", "pm2d5", "pm10", "co2", "tvoc", "rh", "temp", "hcho", "ozone", "no2", "co"],
      payload: {
        device_id: "6699",
        indoor_device_name: "Advanced R&D Clean Lab",
        aqi: 32,
        pm2d5: 14.5,
        pm10: 18.0,
        co2: 590,
        tvoc: 420,
        rh: 52,
        temp: 23.8,
        hcho: 0.03,
        ozone: 28,
        no2: 19,
        co: 0.6,
        outdoor_aqi: 310,
        outdoor_pm2_5: 160.0,
        outdoor_pm10: 280.0,
        outdoor_station_name: "Nehru Nagar, Delhi - DPCC",
        outdoor_temperature: 17,
        weather_condition: "Haze",
        weather_high: 25,
        weather_low: 13,
        wind_speed: 3,
        offline: false,
        cards: ["AQI", "pm2d5", "pm10", "co2", "tvoc", "rh", "temp", "hcho", "ozone", "no2", "co"]
      }
    },
    single_monitor_multiple_tubes: {
      name: "Single Monitor + Multiple Test Tubes (1 Monitor + 10 Tubes)",
      devices: [
        { device_id: "9901", device_name: "Executive Suite", offline: false }
      ],
      cards: ["AQI", "pm2d5", "pm10", "co2", "tvoc", "rh", "temp", "hcho", "ozone", "no2", "co"],
      payload: {
        device_id: "9901",
        indoor_device_name: "Executive Suite",
        aqi: 25,
        pm2d5: 11.2,
        pm10: 15.0,
        co2: 510,
        tvoc: 310,
        rh: 48,
        temp: 22.5,
        hcho: 0.02,
        ozone: 22,
        no2: 15,
        co: 0.4,
        outdoor_aqi: 285,
        outdoor_pm2_5: 140.0,
        outdoor_pm10: 250.0,
        outdoor_station_name: "Mandir Marg, Delhi",
        outdoor_temperature: 19,
        weather_condition: "Clear Sky",
        weather_high: 27,
        weather_low: 15,
        wind_speed: 6,
        offline: false,
        cards: ["AQI", "pm2d5", "pm10", "co2", "tvoc", "rh", "temp", "hcho", "ozone", "no2", "co"]
      }
    },
    offline: {
      name: "Offline Monitor (Device status offline with grey indicators)",
      devices: [
        { device_id: "6699", device_name: "KNMA", offline: true },
        { device_id: "6851", device_name: "Agoda", offline: false },
        { device_id: "6871", device_name: "Scope Minar", offline: false },
        { device_id: "7701", device_name: "Corporate Boardroom", offline: false },
        { device_id: "7702", device_name: "Executive Suite", offline: false },
        { device_id: "7703", device_name: "Cafeteria Hub", offline: false }
      ],
      cards: ["AQI", "pm2d5", "pm10", "co2", "tvoc", "rh", "temp"],
      payload: {
        device_id: "6699",
        indoor_device_name: "PTI First Floor",
        aqi: 0,
        pm2d5: 0,
        pm10: 0,
        co2: 0,
        tvoc: 0,
        rh: 0,
        temp: 0,
        outdoor_aqi: 294,
        outdoor_pm2_5: 145.0,
        outdoor_pm10: 260.0,
        outdoor_station_name: "Nehru Nagar, Delhi - DPCC",
        outdoor_temperature: 16,
        weather_condition: "Clear Sky",
        weather_high: 25,
        weather_low: 13,
        wind_speed: 4,
        offline: true,
        device_status: "offline",
        cards: ["AQI", "pm2d5", "pm10", "co2", "tvoc", "rh", "temp"]
      }
    },
    severe: {
      name: "Severe Pollution (Outdoor AQI 445 Severe, Indoor AQI 85 Moderate)",
      devices: [
        { device_id: "6699", device_name: "KNMA", offline: false },
        { device_id: "6851", device_name: "Agoda", offline: false },
        { device_id: "6871", device_name: "Scope Minar", offline: false },
        { device_id: "7701", device_name: "Corporate Boardroom", offline: false },
        { device_id: "7702", device_name: "Executive Suite", offline: false },
        { device_id: "7703", device_name: "Cafeteria Hub", offline: false }
      ],
      cards: ["AQI", "pm2d5", "pm10", "co2", "tvoc", "rh", "temp"],
      payload: {
        device_id: "6699",
        indoor_device_name: "PTI First Floor",
        aqi: 85,
        pm2d5: 55.4,
        pm10: 82.0,
        co2: 890,
        tvoc: 1450,
        rh: 65,
        temp: 26.2,
        outdoor_aqi: 445,
        outdoor_pm2_5: 320.0,
        outdoor_pm10: 480.0,
        outdoor_station_name: "Jahangirpuri, Delhi - DPCC",
        outdoor_temperature: 14,
        weather_condition: "Dense Smog",
        weather_high: 22,
        weather_low: 11,
        wind_speed: 1,
        offline: false,
        cards: ["AQI", "pm2d5", "pm10", "co2", "tvoc", "rh", "temp"]
      }
    },
    good_air: {
      name: "Clean Alpine Air (In: 18 Good, Out: 32 Good)",
      devices: [
        { device_id: "6699", device_name: "KNMA", offline: false },
        { device_id: "6851", device_name: "Agoda", offline: false },
        { device_id: "6871", device_name: "Scope Minar", offline: false },
        { device_id: "7701", device_name: "Corporate Boardroom", offline: false },
        { device_id: "7702", device_name: "Executive Suite", offline: false },
        { device_id: "7703", device_name: "Cafeteria Hub", offline: false }
      ],
      cards: ["AQI", "pm2d5", "pm10", "co2", "tvoc", "rh", "temp"],
      payload: {
        device_id: "6699",
        indoor_device_name: "PTI First Floor",
        aqi: 18,
        pm2d5: 8.5,
        pm10: 12.0,
        co2: 460,
        tvoc: 210,
        rh: 48,
        temp: 22.0,
        outdoor_aqi: 32,
        outdoor_pm2_5: 14.0,
        outdoor_pm10: 22.0,
        outdoor_station_name: "Nehru Nagar, Delhi - DPCC",
        outdoor_temperature: 20,
        weather_condition: "Clear Sky",
        weather_high: 25,
        weather_low: 15,
        wind_speed: 7,
        offline: false,
        cards: ["AQI", "pm2d5", "pm10", "co2", "tvoc", "rh", "temp"]
      }
    }
  };

  function runTestCase(name) {
    const tc = TEST_CASES[name] || TEST_CASES.default;
    console.log(`[Cockpit Test Suite] Running test case: "${tc.name}"`);

    // Manage test mode status: default reverts to live polling; non-default pauses auto-sync
    window.isCockpitTestMode = (name !== "default");

    // Set cards & re-render tubes
    if (Array.isArray(tc.cards)) {
      window.cards = tc.cards.slice();
      if (tc.payload) {
        tc.payload.cards = tc.cards.slice();
      }
    }
    renderTubes(window.cards, tc.payload);

    // Set devices & re-render monitor list
    if (Array.isArray(tc.devices)) {
      setDeviceList(tc.devices);
    }

    // Ingest payload
    if (tc.payload) {
      currentSensorData = Object.assign({}, tc.payload);
      ingestSensorPayload(tc.payload);
      if (window.WeatherService && typeof window.WeatherService.updateFromSensor === "function") {
        window.WeatherService.updateFromSensor(tc.payload);
      }
    }

    // Sync interactive test dock sliders & toggles
    syncSlidersWithCurrentData(tc.payload);

    return {
      status: "success",
      testCase: name,
      description: tc.name,
      applied: tc
    };
  }

  function checkUrlTestParam() {
    try {
      const params = new URLSearchParams(window.location.search);
      const testName = params.get("test");
      if (testName && TEST_CASES[testName]) {
        console.log(`[Cockpit Test Suite] Auto-executing test case from URL: ?test=${testName}`);
        runTestCase(testName);
      }
    } catch (e) {
      console.warn("Could not check URL test parameter:", e);
    }
  }

  function syncSlidersWithCurrentData(data) {
    if (!data) return;
    const sInAqi = document.getElementById("sliderIndoorAqi");
    const bInAqi = document.getElementById("badgeIndoorAqi");
    if (sInAqi && bInAqi && typeof data.aqi !== "undefined") {
      sInAqi.value = data.aqi;
      bInAqi.textContent = data.aqi;
    }

    const sOutAqi = document.getElementById("sliderOutdoorAqi");
    const bOutAqi = document.getElementById("badgeOutdoorAqi");
    if (sOutAqi && bOutAqi && typeof data.outdoor_aqi !== "undefined") {
      sOutAqi.value = data.outdoor_aqi;
      bOutAqi.textContent = data.outdoor_aqi;
    }

    const sInPm25 = document.getElementById("sliderIndoorPm25");
    const bInPm25 = document.getElementById("badgeIndoorPm25");
    if (sInPm25 && bInPm25 && typeof data.pm2d5 !== "undefined") {
      sInPm25.value = data.pm2d5;
      bInPm25.textContent = data.pm2d5;
    }

    const sOutPm25 = document.getElementById("sliderOutdoorPm25");
    const bOutPm25 = document.getElementById("badgeOutdoorPm25");
    if (sOutPm25 && bOutPm25 && typeof data.outdoor_pm2_5 !== "undefined") {
      sOutPm25.value = data.outdoor_pm2_5;
      bOutPm25.textContent = data.outdoor_pm2_5;
    }

    const sCo2 = document.getElementById("sliderCo2");
    const bCo2 = document.getElementById("badgeCo2");
    if (sCo2 && bCo2 && typeof data.co2 !== "undefined") {
      sCo2.value = data.co2;
      bCo2.textContent = data.co2;
    }

    const sTemp = document.getElementById("sliderTemp");
    const bTemp = document.getElementById("badgeTemp");
    if (sTemp && bTemp && typeof data.outdoor_temperature !== "undefined") {
      sTemp.value = data.outdoor_temperature;
      bTemp.textContent = `${data.outdoor_temperature}°C`;
    }

    const sWind = document.getElementById("sliderWind");
    const bWind = document.getElementById("badgeWind");
    if (sWind && bWind && typeof data.wind_speed !== "undefined") {
      sWind.value = data.wind_speed;
      bWind.textContent = `${data.wind_speed} km/h`;
    }

    const tDis = document.getElementById("toggleIndoorAqiDisabled");
    if (tDis) {
      const activeCards = (currentSensorData && Array.isArray(currentSensorData.cards))
        ? currentSensorData.cards
        : (Array.isArray(window.cards) ? window.cards : DEFAULT_CARDS);
      tDis.checked = !activeCards.some((c) => String(c).trim().toUpperCase() === "AQI");
    }

    const tOff = document.getElementById("toggleOffline");
    if (tOff) {
      tOff.checked = Boolean(data.offline);
    }

    const tTen = document.getElementById("toggleTenTubes");
    if (tTen) {
      tTen.checked = (Array.isArray(window.cards) && window.cards.length > 6);
    }
  }

  function initTestDock() {
    const dock = document.getElementById("cockpitTestDock");
    const toggleBtn = document.getElementById("testDockToggle");
    const closeBtn = document.getElementById("testDockClose");
    if (!dock) return;

    if (toggleBtn) {
      toggleBtn.addEventListener("click", () => {
        dock.classList.add("is-open");
        syncSlidersWithCurrentData(currentSensorData || TEST_CASES.default.payload);
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        dock.classList.remove("is-open");
      });
    }

    // Preset Buttons
    dock.querySelectorAll(".test-preset-btn[data-test]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const testId = btn.getAttribute("data-test");
        dock.querySelectorAll(".test-preset-btn[data-test]").forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");
        runTestCase(testId);
      });
    });

    // Reset Button
    const btnReset = document.getElementById("btnResetTest");
    if (btnReset) {
      btnReset.addEventListener("click", () => {
        window.isCockpitTestMode = false;
        dock.querySelectorAll(".test-preset-btn[data-test]").forEach((b) => b.classList.remove("is-active"));
        const defBtn = dock.querySelector('.test-preset-btn[data-test="default"]');
        if (defBtn) defBtn.classList.add("is-active");
        runTestCase("default");
      });
    }

    // Sliders
    function attachSlider(id, badgeId, prop, unit = "", onWeather = false) {
      const slider = document.getElementById(id);
      const badge = document.getElementById(badgeId);
      if (!slider || !badge) return;

      slider.addEventListener("input", (e) => {
        window.isCockpitTestMode = true;
        const val = parseFloat(e.target.value);
        badge.textContent = `${val}${unit ? " " + unit : ""}`;
        if (!currentSensorData) currentSensorData = Object.assign({}, TEST_CASES.default.payload);
        currentSensorData[prop] = val;
        ingestSensorPayload(currentSensorData);
        if (onWeather && window.WeatherService && typeof window.WeatherService.updateFromSensor === "function") {
          window.WeatherService.updateFromSensor(currentSensorData);
        }
      });
    }

    attachSlider("sliderIndoorAqi", "badgeIndoorAqi", "aqi");
    attachSlider("sliderOutdoorAqi", "badgeOutdoorAqi", "outdoor_aqi");
    attachSlider("sliderIndoorPm25", "badgeIndoorPm25", "pm2d5");
    attachSlider("sliderOutdoorPm25", "badgeOutdoorPm25", "outdoor_pm2_5");
    attachSlider("sliderCo2", "badgeCo2", "co2", "ppm");
    attachSlider("sliderTemp", "badgeTemp", "outdoor_temperature", "°C", true);
    attachSlider("sliderWind", "badgeWind", "wind_speed", "km/h", true);

    // Feature Toggles
    const toggleDisabled = document.getElementById("toggleIndoorAqiDisabled");
    if (toggleDisabled) {
      toggleDisabled.addEventListener("change", (e) => {
        window.isCockpitTestMode = true;
        const shouldDisableAqi = e.target.checked;
        let cList = (Array.isArray(window.cards) && window.cards.length > 0)
          ? window.cards.slice()
          : DEFAULT_CARDS.slice();

        if (shouldDisableAqi) {
          cList = cList.filter((c) => String(c).trim().toUpperCase() !== "AQI");
        } else {
          if (!cList.some((c) => String(c).trim().toUpperCase() === "AQI")) {
            cList.unshift("AQI");
          }
        }
        window.cards = cList;
        if (currentSensorData) {
          currentSensorData.cards = cList.slice();
          ingestSensorPayload(currentSensorData);
        }
      });
    }

    const toggleTen = document.getElementById("toggleTenTubes");
    if (toggleTen) {
      toggleTen.addEventListener("change", (e) => {
        window.isCockpitTestMode = true;
        const hasAqi = Array.isArray(window.cards) && window.cards.some((c) => String(c).trim().toUpperCase() === "AQI");
        const aqiPrefix = hasAqi ? ["AQI"] : [];
        if (e.target.checked) {
          window.cards = aqiPrefix.concat(["pm2d5", "pm10", "co2", "tvoc", "rh", "temp", "hcho", "ozone", "no2", "co"]);
          if (currentSensorData) {
            currentSensorData.hcho = currentSensorData.hcho || 0.03;
            currentSensorData.ozone = currentSensorData.ozone || 28;
            currentSensorData.no2 = currentSensorData.no2 || 19;
            currentSensorData.co = currentSensorData.co || 0.6;
          }
        } else {
          window.cards = aqiPrefix.concat(["pm2d5", "pm10", "co2", "tvoc", "rh", "temp"]);
        }
        if (currentSensorData) {
          currentSensorData.cards = window.cards.slice();
        }
        renderTubes(window.cards, currentSensorData);
        if (currentSensorData) ingestSensorPayload(currentSensorData);
      });
    }

    const toggleOff = document.getElementById("toggleOffline");
    if (toggleOff) {
      toggleOff.addEventListener("change", (e) => {
        window.isCockpitTestMode = true;
        if (currentSensorData) {
          currentSensorData.offline = e.target.checked;
          currentSensorData.device_status = e.target.checked ? "offline" : "online";
          ingestSensorPayload(currentSensorData);
        }
      });
    }
  }

  window.CockpitTesting = {
    listTestCases: () => Object.keys(TEST_CASES).map(k => ({ id: k, name: TEST_CASES[k].name })),
    runTestCase: runTestCase,
    getTestCases: () => TEST_CASES
  };

  // Launch on DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})(); 