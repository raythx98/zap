# Requirements

## 1. UI Modernization
### Buttons & Navigation
- **Global Header:**
  - Replace `HomeIcon` with a modern "Home" button.
  - Ensure "Login" button uses a consistent modern style.
- **Dashboard:**
  - Replace the settings dropdown (Gear icon) with separate, easily accessible buttons:
    - **Links:** Navigates to the dashboard, the same button should be implemented in the landing page if user is logged in.
    - **Logout:** Logs the user out.
- **Landing Page:**
  - Modernize the "Shorten!" button and ensure consistent styling for all primary actions.

### Dashboard Stats
- **Stat Cards:** Modernize the display of "Links Created" and "Total Clicks".
  - Use improved typography and layout.
  - Consider adding icons or better card styling.

## 2. Functional Improvements
- **Dashboard Search:** Remove the non-clickable funnel icon from the search bar.
- **Toasts:** Implement a global toast notification system (using `sonner`) for actions like link creation, deletion, and copying.
- **Card Clickability:** In the Dashboard, clicking anywhere on a `LinkCard` (except for specific action buttons) should navigate to the link details page.

## 3. Responsive Fixes
- **Centering:** Remove hardcoded `marginTop` offsets (e.g., `15vh`, `20vh`). Use CSS flexbox/grid to properly center the Landing page and Login modals across all screen sizes.
- **Device Stats:** Fix the `DeviceStats` pie chart labels being cut off on smaller screens.
- **QR Code Styling:** Ensure the QR code outline/border in `LinkCard` is consistent and matches the styling in the Link details page (fix missing bottom border/alignment).

## 4. Technical Tasks
- Install `sonner`.
- Update `vite.config.js` or `App.jsx` to include the Toast provider.
- Refactor `LinkCard.jsx`, `Header.jsx`, `Dashboard.jsx`, `LandingPage.jsx`, and `Auth.jsx`.