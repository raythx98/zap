import {useEffect, useState, useActionState} from "react";
import {Input} from "./ui/input";
import {z} from "zod";
import {
  Card,
  CardContent,
  CardFooter,
} from "./ui/card";
import {Button} from "./ui/button";
import {useNavigate} from "react-router-dom";
import {signup} from "@/api/apiAuth";
import {BeatLoader} from "./ui/loaders";
import {UrlState} from "@/context";
import { toast } from "sonner";

const Signup = () => {
  const navigate = useNavigate();
  const {setIsAuthenticated} = UrlState();
  const [errors, setErrors] = useState({});

  const [state, formAction, isPending] = useActionState(async (prevState, formData) => {
    const data = Object.fromEntries(formData);
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

      schema.parse(data);
      await signup(data);
      return { success: true };
    } catch (e) {
      if (e instanceof z.ZodError) {
        const newErrors = {};
        e.issues.forEach((err) => {
          newErrors[err.path[0]] = err.message;
        });
        setErrors(newErrors);
        return { success: false };
      }
      return { success: false, error: e.message };
    }
  }, { success: null });

  useEffect(() => {
    if (state?.success) {
      setIsAuthenticated(true);
      toast.success("Account created successfully!");
      navigate("/dashboard");
    }
  }, [state, navigate, setIsAuthenticated]);

  return (
    <Card className="bg-gray-900 border-gray-800 rounded-2xl shadow-2xl p-2">
      <form action={formAction}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email Address</span>
            <Input
              name="email"
              type="email"
              placeholder="e.g. ray@example.com"
              error={!!errors.email}
              className="bg-gray-800 border-gray-700 focus:border-blue-500 transition-all"
            />
            {errors.email && <span className="text-red-500 text-xs ml-1">{errors.email}</span>}
          </div>
          
          <div className="space-y-2">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Password</span>
            <Input
              name="password"
              type="password"
              placeholder="Minimum 6 characters"
              error={!!errors.password}
              className="bg-gray-800 border-gray-700 focus:border-blue-500 transition-all"
            />
            {errors.password && <span className="text-red-500 text-xs ml-1">{errors.password}</span>}
          </div>
        </CardContent>
        <CardFooter className="mt-2">
          <Button 
            type="submit"
            className="w-full h-12 text-lg font-bold bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-lg"
            disabled={isPending}
          >
            {isPending ? (
              <BeatLoader size={10} color="white" />
            ) : (
              "Create Account"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default Signup;