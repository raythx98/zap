import Header from "@/components/header";
import {Outlet, useLocation} from "react-router-dom";

const AppLayout = () => {
  const {pathname} = useLocation();
  const isLandingPage = pathname === "/";

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className={`flex-1 container flex flex-col ${!isLandingPage ? 'pt-4' : ''}`}>
        <div className={`flex-1 flex flex-col w-full ${isLandingPage ? 'items-center justify-center pb-14' : ''}`}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
