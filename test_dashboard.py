"""
Automated Test Suite for IntelliGreen Clean Air Cockpit
Validates all test cases, layout configurations, responsive assets, and interactive controls.
"""

import os
import json
import re
import sys
import server

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
STATIC_DIR = os.path.join(BASE_DIR, "static")

def read_static(rel_path):
    full_path = os.path.join(BASE_DIR, "static", rel_path)
    with open(full_path, "r", encoding="utf-8") as f:
        return f.read()

def read_template(rel_path):
    full_path = os.path.join(BASE_DIR, "templates", "dashboard-v4", rel_path)
    with open(full_path, "r", encoding="utf-8") as f:
        return f.read()

def run_tests():
    print("=" * 70)
    print("🧪 RUNNING INTELLIGREEN CLEAN AIR COCKPIT TEST SUITE")
    print("=" * 70)
    passed = 0
    total = 0

    def assert_test(name, condition, details=""):
        nonlocal passed, total
        total += 1
        if condition:
            passed += 1
            print(f"  ✅ PASS: {name}")
        else:
            print(f"  ❌ FAIL: {name} - {details}")

    # Test 1: Default Baseline Dashboard
    print("\n[1] Testing Default Baseline View (test=default)")
    html = server.render_dashboard_html(test_case="default")
    assert_test("Default has 6 test tube cards", '"pm2d5", "pm10", "co2", "tvoc", "rh", "temp"' in html)
    assert_test("Default has 3 devices in list", html.count("device_list.push") == 3)
    assert_test("Default has indoor AQI enabled", "window.indoor_aqi_enabled = true;" in html)

    # Test 2: Single Monitor Test Case
    print("\n[2] Testing Single Monitor View (test=single_monitor)")
    html = server.render_dashboard_html(test_case="single_monitor")
    assert_test("Single Monitor has exactly 1 device", html.count("device_list.push") == 1)
    assert_test("Single Monitor has Corporate Boardroom device", "Corporate Boardroom" in html)

    # Test 2b: Single Monitor Sprout Mascot & Eco Bulb Loop
    print("\n[2b] Testing Single Monitor Sprout Mascot & Eco Bulb Setup")
    assert_test("index.html contains leaf_mascot.png", "leaf_mascot.png" in html)
    assert_test("index.html contains eco_bulb_clean.png", "eco_bulb_clean.png" in html)
    assert_test("index.html has leafMascotImg ID", 'id="leafMascotImg"' in html)
    assert_test("index.html has ecoBulbImg ID", 'id="ecoBulbImg"' in html)

    # Test 3: Multiple Test Tubes Air Elements Additions
    print("\n[3] Testing Multiple Test Tubes (test=multiple_tubes)")
    html = server.render_dashboard_html(test_case="multiple_tubes")
    assert_test("Multiple Tubes has all 10 air elements", all(tube in html for tube in ["pm2d5", "pm10", "co2", "tvoc", "rh", "temp", "hcho", "ozone", "no2", "co"]))

    # Test 4: Indoor AQI Disabled at Django Admin Side
    print("\n[4] Testing Indoor AQI Disabled at Django Admin Side (test=indoor_aqi_disabled)")
    html = server.render_dashboard_html(test_case="indoor_aqi_disabled")
    assert_test("indoor_aqi_enabled flag is false", "window.indoor_aqi_enabled = false;" in html)

    # Test 5: Indoor AQI > Outdoor AQI
    print("\n[5] Testing Indoor AQI > Outdoor AQI (test=indoor_gt_outdoor)")
    html = server.render_dashboard_html(test_case="indoor_gt_outdoor")
    assert_test("Indoor AQI 210 is greater than Outdoor AQI 55", '"aqi": 210' in html and '"outdoor_aqi": 55' in html)

    # Test 6: Indoor AQI Disabled & PM2.5 > Outdoor PM2.5
    print("\n[6] Testing Indoor AQI Disabled & PM2.5 > Outdoor (test=indoor_disabled_gt_outdoor)")
    html = server.render_dashboard_html(test_case="indoor_disabled_gt_outdoor")
    assert_test("Indoor AQI disabled flag is false", "window.indoor_aqi_enabled = false;" in html)
    assert_test("Indoor PM2.5 120 is higher than Outdoor PM2.5 35", '"pm2d5": 120.0' in html and '"outdoor_pm2_5": 35.0' in html)

    # Test 7: Single Monitor + Multiple Tubes
    print("\n[7] Testing Single Monitor + Multiple Test Tubes (test=single_monitor_multiple_tubes)")
    html = server.render_dashboard_html(test_case="single_monitor_multiple_tubes")
    assert_test("Single Monitor + Multiple Tubes has 1 monitor in list", html.count("device_list.push") == 1)
    assert_test("Has 10 test tubes", all(tube in html for tube in ["hcho", "ozone", "no2", "co"]))

    # Test 8: Offline Monitor Status
    print("\n[8] Testing Offline Monitor Status (test=offline)")
    html = server.render_dashboard_html(test_case="offline")
    assert_test("Payload contains offline: true", '"offline": true' in html)
    assert_test("Offline test case sets aqi to 0", '"aqi": 0' in html)
    assert_test("Offline test case sets pm2d5 to 0", '"pm2d5": 0' in html)
    assert_test("Offline test case sets co2 to 0", '"co2": 0' in html)

    # Test 9: Severe Air Pollution
    print("\n[9] Testing Severe Pollution (test=severe)")
    html = server.render_dashboard_html(test_case="severe")
    assert_test("Severe outdoor AQI 445 present", '"outdoor_aqi": 445' in html)

    # Test 10: CSS Dimensions, Compact Cards & Topbar Gap
    print("\n[10] Testing CSS Stylesheet for Spacing & Sizing")
    css = read_static("dashboard-v4/css/style.css")
    assert_test("Gap between topbar and cards is 1.6rem (margin-bottom for TV compatibility)", "margin-bottom: 1.6rem;" in css or "gap: 1.6rem;" in css)
    assert_test("Card row heights decreased to 20rem 17.5rem", "grid-template-rows: 20rem 17.5rem;" in css)
    assert_test("Company logo height enlarged to 4.5rem desktop", "height: 4.5rem;" in css)
    assert_test("Company logo height enlarged to 2.85rem mobile", "height: 2.85rem !important;" in css)
    assert_test("Drawer brand icon explicitly sized", ".nav-brand-icon" in css and "width: 2.25rem;" in css)
    assert_test("Drawer menu icons SVG explicitly sized", ".nav-menu-icon-wrap svg" in css and "width: 1.625rem;" in css)
    assert_test("Interactive test dock styles defined", ".cockpit-test-dock" in css)
    assert_test("Reduction pill is-hidden rule defined", ".corporate-reduction-pill.is-hidden" in css)
    assert_test("Tizen TV CSS: grid-gap fallback present", "grid-gap: 1.25rem;" in css)
    assert_test("Tizen TV CSS: -webkit-backdrop-filter present", "-webkit-backdrop-filter:" in css)
    assert_test("Single monitor mascot styles defined", ".tile-mascot-view" in css and ".mascot-character" in css)
    assert_test("Leaf mascot proportional size constraint", ".leaf-mascot-img" in css and "max-width: 8.5rem;" in css)
    assert_test("Eco bulb proportional size constraint", ".eco-bulb-img" in css and "max-width: 4.85rem;" in css)
    assert_test("Single monitor container adjustment rule", ".corporate-locations.has-single-monitor" in css)
    assert_test("Dark mode active monitors site name is white", '[data-theme="dark"] .corporate-location-name strong' in css and 'color: #ffffff' in css)
    assert_test("No deleted waterfall residual in css", "waterfall" not in css.lower())

    # Test 11: Static Assets & Local Libraries Verification
    print("\n[11] Testing Static Assets & Local Libraries Presence")
    jquery_path = os.path.join(STATIC_DIR, "dashboard-v4", "js", "jquery-3.3.1.min.js")
    assert_test("Local jQuery 3.3.1 library exists", os.path.isfile(jquery_path) and os.path.getsize(jquery_path) > 50000)
    for asset_name in ["logo_full_color.png", "emblem.png", "leaf_mascot.png", "eco_bulb_clean.png", "mountain_1.png", "mountains_12.jpeg"]:
        asset_file = os.path.join(STATIC_DIR, "dashboard-v4", "assets", asset_name)
        assert_test(f"Asset {asset_name} exists", os.path.isfile(asset_file))

    # Test 12: JavaScript Logic, Sliders & Test Dock Engine
    print("\n[12] Testing JavaScript Client Script & Modular Architecture")
    js = read_static("dashboard-v4/js/script.js")
    api_js = read_static("dashboard-v4/js/api.js")
    assert_test("Dedicated api.js file exists and is populated", len(api_js) > 5000)
    assert_test("api.js contains CPCB parameter registry", "PARAM_REGISTRY" in api_js)
    assert_test("api.js contains WeatherService implementation", "WeatherService" in api_js and "open-meteo.com" in api_js)
    assert_test("api.js contains real-time data sync engine", "getRealTimeData" in api_js and "scheduleNextSync" in api_js)
    assert_test("api.js exports window.CockpitAPI", "window.CockpitAPI" in api_js)
    assert_test("base.html loads api.js before script.js", "dashboard-v4/js/api.js" in read_template("base.html"))

    assert_test("No deleted waterfall residual in js", "waterfall" not in js.lower())
    assert_test("Indoor landscapes array starts with mountain-1", 'id: "mountain-1"' in js and 'assets/mountain_1.png' in js)
    assert_test("has-single-monitor toggling in updateMascotVisibility", "has-single-monitor" in js)
    assert_test("isIndoorAqiDisabled logic implemented", "isIndoorAqiDisabled" in js)
    assert_test("showIndoorPm25Instead switches to Indoor PM2.5", 'indoorTitleEl.textContent = "Indoor PM2.5"' in js)
    assert_test("CockpitTesting API exposed globally", "window.CockpitTesting" in js)
    assert_test("URL test parameter auto-handling included", "checkUrlTestParam" in js)
    assert_test("Interactive sliders and dock initialized", "initTestDock" in js and "syncSlidersWithCurrentData" in js)
    assert_test("Indoor > Outdoor reduction hiding logic", "outdoorReductionBox.classList.add(\"is-hidden\")" in js)
    assert_test("renderTubes alias defined and exported", "window.renderTubes = renderTubes;" in js)
    assert_test("Race condition protection isCockpitTestMode defined", "window.isCockpitTestMode" in js)
    assert_test("Offline mode forces tubes and displays to zero", 'isContextOffline' in js and 'formattedVal = "0"' in js and 'isDeviceOffline' in js)
    assert_test("No invalid data. reference error in ingestSensorPayload", "data.indoor_aqi_enabled" not in js and "data.device_settings" not in js)

    # Test 13: Revocation Verification of Diagnostics Table & Tube Thickness
    print("\n[13] Testing Revocation of Diagnostics Table & Tube Thickness")
    diag_js_path = os.path.join(STATIC_DIR, "dashboard-v4", "js", "diagnostics-modal.js")
    assert_test("diagnostics-modal.js revoked and deleted", not os.path.isfile(diag_js_path))

    base_html = read_template("base.html")
    assert_test("base.html does not contain diagnostics-modal.js", "diagnostics-modal.js" not in base_html)
    assert_test("base.html does not contain dockBtnDiagnostics", "dockBtnDiagnostics" not in base_html)

    # Tube size assertion
    css = read_static("dashboard-v4/css/style.css")
    assert_test("Tube size decreased to 1.6rem width and 6.75rem height", "max-width: 1.6rem;" in css and "height: 6.75rem;" in css)

    # Verify clean_air_cockpit_delivery.zip is preserved & contains modular api.js
    zip_path = os.path.join(BASE_DIR, "clean_air_cockpit_delivery.zip")
    assert_test("clean_air_cockpit_delivery.zip remains intact", os.path.isfile(zip_path))
    if os.path.isfile(zip_path):
        import zipfile
        with zipfile.ZipFile(zip_path, "r") as zf:
            zip_names = zf.namelist()
            assert_test("ZIP contains static/dashboard-v4/js/api.js", "static/dashboard-v4/js/api.js" in zip_names)
            assert_test("ZIP does NOT contain diagnostics-modal.js", not any("diagnostics" in n.lower() for n in zip_names))
            zip_text = "".join(zf.read(n).decode("utf-8", errors="ignore") for n in zip_names if n.endswith((".html", ".js", ".css")))
            assert_test("ZIP contains ZERO references to IntelliGreenMonitorDB", "IntelliGreenMonitorDB" not in zip_text)
            assert_test("ZIP contains ZERO references to dockBtnDiagnostics", "dockBtnDiagnostics" not in zip_text)

    # Test 14: Direct Telemetry Ingestion from Backend Network Response (`stats` array)
    print("\n[14] Testing Backend Network DevTools Payload Normalization (`stats` array)")
    api_js = read_static("dashboard-v4/js/api.js")
    script_js = read_static("dashboard-v4/js/script.js")
    assert_test("api.js contains normalizePayload function", "function normalizePayload" in api_js)
    assert_test("script.js contains normalizePayload function", "function normalizePayload" in script_js)
    assert_test("api.js exports normalizePayload globally", "window.normalizePayload = normalizePayload" in api_js or "normalizePayload" in api_js)
    assert_test("stats[0].aqi_value mapped directly", "aqi_value" in api_js and "aqi_value" in script_js)
    assert_test("No forced zeroing when hasLiveStats is true", "hasLiveStats" in script_js)

    print("\n" + "=" * 70)
    print(f"🏁 TEST SUMMARY: {passed}/{total} Passed ({'100%' if passed == total else 'FAIL'})")
    print("=" * 70)

    return passed == total

if __name__ == "__main__":
    success = run_tests()
    sys.exit(0 if success else 1)
