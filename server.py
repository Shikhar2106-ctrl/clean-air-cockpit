"""
IntelliGreen Clean Air Cockpit — Local Server
Serves the exact original templates and static assets without any debug or test bars.
"""

import http.server
import socketserver
import os
import re
import json
import mimetypes
import socket
from urllib.parse import urlparse, parse_qs

PORT = int(os.environ.get("PORT", 8000))
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
TEMPLATES_DIR = os.path.join(BASE_DIR, "templates", "dashboard-v4")
STATIC_DIR = os.path.join(BASE_DIR, "static")

# Sensor mock data matching the exact original visual screenshot
INITIAL_SENSOR_DATA = {
    "device_id": "6699",
    "indoor_device_name": "PTI First Floor",
    "aqi": 41,
    "pm2d5": 24.8,
    "pm10": 25.0,
    "co2": 730,
    "tvoc": 1016,
    "rh": 60,
    "temp": 25.4,
    "outdoor_aqi": 294,
    "outdoor_pm2_5": 145.0,
    "outdoor_pm10": 260.0,
    "outdoor_station_name": "Nehru Nagar, Delhi - DPCC",
    "outdoor_temperature": 16,
    "weather_condition": "Clear Sky",
    "weather_high": 25,
    "weather_low": 13,
    "wind_speed": 4,
    "offline": False,
    "device_status": "online",
    "cards": ["AQI", "pm2d5", "pm10", "co2", "tvoc", "rh", "temp"]
}

DEVICES = [
    {"device_id": "6699", "device_name": "KNMA", "offline": True},
    {"device_id": "6851", "device_name": "Agoda", "offline": False},
    {"device_id": "6871", "device_name": "Scope Minar", "offline": False},
    {"device_id": "7701", "device_name": "Corporate Boardroom", "offline": False},
    {"device_id": "7702", "device_name": "Executive Suite", "offline": False},
    {"device_id": "7703", "device_name": "Cafeteria Hub", "offline": False},
]

