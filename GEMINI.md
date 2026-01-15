# Project Context: Zap

## Project Overview
- **Name:** Zap
- **Type:** React Web Application (Vite)
- **Status:** Modernized and configured for multi-environment deployment.

## Deployment & Environments
- **Hosting:** Configured for GitHub Pages (`/zap/` subpath) in production.
- **Dynamic Base Path:**
    - **Development:** Uses `/` (accessible at `http://localhost:5173`).
    - **Production:** Uses `/zap/` (controlled via `vite.config.js` and `import.meta.env.BASE_URL`).
- **Environment Variables:**
    - `.env.development`: Points to local API (default `http://localhost:8000/api/`).
    - `.env.production`: Points to production API.
- **GitHub Actions:** Automatically deploys to GitHub Pages on push to `master`, handles `404.html` hack for SPA routing.

## Architectural Choices
- **Routing:** Uses `react-router-dom` with `createBrowserRouter` and dynamic `basename`.
- **UI Framework:** Tailwind CSS with a consistent "Zap Dark" theme (`bg-gray-900`, `border-gray-800`, `rounded-2xl`).
- **Icons:** Standardized on `lucide-react` for a clean, consistent look.
- **Notifications:** Integrated `sonner` for global toast notifications (Copy, Create, Delete, Auth actions).
- **Modals:** Uses `@radix-ui/react-dialog` for confirmation modals (Logout, Delete) and the Create Link flow.

## UI/UX Patterns
- **Container Strategy:** Fluid layout on mobile/tablet, capped at a focused `1000px` max-width on desktops.
- **Landing Page:** Full-screen Hero section, vertically centered below the sticky header. The FAQ section has been removed for a cleaner initial experience.
- **Link Cards:** Revamped with clear uppercase labels (e.g., "TITLE"), robust truncation with ellipses, and circular action buttons with purpose-specific hover colors.
- **Auth Flow:** Modernized Login/Signup with labeled inputs and a streamlined "Wait! Let's get you set up" header for landing-page redirects.
- **Mobile First:** All inputs are `text-base` (16px) to prevent iOS auto-zoom. Horizontal layout for cards is maintained down to the `sm` breakpoint.

## Technical Details
- **QR Code Strategy:** Generated client-side using `react-qrcode-logo`. Construction uses `window.location.origin + import.meta.env.BASE_URL + path` to ensure accuracy in both dev and prod.
- **Button Component:** Enhanced global `Button` component with automatic `truncate` and `flex` centering for content (icons + text).
- **Layout Logic:** `AppLayout` handles conditional vertical centering for the landing page while maintaining standard top-alignment for internal pages.
