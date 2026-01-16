# Project Context: Zap

## Project Overview
- **Name:** Zap
- **Type:** High-performance React URL Shortener (Vite/Tailwind)
- **Status:** Modernized, optimized, and fully functional.

## Deployment & Multi-Environment Setup
- **Hosting Strategy:** Optimized for GitHub Pages with a `/zap/` subpath.
- **Base Path Logic:**
    - **Development:** Root-based (`/`) for standard local development.
    - **Production:** Subdirectory-based (`/zap/`).
    - **Implementation:** Controlled via `vite.config.js` and `import.meta.env.BASE_URL` in the Router.
- **API Connectivity:** 
    - Dedicated `.env.development` and `.env.production`.
    - `src/api/api.js` centralizes Axios instances with pre-configured Basic and Bearer auth.

## Architectural Patterns
- **API Management:** Centralized Axios with global interceptors.
    - **Request Interceptor:** Automatically attaches JWT access tokens.
    - **Response Interceptor:** Handles 401 Unauthorized errors by attempting an automatic token refresh before failing over to session expiration handling.
- **State & Authentication:**
    - **Global Auth:** `UrlState` (Context API) provides real-time authentication status application-wide.
    - **Persistence:** Custom `session.js` helper manages JWT storage in `localStorage`.
- **UI Architecture:**
    - **shadcn/ui Pattern:** Composable components using `cva` (Class Variance Authority) and `cn` utility for flexible styling.
    - **Dark Aesthetic:** Consistent "Zap Dark" theme (`bg-gray-900`, `border-gray-800`).
- **Error Handling:**
    - Centralized `error-handler.js` parses API responses and triggers standardized `sonner` toasts.

## Feature-Specific Implementation Details
- **Redirect Logic:** Uses a `useRef` guard and active loading state to prevent flickering or double-triggering during navigation.
- **Link Creation Flow:**
    - **Intelligent Formatting:** `formatlink.js` automatically handles missing protocols (adding `https://`) and URL normalization.
    - **Guest Support:** Unauthenticated users can shorten links; the state is preserved in `sessionStorage` until they choose to create or sign in.
- **Analytics:** 
    - Custom CSS-based visualization (Device & Location stats).
    - Uses `ua-parser-js` for device detection and `ipapi.co` for geographic insights.

## Asset & Polish
- **Branding:** Custom lightning bolt "Z" favicon.
- **UX:** `framer-motion` style animations (e.g., `animate-shake` on invalid inputs) and Radix UI primitives for accessible modals/tabs.
- **QR Codes:** Integrated `react-qrcode-logo` with download capability.

---
*Last updated: Friday, January 16, 2026*