def render_dashboard_html(test_case=None):
    base_file = os.path.join(TEMPLATES_DIR, "base.html")
    index_file = os.path.join(TEMPLATES_DIR, "index.html")

    with open(base_file, "r", encoding="utf-8") as f:
        base_tmpl = f.read()
    with open(index_file, "r", encoding="utf-8") as f:
        index_tmpl = f.read()

    content_m = re.search(r"{%\s*block\s+content\s*%}(.*?){%\s*endblock\s*%}", index_tmpl, re.DOTALL)
    script_m = re.search(r"{%\s*block\s+script\s*%}(.*?){%\s*endblock\s*%}", index_tmpl, re.DOTALL)

    content_code = content_m.group(1) if content_m else ""
    script_code = script_m.group(1) if script_m else ""

    html = re.sub(r"{%\s*block\s+content\s*%}.*?{%\s*endblock\s*%}", lambda _: content_code, base_tmpl, flags=re.DOTALL)
    html = re.sub(r"{%\s*block\s+script\s*%}.*?{%\s*endblock\s*%}", lambda _: script_code, html, flags=re.DOTALL)

    # Clean Django tags
    html = re.sub(r"{%\s*load\s+static\s*%}", "", html)
    html = re.sub(r"{%\s*static\s+['\"]([^'\"]+)['\"]\s*%}", r"/static/\1", html)
    html = re.sub(r"{%\s*url\s+[^%]+%}", "#", html)
    html = re.sub(r"{%\s*csrf_token\s*%}", "", html)
    html = re.sub(r"{%\s*if\s+branches\s*%}[\s\S]*?{%\s*endif\s*%}", "", html)

    html = re.sub(r'\{\{\s*request\.user\.first_name[^}]*\}\}', 'Admin', html)
    html = re.sub(r'\{\{\s*request\.user\.last_name[^}]*\}\}', 'User', html)
    html = re.sub(r'\{\{\s*request\.user\.username[^}]*\}\}', 'Admin User', html)

    # Test cases data configuration
    current_cards = ["AQI", "pm2d5", "pm10", "co2", "tvoc", "rh", "temp"]
    current_devices = list(DEVICES)
    current_sensor = dict(INITIAL_SENSOR_DATA)
    current_sensor["cards"] = list(current_cards)

    if test_case == "single_monitor":
        current_devices = [{"device_id": "7701", "device_name": "Corporate Boardroom", "offline": False}]
        current_sensor["device_id"] = "7701"
        current_sensor["indoor_device_name"] = "Corporate Boardroom"
        current_sensor["aqi"] = 41
        current_sensor["pm2d5"] = 22.0
    elif test_case == "indoor_gt_outdoor":
        current_sensor.update({
            "aqi": 210, "pm2d5": 110.0, "pm10": 165.0,
            "outdoor_aqi": 55, "outdoor_pm2_5": 18.0, "outdoor_pm10": 42.0,
            "weather_condition": "Clear Sky"
        })
    elif test_case == "indoor_disabled_gt_outdoor":
        current_cards = ["pm2d5", "pm10", "co2", "tvoc", "rh", "temp"]
        current_sensor.update({
            "aqi": 210, "pm2d5": 120.0, "pm10": 175.0,
            "outdoor_aqi": 75, "outdoor_pm2_5": 35.0, "outdoor_pm10": 60.0,
            "cards": list(current_cards)
        })
    elif test_case == "good_air":
        current_sensor.update({
            "aqi": 18, "pm2d5": 8.5, "pm10": 12.0,
            "outdoor_aqi": 32, "outdoor_pm2_5": 14.0, "outdoor_pm10": 22.0
        })
    elif test_case == "multiple_tubes":
        current_cards = ["AQI", "pm2d5", "pm10", "co2", "tvoc", "rh", "temp", "hcho", "ozone", "no2", "co"]
        current_sensor.update({
            "hcho": 0.03, "ozone": 28, "no2": 19, "co": 0.6,
            "cards": list(current_cards)
        })
    elif test_case == "indoor_aqi_disabled":
        current_cards = ["pm2d5", "pm10", "co2", "tvoc", "rh", "temp"]
        current_sensor["cards"] = list(current_cards)
    elif test_case == "single_monitor_multiple_tubes":
        current_devices = [{"device_id": "9901", "device_name": "Executive Suite", "offline": False}]
        current_cards = ["AQI", "pm2d5", "pm10", "co2", "tvoc", "rh", "temp", "hcho", "ozone", "no2", "co"]
        current_sensor.update({
            "device_id": "9901", "indoor_device_name": "Executive Suite",
            "hcho": 0.02, "ozone": 22, "no2": 15, "co": 0.4,
            "cards": list(current_cards)
        })
    elif test_case == "offline":
        current_devices = [{"device_id": "6699", "device_name": "KNMA", "offline": True}]
        current_sensor.update({
            "aqi": 0, "pm2d5": 0, "pm10": 0, "co2": 0, "tvoc": 0, "rh": 0, "temp": 0,
            "offline": True, "device_status": "offline"
        })
    elif test_case == "severe":
        current_sensor.update({
            "aqi": 85, "pm2d5": 55.4, "pm10": 82.0, "outdoor_aqi": 445,
            "outdoor_pm2_5": 320.0, "outdoor_pm10": 480.0,
            "outdoor_station_name": "Jahangirpuri, Delhi - DPCC",
            "weather_condition": "Dense Smog"
        })

    cards_replacement = f'window.cards = {json.dumps(current_cards)};'
    html = re.sub(
        r"{%\s*if\s+device_settings\s+and\s+device_settings\.cards\s*%}[\s\S]*?{%\s*else\s*%}[\s\S]*?{%\s*endif\s*%}",
        cards_replacement,
        html
    )

    dev_js_lines = []
    for d in current_devices:
        dev_js_lines.append(f'  device_list.push({json.dumps(d)});')
    devices_js = "\n".join(dev_js_lines)
    html = re.sub(r"{%\s*for\s+iot_device\s+in\s+iot_devices\s*%}.*?{%\s*endfor\s*%}", devices_js, html, flags=re.DOTALL)

    html = html.replace('{{ sensor_json|default:""|safe }}', json.dumps(current_sensor))
    html = html.replace('{{ cards_json|default:""|safe }}', json.dumps(current_cards))
    html = html.replace('{{ sensor_data|json_script:"cockpit-data" }}', f'<script id="cockpit-data" type="application/json">{json.dumps(current_sensor)}</script>')
    html = html.replace('{{ cards_list|json_script:"cockpit-cards" }}', f'<script id="cockpit-cards" type="application/json">{json.dumps(current_cards)}</script>')
    html = html.replace('{{device.device_id}}', current_sensor.get("device_id", "KNMA-01"))
    html = html.replace("{{ device.station.lat|default:'' }}", "28.6139")
    html = html.replace("{{ device.station.lon|default:'' }}", "77.2090")

    return html

