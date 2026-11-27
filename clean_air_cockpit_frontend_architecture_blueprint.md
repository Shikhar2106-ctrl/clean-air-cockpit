# IntelliGreen Clean Air Cockpit — Complete Frontend Architecture & System Logic Map

> [!IMPORTANT]
> **One-Sheet Master Blueprint**: Yeh single-sheet architecture map hamare Clean Air Cockpit frontend ke har ek component, data pipeline, business rule, aur user-interface module ko granular level par map karta hai.

---

## 🖼️ Architecture Blueprint Image (High-Resolution Single Sheet)

Neeche diya gaya blueprint **3800 × 2500 Ultra High-Definition (UHD)** resolution mein render kiya gaya hai. Isme system ka har ek feature aur technical rule documented hai:

![IntelliGreen Clean Air Cockpit Architecture Map](clean_air_cockpit_architecture_map.png)

*Direct Workspace File Link:* [clean_air_cockpit_architecture_map.png](file:///d:/Personal/clean_air_cockpit_backend_integration/clean_air_cockpit_architecture_map.png)

---

## 🌳 System Architecture Graph (Tree & Data Flow Hierarchy)

Neeche diye gaye hierarchical graph mein server rendering se lekar browser ke visual DOM updates tak ka complete data flow mapped hai:

```mermaid
graph TD
    classDef django fill:#312e81,stroke:#818cf8,stroke-width:2px,color:#fff;
    classDef pipe fill:#0e7490,stroke:#06b6d4,stroke-width:2px,color:#fff;
    classDef ui fill:#065f46,stroke:#10b981,stroke-width:2px,color:#fff;
    classDef rules fill:#92400e,stroke:#f59e0b,stroke-width:2px,color:#fff;
    classDef test fill:#881337,stroke:#f43f5e,stroke-width:2px,color:#fff;

    subgraph Layer1["1. Architecture & File Foundation (Django MTV)"]
        A["Django Server (Monolithic MTV)"]:::django --> B["templates/dashboard-v4/base.html"]:::django
        A --> C["templates/dashboard-v4/index.html"]:::django
        A --> D["static/dashboard-v4/js/api.js"]:::django
        A --> E["static/dashboard-v4/js/script.js"]:::django
        A --> F["static/dashboard-v4/css/style.css"]:::django
        B --> G["Full-Color Logo & Nav Drawer"]:::django
        B --> H["Dark/Light Theme Engine"]:::django
    end

    subgraph Layer2["2. Ingestion & Data Normalization Pipeline"]
        I["Initial SSR Payload (Django Context)"]:::pipe --> K["window.ingestSensorPayload()"]:::pipe
        J["50-Sec Polling (CockpitSyncEngine)"]:::pipe --> K
        K --> L["normalizePayload()"]:::pipe
        L --> M["stats[0] Unpacker & Key Mapper"]:::pipe
        L --> N["CPCB Engine: predictPm25FromAqi()"]:::pipe
        N --> O["Missing Outdoor PM2.5 Fallback"]:::pipe
    end

    subgraph Layer3["3. Business Rules & Gatekeeper Matrix"]
        P{"Device Offline Check"}:::rules
        L --> P
        P -- "Offline = true" --> Q["Cascade: Indoor Values = 0, Tubes = 0, Status = Offline"]:::rules
        P -- "Online = true" --> R{"Indoor AQI in cards?"}:::rules
        
        R -- "No ('AQI' omitted)" --> S["Switch Panel 1 to 'Indoor PM2.5'"]:::rules
        R -- "No ('AQI' omitted)" --> T["AQI Reduction Card: HIDE (display: none)"]:::rules
        
        R -- "Yes ('AQI' present)" --> U{"AQI Reduction Check"}:::rules
        U -- "Indoor >= Outdoor OR Red <= 0%" --> V["AQI Reduction Card: HIDE (display: none)"]:::rules
        U -- "Indoor < Outdoor AND Red > 0%" --> W["AQI Reduction Card: SHOW (flex)"]:::rules
    end

    subgraph Layer4["4. 6-Card Corporate UI Grid Engine"]
        X["Panel 1: Indoor Air Quality"]:::ui --> X1["20s Mountain Landscape Loop (12 Peaks)"]:::ui
        X --> X2["Dynamic Value (AQI vs PM2.5)"]:::ui
        
        Y["Panel 2: Outdoor Air & Gauge"]:::ui --> Y1["Outdoor AQI + CPCB Status Color"]:::ui
        Y --> Y2["SVG Dynamic Gauge Arc + Needle"]:::ui
        Y --> Y3["Station Name: '· 1-h avg'"]:::ui
        
        Z["Panel 3: Clock & Weather"]:::ui --> Z1["1-Sec Live Clock + Gregorian Date"]:::ui
        Z --> Z2["WeatherService + Wind Speed Badge"]:::ui
        
        AA["Panel 4: Active Monitors"]:::ui --> AA1["Carousel (>=2 Monitors)"]:::ui
        AA --> AA2["Single Monitor Mode: Sprout & Eco Bulb"]:::ui
        
        AB["Panels 5 & 6: Test Tubes"]:::ui --> AB1["6 to 10 Element Tubes (PM10, CO2, TVOC, Temp, RH, etc.)"]:::ui
        AB --> AB2["Liquid Fill Animation + CPCB Color Thresholds"]:::ui
    end

    subgraph Layer5["5. Testing & Verification Suite"]
        AC["test_dashboard.py"]:::test --> AC1["92/92 Automated Tests Passing (100%)"]:::test
        AD["Browser DevTools HUD"]:::test --> AD1["12 Live Sliders + Quick Test Presets"]:::test
        AE["Delivery Artifact"]:::test --> AE1["clean_air_cockpit_delivery.zip Synchronized"]:::test
    end

    Layer1 --> Layer2
    Layer2 --> Layer3
    Layer3 --> Layer4
    Layer4 --> Layer5
```

---

## 📋 Comprehensive Domain Mapping Sheet

| Domain Section | Key Components / Features | Core Rules & Applied Logic |
| :--- | :--- | :--- |
| **1. Architecture & Files** | • `base.html`, `index.html`<br>• `api.js`, `script.js`, `style.css`<br>• Full Color Logo (`logo_full_color.png`)<br>• 12 Mountain JPEGs + Mascot assets | • **Monolithic Django (MTV)**: No complex node build step; HTML served directly.<br>• **Navigation Drawer**: Clean slide-out sidebar displaying company full-color logo.<br>• **Dark/Light Theme**: CSS custom properties toggled via `data-theme` attribute. |
| **2. Data Ingestion** | • SSR Template Context<br>• `CockpitSyncEngine` (50s loop)<br>• `normalizePayload()`<br>• `predictPm25FromAqi()` | • **Dual Ingestion**: Initial load via server-side context; background sync every 50 seconds.<br>• **Bandwidth Saver**: Polling pauses when `document.hidden` is true.<br>• **CPCB Interpolation**: Piecewise linear standard converts AQI to PM2.5 when sensor is missing or API duplicates AQI. |
| **3. Business Rules** | • Offline State Cascade<br>• Cards Parameter Filter<br>• AQI Reduction Gatekeeper | • **Offline Guard**: Forces indoor values to 0, status to "Offline", hides reduction pill.<br>• **AQI Reduction Rule**: Strictly hides when Indoor AQI is disabled/omitted in `cards`, or when reduction $\le 0\%$ (non-negative filter).<br>• **No Misleading Display**: Prevents displaying "AQI Reduction" when only showing Indoor PM2.5. |
| **4. 6-Card UI Grid** | • Panel 1: Indoor & Mountains<br>• Panel 2: Outdoor & Gauge<br>• Panel 3: Clock & Weather<br>• Panel 4: Active Monitors<br>• Panels 5 & 6: Test Tubes | • **Mountain Loop**: Cycles 12 mountain landscapes every 20s with mint-green overlay.<br>• **SVG Gauge**: Real-time arc stroke and needle angle mapped to outdoor AQI.<br>• **Single Monitor Mascot**: Shows Sprout mascot and Eco Bulb when exactly 1 monitor exists.<br>• **Test Tubes**: Animated liquid gauges for PM10, CO2, TVOC, Temp, RH, HCHO, Pressure. |
| **5. Testing & Verification** | • `test_dashboard.py` (92 Tests)<br>• Browser DevTools HUD Controller<br>• Synchronized Delivery ZIP | • **Clean Production**: Zero mock DBs, deleted diagnostics modal, zero jQuery in core.<br>• **Interactive Controller**: Floating panel with 12 sliders to simulate any live sensor state.<br>• **Automated CI/CD**: 100% test pass rate pushed directly to GitHub `main` branch. |

---

### File Location:
- High-Resolution PNG Blueprint: [`clean_air_cockpit_architecture_map.png`](file:///d:/Personal/clean_air_cockpit_backend_integration/clean_air_cockpit_architecture_map.png)
- Delivery Archive: [`clean_air_cockpit_delivery.zip`](file:///d:/Personal/clean_air_cockpit_backend_integration/clean_air_cockpit_delivery.zip)
