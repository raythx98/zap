import {useEffect, useState} from "react";
import Error from "./error";
import {Input} from "./ui/input";
import {z} from "zod";
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
import {signup} from "@/api/apiAuth";
import {BeatLoader} from "react-spinners";
import useFetch from "@/hooks/use-fetch";
import {UrlState} from "@/context";
import { toast } from "sonner";

const Signup = () => {
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    profile_pic: null,
  });

  const handleInputChange = (e) => {
    const {name, value, files} = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: files ? files[0] : value,
    }));
  };

  const {loading, error, fn: fnSignup, data} = useFetch(signup, formData);
  const {setIsAuthenticated} = UrlState();

  useEffect(() => {
    if (error === null && data) {
      setIsAuthenticated(true);
      toast.success("Account created successfully!");
      navigate("/dashboard?isLoggedIn=true");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, data]);

  const handleSignup = async () => {
    setErrors({});
    try {
      const schema = z.object({
        email: z
          .string()
          .min(1, "Email is required")
          .email("Invalid email")
          .max(255, "Email must be at most 255 characters"),
        password: z
          .string()
          .min(6, "Password must be at least 6 characters")
          .max(255, "Password must be at most 255 characters"),
      });

      schema.parse(formData);
      await fnSignup();
    } catch (e) {
      if (e instanceof z.ZodError) {
        const newErrors = {};
        e.issues.forEach((err) => {
          newErrors[err.path[0]] = err.message;
        });
        setErrors(newErrors);
      } else {
        setErrors({api: e.message});
      }
    }
  };

  return (
    <Card className="bg-gray-900 border-gray-800 rounded-2xl shadow-2xl p-2">
      <CardContent className="space-y-6">
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
            placeholder="Minimum 6 characters"
            onChange={handleInputChange}
            className="bg-gray-800 border-gray-700 focus:border-blue-500 transition-all"
          />
          {errors.password && <Error message={errors.password} />}
        </div>
      </CardContent>
      <CardFooter className="mt-2">
        <Button 
          onClick={handleSignup}
          className="w-full h-12 text-lg font-bold bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-lg"
          disabled={loading}
        >
          {loading ? (
            <BeatLoader size={10} color="white" />
          ) : (
            "Create Account"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Signup;
