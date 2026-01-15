# Requirements

## Active Tasks
- [ ] (None)

## Future/Pending
- [ ] (None)

## Completed
- [x] Initial Project Setup
- [x] AWS to GitHub Pages Migration
- [x] **Fix URL Generation & Implement Client-Side QR Codes**
    - **Problem:** "My Links" page generates incorrect URLs (e.g., `https://domain.com/link` instead of `https://domain.com/zap/link`).
    - **Solution:** Update URL construction to include the project's base path (`/zap/`).
    - **Implementation:**
        - Use `react-qrcode-logo` (already installed) to generate QR codes on the frontend.
        - Replace backend-provided QR images (`url.qr`) with the React component.
        - Ensure the QR code value and the displayed text link both correctly use the full path including the subdirectory.
        - Update the "Download" functionality to download the generated client-side QR code.
