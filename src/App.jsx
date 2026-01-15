import "./App.css";
import {RouterProvider, createBrowserRouter} from "react-router-dom";
import { Toaster } from "sonner";
import UrlProvider from "./context";

import AppLayout from "./layouts/app-layout";
import RequireAuth from "./components/require-auth";
import ErrorBoundary from "./components/error-boundary";

import RedirectLink from "./pages/redirect-link";
import LandingPage from "./pages/landing";
import Dashboard from "./pages/dashboard";
import LinkPage from "./pages/link";
import Auth from "./pages/auth";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "/auth",
        element: <Auth />,
      },
      {
        path: "/dashboard",
        element: (
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        ),
      },
      {
        path: "/link/:id",
        element: (
          <RequireAuth>
            <LinkPage />
          </RequireAuth>
        ),
      },
      {
        path: "/:id",
        element: <RedirectLink />,
      },
    ],
  },
], {
  basename: import.meta.env.BASE_URL,
});

function App() {
  return (
    <UrlProvider>
      <ErrorBoundary>
        <Toaster richColors />
        <RouterProvider router={router} />
      </ErrorBoundary>
    </UrlProvider>
  );
}

export default App;