class CleanAirCockpitHandler(http.server.BaseHTTPRequestHandler):
    def log_message(self, format, *args):
        try:
            print(f"[{self.log_date_time_string()}] {self.command} {self.path} - {args[1]}", flush=True)
        except Exception:
            pass

    def do_HEAD(self):
        try:
            self.send_response(200)
            self.end_headers()
        except (ConnectionResetError, ConnectionAbortedError, BrokenPipeError):
            pass

    def do_GET(self):
        try:
            self._handle_get()
        except (ConnectionResetError, ConnectionAbortedError, BrokenPipeError):
            pass
        except Exception as e:
            try:
                self.send_response(500)
                self.send_header("Content-Type", "text/plain")
                self.end_headers()
                self.wfile.write(f"Server Error: {e}".encode("utf-8"))
            except Exception:
                pass

    def _handle_get(self):
        parsed = urlparse(self.path)
        path = parsed.path
        query_params = parse_qs(parsed.query)
        test_case = query_params.get("test", [None])[0]

        if path in ("/health", "/healthz"):
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(b'{"status": "ok", "app": "clean-air-cockpit"}')
            return

        if path in ("/", "/dashboard/", "/index.html"):
            try:
                rendered_html = render_dashboard_html(test_case=test_case)
                self.send_response(200)
                self.send_header("Content-Type", "text/html; charset=utf-8")
                self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
                self.end_headers()
                self.wfile.write(rendered_html.encode("utf-8"))
            except Exception as e:
                self.send_response(500)
                self.send_header("Content-Type", "text/plain")
                self.end_headers()
                self.wfile.write(f"Template Rendering Error: {e}".encode("utf-8"))
            return

        if path in ("/test-cases", "/api/test-cases"):
            test_info = [
                {"id": "default", "name": "Default Baseline (6 Monitors, 6 Tubes, Indoor AQI 41, Outdoor AQI 294)", "url": "/?test=default"},
                {"id": "indoor_gt_outdoor", "name": "Indoor AQI > Outdoor AQI (In: 210 vs Out: 55 -> Reduction Box Disappears)", "url": "/?test=indoor_gt_outdoor"},
                {"id": "indoor_aqi_disabled", "name": "Indoor AQI Disabled via cards Parameter (Panel 1 shows Indoor PM2.5)", "url": "/?test=indoor_aqi_disabled"},
                {"id": "indoor_disabled_gt_outdoor", "name": "Indoor Disabled & PM2.5 High (In: 120 vs Out: 35 -> Reduction Disappears)", "url": "/?test=indoor_disabled_gt_outdoor"},
                {"id": "single_monitor", "name": "Single Monitor (1 Monitor in Active Monitors card)", "url": "/?test=single_monitor"},
                {"id": "multiple_tubes", "name": "Multiple Test Tubes (10 Dynamic Air Elements)", "url": "/?test=multiple_tubes"},
                {"id": "single_monitor_multiple_tubes", "name": "Single Monitor + 10 Multiple Test Tubes", "url": "/?test=single_monitor_multiple_tubes"},
                {"id": "offline", "name": "Offline Monitor Status", "url": "/?test=offline"},
                {"id": "severe", "name": "Severe Air Pollution (AQI 445)", "url": "/?test=severe"},
                {"id": "good_air", "name": "Clean Alpine Air (In: 18 vs Out: 32)", "url": "/?test=good_air"},
            ]
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
            self.end_headers()
            self.wfile.write(json.dumps(test_info, indent=2).encode("utf-8"))
            return

        if path.startswith("/get-real-time-data/"):
            parts = path.strip("/").split("/")
            dev_id = parts[1] if len(parts) > 1 else "KNMA-01"
            response_data = dict(INITIAL_SENSOR_DATA)
            response_data["device_id"] = dev_id
            
            for d in DEVICES:
                if d["device_id"] == dev_id:
                    response_data["indoor_device_name"] = d["device_name"]
                    if d.get("offline"):
                        response_data["offline"] = True
                        response_data["device_status"] = "offline"
                        response_data.update({
                            "aqi": 0, "pm2d5": 0, "pm10": 0, "co2": 0, "tvoc": 0, "rh": 0, "temp": 0
                        })
                    break

            payload_bytes = json.dumps(response_data).encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
            self.end_headers()
            self.wfile.write(payload_bytes)
            return

        if path.startswith("/static/"):
            rel_path = path[len("/static/"):].split("?")[0]
            file_path = os.path.join(STATIC_DIR, rel_path.replace("/", os.sep))
            
            if os.path.exists(file_path) and os.path.isfile(file_path):
                mime, _ = mimetypes.guess_type(file_path)
                if not mime:
                    mime = "application/octet-stream"
                self.send_response(200)
                self.send_header("Content-Type", mime)
                self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
                self.end_headers()
                with open(file_path, "rb") as f:
                    self.wfile.write(f.read())
                return
            else:
                self.send_response(404)
                self.send_header("Content-Type", "text/plain")
                self.end_headers()
                self.wfile.write(b"Static asset not found")
                return

        self.send_response(404)
        self.send_header("Content-Type", "text/plain")
        self.end_headers()
        self.wfile.write(b"404 Not Found")

def get_local_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        pass
    try:
        hostname = socket.gethostname()
        ips = socket.gethostbyname_ex(hostname)[2]
        for ip in ips:
            if not ip.startswith("127.") and not ip.startswith("169.254."):
                return ip
    except Exception:
        pass
    return "192.168.1.14"

class ThreadedHTTPServer(socketserver.ThreadingMixIn, http.server.HTTPServer):
    daemon_threads = True
    allow_reuse_address = True

def run_server():
    local_ip = get_local_ip()
    server_address = ("0.0.0.0", PORT)
    with ThreadedHTTPServer(server_address, CleanAirCockpitHandler) as httpd:
        print("=" * 64, flush=True)
        print("🚀 IntelliGreen Clean Air Cockpit Server is Running (Multi-Threaded)!", flush=True)
        print(f"👉 Localhost: http://localhost:{PORT}", flush=True)
        print(f"👉 Network / Local IP: http://{local_ip}:{PORT}", flush=True)
        print("=" * 64, flush=True)
        httpd.serve_forever()

if __name__ == "__main__":
    run_server()
