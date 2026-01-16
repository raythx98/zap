import {useNavigate} from "react-router-dom";
import {useEffect} from "react";
import {UrlState} from "@/context";
import {BarLoader} from "./ui/loaders";

function RequireAuth({children}) {
  const navigate = useNavigate();
  const {isAuthenticated} = UrlState();

  useEffect(() => {
    if (!isAuthenticated) navigate("/auth");
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return <BarLoader width={"100%"} color="#36d7b7" />;

  return children;
}

export default RequireAuth;
