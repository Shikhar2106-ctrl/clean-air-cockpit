# 🍃 IntelliGreen Clean Air Cockpit

An enterprise-grade, real-time Indoor & Outdoor Air Quality Cockpit built for corporate lobbies, conference rooms, executive suites, and large-format Smart TV displays (4K/1080p).

![Clean Air Cockpit](static/dashboard-v4/assets/logo_full_color.png)

---

## 🌟 Key Highlights

* **📺 Smart TV & Commercial Signage Ready**: Designed with strict legacy WebKit/Chromium TV compatibility (zero flex `gap` bugs, zero `inset`, fixed 100vh lock with no double scrollbars).
* **🧪 10 Dynamic Air Elements (Laboratory Test Tubes)**: Slim, proportional test-tube visualizers (`max-width: 1.6rem`, `height: 6.75rem`) for PM2.5, PM10, CO₂, TVOC, RH, Temperature, Formaldehyde (HCHO), Ozone, NO₂, and CO.
* **🌱 Single-Monitor Sustainability Loop**: Features an alternating animated loop between the Pure Air Sprout (`leaf_mascot.png`) and the Eco Bulb (`eco_bulb_clean.png`) when 1 monitor is active.
* **⚡ Non-Blocking & Zero Race Conditions**: Monotonic payload sequence tracking, `AbortController` request cancellation, and multi-threaded request handling.
* **🌱 Green Computing & Carbon Conscious**: Dark Slate Mode (`#020617`) saves up to **438 kWh / 359 kg CO₂e per screen annually** on 55" OLED/LED commercial panels.

---

## 🚀 Quick Start (Local Run)

The server runs entirely on Python's Standard Library with zero external pip dependencies.

```bash
# 1. Clone or navigate to the directory
cd clean_air_cockpit_backend_integration

# 2. Start the multi-threaded server
python server.py
```

* **Localhost**: [http://localhost:8000](http://localhost:8000)
* **LAN / Smart TV**: `http://<YOUR_LOCAL_IP>:8000`

---

## ☁️ Deploy to Render in 3 Steps

This repository is pre-configured with `render.yaml`, `Procfile`, `requirements.txt`, and dynamic `$PORT` binding for instant 1-click deployment on [Render.com](https://render.com).

### Step 1: Push to GitHub

```bash
# 1. Add your GitHub remote (replace with your repo URL)
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/clean-air-cockpit.git

# 2. Push to GitHub
git branch -M main
git push -u origin main
```

### Step 2: Create Web Service on Render

1. Log in to [dashboard.render.com](https://dashboard.render.com/).
2. Click **New +** > **Web Service**.
3. Select **Build and deploy from a Git repository** and connect your GitHub repo.
4. Render will auto-detect the configuration from `render.yaml`:
   * **Runtime**: `Python 3`
   * **Build Command**: `pip install -r requirements.txt`
   * **Start Command**: `python server.py`
   * **Plan**: `Free`
5. Click **Create Web Service**.

Your dashboard will be live within 1–2 minutes with a secure HTTPS URL (e.g. `https://clean-air-cockpit.onrender.com`).

---

## 📐 Architecture & Engineering Documentation

* 📄 **[HLD_DESIGN.md](HLD_DESIGN.md)** — High-Level Architecture, 4-Tier Scalable IoT Model, Smart TV Compatibility Matrix.
* 📄 **[LLD_DESIGN.md](LLD_DESIGN.md)** — Low-Level Component Specifications, DOM Lifecycles, TypeScript Interfaces.
* 📝 **[BACKEND_INTEGRATION_NOTES.md](BACKEND_INTEGRATION_NOTES.md)** — Production Checklist and Backend Hand-off Notes.
* 📦 **`clean_air_cockpit_delivery.zip`** — Production bundle with test docks stripped.

---

## 🧪 Verification & Automated Testing

Run the included regression suite:

```bash
python test_dashboard.py
```

* **Test Coverage**: 62 automated unit and regression checks.
* **Passing Rate**: 100% (62/62).
