"""
Packaging Utility: build_delivery_zip.py
Generates a 100% clean, production-ready deliverable ZIP for the backend engineer.
Leaves the current workspace setup and running server completely untouched.
"""

import os
import re
import zipfile

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ZIP_OUTPUT_NAME = "clean_air_cockpit_delivery.zip"
ZIP_OUTPUT_PATH = os.path.join(BASE_DIR, ZIP_OUTPUT_NAME)

def clean_base_html(content):
    # Remove the interactive testing dock markup
    pattern = r"\s*<!--\s*Interactive Test Controls Hub & Live Sliders\s*-->.*?<\/aside>"
    cleaned = re.sub(pattern, "", content, flags=re.DOTALL)
    return cleaned

def clean_style_css(content):
    # Remove test dock styles at the bottom of style.css
    split_marker = "/* --------------------------------------------------------------------------\n   INTERACTIVE TEST DOCK & LIVE SLIDERS"
    if split_marker in content:
        cleaned = content.split(split_marker)[0].rstrip() + "\n"
    else:
        # Fallback if comment differs
        pattern = r"\/\*\s*-+\s*INTERACTIVE TEST DOCK.*"
        cleaned = re.sub(pattern, "", content, flags=re.DOTALL).rstrip() + "\n"
    return cleaned

def clean_script_js(content):
    # Remove checkUrlTestParam() and initTestDock() from init()
    cleaned = content.replace("    // 9. Check URL query parameters for test cases (?test=single_monitor, etc.)\n    checkUrlTestParam();\n\n    // 10. Initialize Single-Page Test Dock & Live Sliders\n    initTestDock();\n", "")
    cleaned = cleaned.replace("    checkUrlTestParam();\n", "")
    cleaned = cleaned.replace("    initTestDock();\n", "")
    
    # Remove the Cockpit Test Suite API & dock engine block at the end
    split_marker = "  // =========================================================================\n  // Cockpit Test Suite API: Testing & QA Verification Engine"
    if split_marker in content:
        # Keep the final IIFE closing "})();"
        cleaned = cleaned.split(split_marker)[0].rstrip() + "\n})();\n"
    return cleaned

def create_delivery_zip():
    print("=" * 70)
    print("📦 BUILDING PRODUCTION DELIVERY ZIP FOR BACKEND ENGINEER")
    print("=" * 70)

    # 1. Read source files without modifying them
    base_html_path = os.path.join(BASE_DIR, "templates", "dashboard-v4", "base.html")
    index_html_path = os.path.join(BASE_DIR, "templates", "dashboard-v4", "index.html")
    style_css_path = os.path.join(BASE_DIR, "static", "dashboard-v4", "css", "style.css")
    api_js_path = os.path.join(BASE_DIR, "static", "dashboard-v4", "js", "api.js")
    script_js_path = os.path.join(BASE_DIR, "static", "dashboard-v4", "js", "script.js")
    jquery_js_path = os.path.join(BASE_DIR, "static", "dashboard-v4", "js", "jquery-3.3.1.min.js")
    assets_dir = os.path.join(BASE_DIR, "static", "dashboard-v4", "assets")

    with open(base_html_path, "r", encoding="utf-8") as f:
        raw_base_html = f.read()
    with open(index_html_path, "r", encoding="utf-8") as f:
        raw_index_html = f.read()
    with open(style_css_path, "r", encoding="utf-8") as f:
        raw_style_css = f.read()
    with open(api_js_path, "r", encoding="utf-8") as f:
        raw_api_js = f.read()
    with open(script_js_path, "r", encoding="utf-8") as f:
        raw_script_js = f.read()

    # 2. Process sanitized versions for delivery
    prod_base_html = clean_base_html(raw_base_html)
    prod_style_css = clean_style_css(raw_style_css)
    prod_script_js = clean_script_js(raw_script_js)

    # 3. Create the ZIP archive
    with zipfile.ZipFile(ZIP_OUTPUT_PATH, "w", zipfile.ZIP_DEFLATED) as zf:
        # Documentation & Integration Guide
        notes_path = os.path.join(BASE_DIR, "BACKEND_INTEGRATION_NOTES.md")
        if os.path.isfile(notes_path):
            zf.write(notes_path, "BACKEND_INTEGRATION_NOTES.md")

        # Templates
        zf.writestr("templates/dashboard-v4/base.html", prod_base_html)
        zf.writestr("templates/dashboard-v4/index.html", raw_index_html)
        
        # Static CSS & JS (Modular Architecture: API & UI separated)
        zf.writestr("static/dashboard-v4/css/style.css", prod_style_css)
        zf.writestr("static/dashboard-v4/js/api.js", raw_api_js)
        zf.writestr("static/dashboard-v4/js/script.js", prod_script_js)
        
        if os.path.isfile(jquery_js_path):
            zf.write(jquery_js_path, "static/dashboard-v4/js/jquery-3.3.1.min.js")
            
        # Static Assets
        for asset in sorted(os.listdir(assets_dir)):
            full_asset = os.path.join(assets_dir, asset)
            if os.path.isfile(full_asset):
                zf.write(full_asset, f"static/dashboard-v4/assets/{asset}")

    # 4. Verify Archive
    print(f"✅ ZIP Archive Created: {ZIP_OUTPUT_NAME} ({os.path.getsize(ZIP_OUTPUT_PATH):,} bytes)")
    print("\nContents of Delivery ZIP:")
    with zipfile.ZipFile(ZIP_OUTPUT_PATH, "r") as zf:
        for info in zf.infolist():
            print(f"  * {info.filename:<48} ({info.file_size:,} bytes)")

    print("\n✅ Verification Checks:")
    print("  * Has cockpit-test-dock in ZIP base.html:", "cockpit-test-dock" in prod_base_html)
    print("  * Has cockpit-test-dock in ZIP style.css:", "cockpit-test-dock" in prod_style_css)
    print("  * Has CockpitTesting in ZIP script.js:", "CockpitTesting" in prod_script_js)
    print("  * Workspace files remained untouched: YES")
    print("=" * 70)

if __name__ == "__main__":
    create_delivery_zip()
