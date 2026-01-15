# Project Context: Zap

## Project Overview
- **Name:** Zap
- **Type:** React Web Application (Vite)
- **Status:** Modernized and optimized for high-performance link management.

## Deployment & Multi-Environment Setup
- **Hosting:** Primary target is GitHub Pages (`/zap/` subpath).
- **Base Path Strategy:** 
    - **Development:** Root-based (`/`) for standard `localhost:5173` access.
    - **Production:** Subdirectory-based (`/zap/`).
    - **Implementation:** Controlled via conditional `base` in `vite.config.js` and `import.meta.env.BASE_URL` for the Router `basename`.
- **Environment Management:** 
    - Dedicated `.env.development` (local API) and `.env.production` (remote API).
    - `src/api/api.js` includes a safety layer to prevent `undefined` string concatenation if environment variables are missing.

## Architectural Patterns
- **API Management:** Fully migrated from `fetch` to **Axios**.
    - **Interceptors:** Implemented global request interceptors for token attachment and response interceptors for seamless 401/Refresh handling and session expiration logic.
    - **Service Layer:** Refactored into a minimalist pattern where services handle data normalization while interceptors handle infrastructure concerns (auth, retries, parsing).
- **Layout System (`AppLayout.jsx`):** 
    - Uses a `flex flex-col` structure to enable perfect vertical centering.
    - **Conditional Centering:** The Hero section uses a `pb-14` offset to balance the sticky header, ensuring true visual centering on the landing page.
- **Global UI Framework:**
    - **Theme:** Consistent "Zap Dark" aesthetic (`bg-gray-900`, `border-gray-800`, `rounded-2xl`).
    - **Fluidity:** Container is 100% width on mobile/tablet and caps at a focused `1000px` on desktop.
- **State & Notifications:**
    - **Toasts:** Standardized on `sonner` for all feedback (Copy, Delete, Create, Auth).
    - **Modals:** `@radix-ui/react-dialog` used for critical confirmations (Logout, Delete) and the Create Link flow.

## Data Visualization & Analytics
- **Responsive Stats:** Replaced heavy chart libraries with a custom, CSS-based horizontal progress bar system (`DeviceStats`, `LocationStats`).
- **Optimization:** Analytics are limited to the **Top 5** results with an "& X others..." summary to maintain a clean vertical estate.
- **Color Coding:** Standardized colors for differentiation: **Blue** for Location and **Green** for Device data.
- **Data Cleaning (`apiUrls.js`):** 
    - Normalizes `ua-parser-js` device types (e.g., `undefined` -> `desktop`).
    - Standardizes `ipapi.co` location data to "Unknown" if fields are missing.

## UI/UX Specifics
- **Link Cards:** 
    - **Robust Truncation:** Uses a combination of `min-w-0`, `w-full`, and `truncate` to ensure no text ever breaks the card box, even when wrapped.
    - **Action Buttons:** Circular, high-contrast buttons with purpose-specific hover states (Blue/Green/Red).
- **Auth Flow:** 
    - Redundant headers removed; context is provided by stylized active tabs.
    - Autofill Logic: Redirects from landing page trigger the Create Link modal automatically only if a URL is actually present in the query params.
- **Mobile Polish:**
    - **iOS Zoom Fix:** All inputs set to `text-base` (16px) to prevent automatic browser zooming on focus.
    - **Breakpoint Control:** Cards maintain a horizontal layout down to the `sm` breakpoint to maximize space usage.

## Assets
- **Favicon:** Custom-designed `favicon.svg` featuring a lightning bolt "Z" to match the "Zap" brand identity.
