# PropStudio — Fictional Dashboard & Prop Simulator

A mobile-first fictional dashboard prop simulator crafted for filmmakers, creators, and entertainment productions filming investment, entrepreneurship, e-commerce, or crypto growth series.

> ⚠️ **DISCLAIMER & PURPOSE (LARP / FILM PROP ONLY)**  
> **PropStudio is strictly a prop and entertainment tool for filmmaking, screen recordings, and roleplay (LARP).**  
> • It has **NO** connection to real bank accounts, crypto blockchains, Shopify stores, or YouTube accounts.  
> • It does **NOT** process real transactions, payments, or cryptocurrency transfers.  
> • All balances, metrics, transactions, and addresses are simulated and locally generated.  
> • Do not use this tool to deceive, defraud, or misrepresent financial standing.

---

## 📱 Platform Direct URLs

Every simulated platform has its own dedicated URL path. You can bookmark or link directly to any platform:

| Platform | URL Path | Description |
| :--- | :--- | :--- |
| **Home Launcher** | `/` or `/launcher` | Central app selector and Phase management |
| **YouTube Studio** | `/youtube-studio` | Channel analytics, views, revenue, CTR, top video thumbnails |
| **Shopify** | `/shopify` | Store sales, orders, AOV, conversion rate, product catalog |
| **Ledger Wallet** | `/ledger` | Hardware companion app, BTC/ETH/SOL assets, send/receive props |
| **Private Bank** | `/bank` | Wealth management, checking/savings, interactive titanium card prop |

---

## 🎨 Where are the Logos? (No Env Needed!)

All platform logos for **both the Homepage launcher cards** and the **top navigation headers** are centralized in one single configuration file:

📁 **`/src/config/platformLogos.tsx`**

You do **NOT** need any environment variables to change them!

### How to Change the Logos:

1. **Option A: Edit `/src/config/platformLogos.tsx`**
   - Open `/src/config/platformLogos.tsx`
   - Update `logoUrl` for the homepage card (accepts local paths `/my-logo.png` or external web links `https://...`)
   - Update `headerLogoUrl` for the top navigation bar (or leave empty to match `logoUrl`)
   - Change brand names, sublabels, and accent colors if desired.

2. **Option B: Replace the Ready-Made SVG Files in `/public/logos/`**
   - Drop your own replacement files directly into the `/public/logos/` folder:
     - YouTube Studio: `/public/logos/youtube.svg`
     - Shopify Store: `/public/logos/shopify.svg`
     - Ledger Live: `/public/logos/ledger.svg`
     - Private Bank: `/public/logos/bank.svg`
   - Any file placed in `/public/` is immediately served by the app!

---

## 🎬 How to Make It Look 100% Real on an iPhone

When filming on an iPhone, you can make these dashboards open and look identical to actual installed apps on your home screen without browser navigation bars.

### Method 1: Safari "Add to Home Screen" (Quick PWA)
1. Open the URL in Safari on your iPhone (e.g. `https://your-domain.vercel.app/youtube-studio`).
2. Tap the **Share** button (box with an arrow pointing up).
3. Scroll down and tap **Add to Home Screen**.
4. Tap **Add**. The app now launches full-screen in standalone mode without any browser URL bars.

---

### Method 2: iPhone "Shortcuts" App for Custom Official App Icons (Recommended for Filming)

Using Apple's built-in **Shortcuts** app, you can assign the official app icon and name to each platform link so your iPhone home screen looks authentic on camera:

1. On the launcher, open the **Home Screen Icons** card and tap **Download** on the icon you want (saved to Files, or press-and-hold the icon → *Add to Photos*). Source PNGs live in `/public/icons/`.
2. Open the **Shortcuts** app on your iPhone.
3. Tap the **+** button in the top right corner to create a new shortcut.
4. Tap **Add Action**, search for **"Open URL"**, and select it.
5. In the URL field, paste your specific dashboard URL:
   - For YouTube Studio: `https://your-domain.vercel.app/youtube-studio`
   - For Shopify: `https://your-domain.vercel.app/shopify`
   - For Ledger: `https://your-domain.vercel.app/ledger`
   - For Bank: `https://your-domain.vercel.app/bank`
6. Tap the dropdown arrow at the top (next to "Open URL") and select **"Add to Home Screen"**.
7. Tap the placeholder icon under **Home Screen Name and Icon** and choose **"Choose File"** (or **"Choose Photo"** if you added it to Photos).
8. Pick the icon you downloaded.
9. Rename the shortcut to match the actual app (e.g., `Studio`, `Shopify`, `Ledger`, or `Bank`).
10. Tap **Add**.

Now when you tap that icon on your phone during recording, it launches straight into that exact simulated platform full screen!

---

## 💾 Where is Data Stored? (Vercel & Local Deployment)

* **100% Client-Side Storage**: All your numbers, channel names, uploaded photos, and phases are saved directly in your browser's **`localStorage`** (`propstudio_phases_v3`).
* **No Database or Backend Needed**: The app runs completely offline as a static React single-page app.
* **Deploying to Vercel**:
  1. Push this project to GitHub.
  2. Import the repository into [Vercel](https://vercel.com).
  3. Framework Preset: **Vite** (Build Command: `npm run build`, Output Directory: `dist`).
  4. The included `vercel.json` automatically configures SPA route rewrites so direct links like `/youtube-studio` resolve seamlessly.
* **Transferring Between Devices**: Open **Control Center** → **Phases** → **Copy Phases JSON** to export your setup to your computer or send it to another phone.

---

## 🔒 Film Mode vs. Edit Mode

To prevent accidental popups or edit dialogs from appearing while recording a take:

* **Film Mode (Default)**:
  - All values, channel names, avatars, and video thumbnails are **locked and non-interactive**.
  - Touching numbers or graphs on camera behaves like a real app with zero popup interruptions.
* **Edit Mode**:
  - Activated from the Launcher or the top bar.
  - An indicator banner appears, allowing you to tap any stat, product photo, thumbnail, or profile picture to customize it on the fly.
  - Tap **Done** to return to clean Film Mode.

---

## 📦 Phase Progression System

* The app comes configured with **Phase 1: The Beginning** as a clean starting point.
* Use the **Control Center** to create and duplicate subsequent phases (e.g. *Phase 2: First $10K Month*, *Phase 3: Viral Spike*, *Phase 4: Climax*) to match your production episodes.
* Switching a Phase updates YouTube Studio, Shopify, Ledger, and Banking metrics simultaneously.

---

## 🧭 Interactions (Ledger & Shopify)

* **Count-up**: balances / sales / orders count up from 0 when a screen opens, when you return to it, and after a refresh.
* **Pull-to-refresh**: pull down from the top of Ledger or Shopify (touch, or click-drag on desktop). The spinner shows, then numbers re-count and the Shopify chart redraws. Values never change.
* **Ledger screens**: tap an account (or a coin in Market) → price chart with 1H/1D/1W/1M/1Y/All + operations. Bottom tabs: Portfolio, Market, Earn, Discover, Swap. The eye icon hides balances.
* **Shopify screens**: bottom pill → Search, Home, Orders (tap an order for detail), Products, Menu (also the ☰ button). Order history is generated from your store numbers; the first N orders are "unfulfilled" to match the Home card, so edit *Orders to fulfill* / *Payment to capture* in Edit Mode.
* Coin prices for coins you don't hold are placeholders in `EXTRA_COINS` (`src/components/platforms/ledger/LedgerScreens.tsx`).
