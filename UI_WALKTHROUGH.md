# AgroAnalytics — MERN UI Design System & Typography Walkthrough

This document serves as the official reference manual for the premium **Desaturated-Green MERN Design System** used across the AgroAnalytics platform. All pages, sidebars, charts, and telemetry dashboards conform to these guidelines to ensure visual excellence and harmonized aesthetics.

---

## 1. Typography & Hierarchy Mappings

We use a high-density, screen-optimized sans-serif layout. The global font stack is declared on the `body` in [index.css](file:///d:/HARIOM/Documents/AventIQ/agro-analytics/frontend/src/index.css):

```css
body {
  font-family: "Plus Jakarta Sans", "Inter", sans-serif;
  overflow-x: hidden;
}
```

### Type Scale Specification Sheet

| Element | Tailwind Classes | Purpose | Accent Details |
| :--- | :--- | :--- | :--- |
| **Main Page Header** | `text-xl md:text-2xl font-bold tracking-tight text-gray-955` | Standalone modules main title | High contrast, elegant kerning |
| **Bilingual Label** | `text-xs font-black text-[#31572c] uppercase font-mono tracking-wider pl-3 ml-3 border-l-2 border-gray-300` | Hindi translations positioning | Inline vertical split line |
| **Card Header (H3)** | `text-xs font-black text-gray-955 uppercase tracking-widest` | Grid panel category headings | Clean metadata tracking block |
| **Descriptor Labels** | `text-[10px] font-bold text-gray-500 uppercase tracking-wider` | Form and details titles | Desaturated gray capitalization |
| **Telemetry Numbers** | `text-2xl font-black text-gray-950 tracking-tight` | Numeric readings and metrics | Bold, instantly scannable |
| **Base Body Text** | `text-xs font-semibold text-gray-700 leading-relaxed` | Descriptions and text areas | High-density readable blocks |

---

## 2. Dynamic HSL Brand Color Palette

We completely avoid generic Tailwind primaries (plain red, blue, green). AgroAnalytics is built on a harmonious, desaturated olive-green and earthy woodland theme.

```
███████████  #132a13 - Earthy Darkest Green (Sidebar Canvas Background)
███████████  #31572c - Active Brand Forest Green (Borders, Active State Text)
███████████  #4f772d - Mid Brand Olive Green (Highlights & Visual Fills)
███████████  #90a955 - Sage Accent Border Green (Soft Accents)
███████████  #ecf39e - Golden Sage Yellow Highlight (Active Sidebar Indicators)
```

### Semantic Color Coding
* **Success / Sown Badges**: `bg-emerald-50 text-emerald-700 border-emerald-100/50`
* **Alert / Outbreak Danger**: `bg-red-50 text-red-700 border-red-100` and `bg-red-500`
* **Agronomic Warnings**: `bg-amber-50 text-amber-900 border-amber-200` (dosing splits)
* **Informational / Telemetry**: `bg-blue-50 text-blue-800 border-blue-100`

---

## 3. Premium UI Blocks & Workbench Layouts

### 3.1 Unified Location Selector Card
Every agronomical page mounts the platform-standard `<LocationSelector />` card. It features a responsive split layout:
* **Left Section**: Dynamic custom dropdown selector linked to the Mongoose profile API (`profileApi.getProfile()`). Falls back to seed variables (`Home Sector Flatlands`) if the database is unreachable.
* **Right Section**: Dynamic HUD visual displaying total land, unallocated acres, and registered crops as clickable, high-fidelity badges.
* **Manual Override**: Revealing custom State, District, Pincode pickers and inline crop buttons when GPS override is selected.

### 3.2 High-Density Ledger Tables
All data listings (Mandi wholesale index, historical timeline outbreaks, chemical split schedules) employ our high-density ledger format:
* Outer container: `bg-white border border-gray-200/60 rounded-2xl shadow-sm overflow-hidden`
* Table header: `text-[10px] font-bold text-gray-400 tracking-wider p-3.5 border-b border-gray-100 uppercase`
* Alternating rows: Smooth hover background transitions (`hover:bg-[#4f772d]/5`) with desaturated right-aligned metrics.

### 3.3 Dynamic SVG Needle Dials
 Pathogen risk and seasonal indicators utilize mathematically mapped dials:
* concentric arc parameters `R=70`
* dynamic pointer transitions using computed angles: `style={{ transform: 'rotate(' + (-90 + score * 1.8) + 'deg)' }}`

---

## 4. Interaction, Transitions & Animations

We leverage custom cubic-bezier spring curves to make the application feel alive and premium:

### 4.1 Page Entrance Fades
All primary module grids animate dynamically on mount using:
```css
.animate-fadeIn {
  animation: fadeIn 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
}
```

### 4.2 Collapsible Sidebar Column
The collapsible menu panel in [ModuleLayout.jsx](file:///d:/HARIOM/Documents/AventIQ/agro-analytics/frontend/src/components/layout/ModuleLayout.jsx) employs a width-matching transition:
* Open Width: `w-60` (240px) matching the aside menu exactly.
* Closed Width: `w-0`
* Result: Eliminates element overlapping, keeping the close icon (`X`) properly positioned with pristine padding spacing.

### 4.3 Click-Outside Handler Scheduling
All dropdown overlays (avatar, role selectors) listen to the `click` event instead of `mousedown` to ensure standard React event bubbling is respected and touch screen clicks respond seamlessly.
