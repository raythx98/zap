# Project Context: Zap

## Project Overview
- **Name:** Zap
- **Type:** React Web Application (Vite)
- **Current Task:** Transition from EC2 deployment to static deployment on GitHub Pages.

## Learnings & Context
- The project is a React app built with Vite.
- Previously deployed to AWS EC2 (evidenced by `.github/workflows/aws.yml`).
- Evaluation for GitHub Pages:
    - **Suitability:** High. It's a client-side React app with an external API.
    - **Routing:** Uses `react-router-dom` with `createBrowserRouter`. This requires a `404.html` fallback on GitHub Pages to handle direct navigation to subpaths.
    - **Environment Variables:** Needs `VITE_API_URL`, `VITE_BASIC_AUTH_USERNAME`, and `VITE_BASIC_AUTH_PASSWORD` during build. Currently configured to `https://129.150.49.141.sslip.io/api/`.
    - **Build Output:** Vite defaults to `dist/`.
- **Deployment Trigger:** Configured to deploy automatically on push to the `master` branch.
- **Base Path:** Set to `base: "/zap/"` in `vite.config.js` and `basename: "/zap"` in `createBrowserRouter` (`src/App.jsx`) to correctly handle subdirectory hosting on GitHub Pages.
- **Relative Assets:** Updated `index.html` to use relative paths for assets to avoid issues with absolute root redirects.
- **404.html Hack:** Since GitHub Pages doesn't support SPA routing natively, the deployment workflow copies `index.html` to `404.html`. This ensures that any direct request to a subpath (e.g., `/dashboard`) is handled by the React app instead of showing a GitHub 404 page.
- **Secrets:** Ensure `BASIC_AUTH_PASSWORD` is set in GitHub Repository Secrets.

## URL & QR Code Strategy
- **Base Path Issue:** `window.location.origin` does not include the subdirectory (e.g., `/zap`). This causes generated links to point to the root domain (incorrect) instead of the app path.
- **Client-Side QR:** The project has `react-qrcode-logo` installed. We should prefer generating QR codes on the client side to:
    1.  Fix the URL path issue dynamically.
    2.  Remove dependency on backend-generated images.
    3.  Improve performance (no image fetch).
- **Correct URL Construction:** Use `window.location.origin + import.meta.env.BASE_URL + link_id`. Note that `import.meta.env.BASE_URL` usually implies a trailing slash, so handle concatenation carefully.