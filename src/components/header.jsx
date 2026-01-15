import {logout} from "@/api/apiAuth";
import useFetch from "@/hooks/use-fetch";
import {Link, useNavigate, useLocation} from "react-router-dom";
import {BarLoader} from "react-spinners";
import {Button} from "./ui/button";
import {UrlState} from "@/context";
import {Home, LogIn, LinkIcon, LogOut} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {useState} from "react";

const Header = () => {
  const {loading, fn: fnLogout} = useFetch(logout);
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const {user, fetchUser} = UrlState();

  const handleLogout = () => {
    fnLogout().then(() => {
      fetchUser();
      setIsLogoutModalOpen(false);
      toast.success("Logged out successfully!");
      navigate("/auth");
    });
  };

  const isLandingPage = location.pathname === "/";
  const isLinkPage = location.pathname.startsWith("/link/");

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-800/50 bg-background/80 backdrop-blur-md">
      <nav className="container py-2 flex justify-between items-center h-14">
        <div className="flex items-center gap-4 w-32">
          {isLandingPage ? (
            user ? (
              <Button 
                variant="secondary" 
                onClick={() => navigate("/dashboard")} 
                className="font-bold flex items-center gap-2 shadow-sm"
              >
                <LinkIcon className="h-4 w-4" />
                <span>Dashboard</span>
              </Button>
            ) : null
          ) : isLinkPage ? (
            <Button 
              variant="secondary" 
              onClick={() => navigate("/dashboard")} 
              className="font-bold flex items-center gap-2 shadow-sm"
            >
              <LinkIcon className="h-4 w-4" />
              <span>Dashboard</span>
            </Button>
          ) : (
            <Button 
              variant="secondary" 
              onClick={() => navigate("/")} 
              className="font-bold flex items-center gap-2 shadow-sm"
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Button>
          )}
        </div>
        
        <div className="flex gap-4">
          {!user ? (
            <Button 
              onClick={() => navigate("/auth")} 
              className="flex items-center gap-2 font-semibold"
            >
              <LogIn className="h-4 w-4" />
              <span>Login</span>
            </Button>
          ) : (
            <>
              <Dialog open={isLogoutModalOpen} onOpenChange={setIsLogoutModalOpen}>
                <DialogTrigger asChild>
                  <Button variant="destructive" className="flex items-center gap-2 font-semibold shadow-md">
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Confirm Logout</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to log out of your account?
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="flex gap-2">
                    <Button variant="outline" onClick={() => setIsLogoutModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleLogout} disabled={loading}>
                      Logout
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </>
          )}
        </div>
      </nav>
      {loading && <BarLoader width={"100%"} color="#36d7b7" />}
    </header>
  );
};

export default Header;
