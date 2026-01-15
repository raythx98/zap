import {Input} from "./ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {Button} from "./ui/button";
import {useNavigate, useSearchParams} from "react-router-dom";
import {useEffect, useState} from "react";
import * as Yup from "yup";
import Error from "./error";
import {login} from "@/api/apiAuth";
import {CreateLink} from "@/components/create-link";
import {BeatLoader} from "react-spinners";
import useFetch from "@/hooks/use-fetch";
import {UrlState} from "@/context";
import { toast } from "sonner";

const Login = () => {
  let [searchParams] = useSearchParams();
  const longLink = searchParams.get("createNew");
  const isLoggedIn = searchParams.get("isLoggedIn");

  const navigate = useNavigate();

  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const {name, value} = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const {loading, error, fn: fnLogin, data} = useFetch(login, formData);
  const {fetchUser} = UrlState();

  useEffect(() => {
    if (error === null && data) {
      fetchUser();
      toast.success("Logged in successfully!");
      navigate(`/dashboard?isLoggedIn=true${longLink ? `&createNew=${longLink}` : ""}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, data]);

  const handleLogin = async () => {
    setErrors([]);
    try {
      const schema = Yup.object().shape({
        email: Yup.string()
          .email("Invalid email")
          .required("Email is required")
          .max(255, "Email must be at most 255 characters"),
        password: Yup.string()
          .min(6, "Password must be at least 6 characters")
          .max(255, "Password must be at most 255 characters")
          .required("Password is required"),
      });

      await schema.validate(formData, {abortEarly: false});
      await fnLogin();
    } catch (e) {
      const newErrors = {};

      e?.inner?.forEach((err) => {
        newErrors[err.path] = err.message;
      });

      setErrors(newErrors);
    }
  };

  return (
    <Card className="bg-gray-900 border-gray-800 rounded-2xl shadow-2xl p-2">
      {error && (
        <CardHeader>
          <Error message={error.message} />
        </CardHeader>
      )}
      <CardContent className="space-y-6 pt-4">
        <div className="space-y-2">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email Address</span>
          <Input
            name="email"
            type="email"
            placeholder="e.g. ray@example.com"
            onChange={handleInputChange}
            className="bg-gray-800 border-gray-700 focus:border-blue-500 transition-all"
          />
          {errors.email && <Error message={errors.email} />}
        </div>
        
        <div className="space-y-2">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Password</span>
          <Input
            name="password"
            type="password"
            placeholder="Enter your password"
            onChange={handleInputChange}
            className="bg-gray-800 border-gray-700 focus:border-blue-500 transition-all"
          />
          {errors.password && <Error message={errors.password} />}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4 mt-2">
        <Button 
          onClick={handleLogin} 
          className="w-full h-12 text-lg font-bold bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-lg"
          disabled={loading}
        >
          {loading ? <BeatLoader size={10} color="white" /> : "Login"}
        </Button>
        <div className="flex items-center gap-4 w-full">
          <div className="h-[1px] bg-gray-800 flex-1" />
          <span className="text-xs font-bold text-gray-600 uppercase">OR</span>
          <div className="h-[1px] bg-gray-800 flex-1" />
        </div>
        <CreateLink 
          buttonText="Continue as Guest" 
          variant="destructive"
          className="w-full h-12 text-lg font-bold transition-all shadow-lg"
        />
      </CardFooter>
    </Card>
  );
};

export default Login;
