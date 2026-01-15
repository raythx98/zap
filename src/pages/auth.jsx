import Login from "@/components/login";
import Signup from "@/components/signup";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {UrlState} from "@/context";
import {useEffect} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";

import {toast} from "sonner";

function Auth() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const {isAuthenticated, loading, logoutAction} = UrlState();
  const longLink = sessionStorage.getItem("urlToCreate");

  useEffect(() => {
    if (searchParams.get("session_expired")) {
      toast.error("Session expired. Please log in again.");
      logoutAction();
    }
  }, [searchParams, logoutAction]);

  useEffect(() => {
    if (isAuthenticated && !loading)
      navigate("/dashboard?isLoggedIn=true");
  }, [isAuthenticated, loading, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] gap-6 px-4">
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight text-center">
          {longLink
            ? "Wait! Let's get you set up"
            : "Welcome to Zap"}
        </h1>
        <p className="text-gray-500 font-medium text-sm sm:text-base text-center max-w-[350px]">
          {longLink
            ? "Sign in to track analytics and manage your new link."
            : "Sign in to access click analytics, geolocation data, and custom links."}
        </p>
      </div>
      
      <Tabs defaultValue="login" className="w-full max-w-[400px]">
        <TabsList className="grid w-full grid-cols-2 bg-gray-900 border border-gray-800 h-12 p-1 rounded-xl">
          <TabsTrigger 
            value="login" 
            className="rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all font-bold"
          >
            Login
          </TabsTrigger>
          <TabsTrigger 
            value="signup"
            className="rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all font-bold"
          >
            Signup
          </TabsTrigger>
        </TabsList>
        <TabsContent value="login" className="mt-4">
          <Login />
        </TabsContent>
        <TabsContent value="signup" className="mt-4">
          <Signup />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Auth;
