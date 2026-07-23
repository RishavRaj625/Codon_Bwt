# Visual Design System & UI Guidelines (Design.md) 🎨

**Document Version:** 1.0.0  
**Project:** Codon Usage Tool & Explainable AI (XAI) Dashboard  
**Design Theme:** Dark Slate / Glassmorphic Futuristic Biotechnology Interface  

---

## 🌌 Design Philosophy

The design system for **CodonSense / Codon Usage Tool** is engineered to combine high-density bioinformatic data presentation with a sleek, modern, executive-ready dark interface. Key design principles include:

1. **Dark Mode First**: Eliminates screen glare during extended scientific analysis while accentuating vibrant data visualizations (emerald greens, warm ambers, and soft golds).
2. **Visual Hierarchy & Immediate Clarity**: Key outputs—such as the primary Recommended Codon and Prediction Confidence—are rendered with high visual prominence in a standalone **Hero Card**.
3. **Information Density without Clutter**: Complex data (SHAP values, kingdom statistics, host optimizations) is logically segmented across intuitive **Slider Navigation Tabs**.
4. **Explainable Callout Highlights**: Analytical callout boxes provide plain-English summaries to bridge machine learning output with biological intuition.

---

## 🎨 Color Palette & Design Tokens

### Core Theme Palette
```css
/* Color Tokens */
--bg-deep-space:     #000000;           /* Pure dark background */
--bg-card-slate:     #0d121d;           /* Preferred sleek hero card background */
--bg-card-hover:     rgba(15, 20, 28, 0.95);
--border-subtle:     rgba(255, 255, 255, 0.12);
--border-gold-accent: rgba(212, 175, 55, 0.4);
```

### Functional Data Colors
| Role | HEX Code | Visual Preview | Usage |
|---|---|---|---|
| **Recommended Codon / High Confidence** | `#22c55e` / `#4caf50` | 🟢 Emerald Green | Primary codon recommendation, confidence percentage, positive SHAP impact |
| **Alternative Codons / Secondary Rank** | `#f59e0b` / `#d4af37` | 🟡 Warm Gold / Amber | Top-3 alternative codons, tab navigation highlights, rank badges |
| **Negative SHAP / Low Preference** | `#ff5252` | 🔴 Soft Coral Red | Negative feature contributions, low preference host species |
| **Neutral Text (Primary)** | `#ffffff` | ⚪ Pure White | Headers, field values, card titles |
| **Neutral Text (Secondary)** | `#9ca3af` / `#888888` | 🔘 Cool Slate Grey | Field labels, subheaders, footnote annotations |
| **Callout Highlight Background** | `rgba(34, 197, 94, 0.08)` | 🍀 Translucent Mint | Biological & AI short explanation callout box |

---

## 🔤 Typography System

### Font Family
- **Primary Font**: System UI Stack (`Arial, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`) for crisp legibility across all screen densities.
- **Monospace Code/Codon Font**: Monospaced font for sequence display (`font-weight: 900; letter-spacing: 1.5px;`).

### Type Scale & Hierarchy
```css
/* Typography Scale */
.page-title       { font-size: 26px; font-weight: 700; color: #d4af37; text-align: center; }
.page-subtitle    { font-size: 13px; font-weight: 400; color: #888888; text-align: center; }
.hero-header-title{ font-size: 20px; font-weight: 700; color: #ffffff; }
.hero-field-label { font-size: 15px; font-weight: 500; color: #9ca3af; min-width: 200px; }
.hero-field-value { font-size: 15px; font-weight: 700; color: #ffffff; }
.hero-codon-val   { font-size: 24px; font-weight: 900; color: #22c55e; letter-spacing: 1.5px; }
.hero-conf-val    { font-size: 19px; font-weight: 800; color: #22c55e; }
.alt-codon-name   { font-size: 15px; font-weight: 800; color: #f59e0b; letter-spacing: 1px; }
.explanation-body { font-size: 13px; line-height: 1.6; color: #d1d5db; }
```

---

## 🧩 Component Anatomy & Layout Specifications

### 1. Header Navigation Bar (`.nav-icons`)
- **Structure**: Sleek top horizontal pill navigation bar containing 3 top-level views:
  - 🏠 **Home** (`showPage('home')`)
  - 📊 **Metrics** (`showPage('metrics')`)
  - 📈 **Training Proof** (`showPage('proof')`)
- **Active State**: Translucent gold glow `linear-gradient(135deg, rgba(212, 175, 55, 0.35), rgba(212, 175, 55, 0.15))` with a gold accent border `#d4af37`.

### 2. Persistent Top Container (`.global-input-section`)
- **Location**: Pinned at the top of the viewport above the tab pages.
- **Contents**: Title (`CodonSense`), input fields (`Amino Acid`, `Codon`, `Target Host Species`), `Analyze` button, loading/error indicators, and the **Recommended Codon Hero Card** (`#hero-card-container`).
- **Hero Card Structure**: Dark slate card (`#0d121d`) displaying recommended codon, prediction confidence, top-3 alternative codons, and plain-English biological explanations.

### 3. Sub-Slider Navigation Tabs (`.slider-tabs-nav`)
- **Location**: Positioned directly below the Recommended Codon Hero Card inside `.global-input-section`.
- **Structure**: Horizontal pill container holding 3 sub-slider tab buttons:
  - **Tab 1**: `Prediction & Biological Interpreter`
  - **Tab 2**: `Organism & Evolutionary Usage`
  - **Tab 3**: `ML & Model Interpretability`
- **Active State**: Gold gradient background `linear-gradient(135deg, rgba(212, 175, 55, 0.3), rgba(212, 175, 55, 0.1))` with a glowing border `#d4af37`.

### 4. Species Bias Donut Pie Chart (`.pie-chart-wrapper`)
- **Structure**: Custom SVG donut chart (radius = 90, donut hole radius = 52) with center text label displaying the analyzed codon symbol.
- **Color Scheme**: Multi-color curated palette (Gold `#d4af37`, Emerald Green `#4CAF50`, Sapphire Blue `#2196F3`, Purple `#9C27B0`, Amber Orange `#FF9800`, Deep Pink `#E91E63`, Cyan `#00BCD4`).
- **Legend**: Color badge + Species Name + Bias Multiplier (`x.xx`x) cleanly rendered without percentage noise.

### 5. Data Tables & Visual Progress Bars
- **Tables**: Dark translucent background `rgba(255, 255, 255, 0.03)` with gold header text `#d4af37` and subtle row borders.
- **Progress Bars**: Rounded track container with multi-color gradient fills (gold, green, blue, purple) for species preference visualization.

---

## 📱 Responsiveness & Animation Rules

- **Max Width**: Centered layout constrained to `900px` for optimal reading distance.
- **Animations**:
  - Card Entrance: Smooth fade-in `animation: fadeIn 0.4s ease-out;`
  - Tab Transition: Slide-fade `animation: slideFadeIn 0.4s ease-in-out;`
  - Hover Effects: Scale transform `transform: translateY(-2px);` on primary action buttons.
- **Mobile Adaptability**: On screen widths < 768px, grid columns collapse to single-column flex layouts, and field label widths adjust automatically.
