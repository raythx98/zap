# Full Stack URL Shortener (Zap)

Frontend has been [forked](https://github.com/piyush-eon/url-shortener) with significant changes and optimization for static hosting.

## Features
- **URL Shortening:** Create short, manageable links.
- **Analytics:** Track redirects, geolocation (city/country), and device data.
- **Personal Dashboard:** Manage all your links in one place.
- **Secure Auth:** Secure password storage following OWASP recommendations.

## Tech Stack
- **Frontend:** React JS (Vite), Tailwind CSS, Shadcn UI
- **Backend:** [Go API](https://github.com/raythx98/url-shortener) hosted at `https://129.150.49.141.sslip.io/api/`

## Deployment
This project is configured for **GitHub Pages** deployment.

### Automatic Deployment
Pushing to the `master` branch triggers the GitHub Actions workflow which:
1. Builds the Vite application with the necessary environment variables.
2. Creates a `404.html` fallback to support React Router SPAs on GitHub Pages.
3. Deploys to the `/zap` subdirectory.

### GitHub Secrets
To enable deployment, you must configure the following secret in your repository:
- `BASIC_AUTH_PASSWORD`: The password for basic authentication with the backend API.

Note: Other variables like `VITE_API_URL` and `VITE_BASIC_AUTH_USERNAME` are currently managed within the workflow file.

## Setup & Development
1. Clone the repository.
2. Install dependencies: `npm install`.
3. Create a `.env` file with `VITE_API_URL`, `VITE_BASIC_AUTH_USERNAME`, and `VITE_BASIC_AUTH_PASSWORD`.
4. Run locally: `npm run dev`.
