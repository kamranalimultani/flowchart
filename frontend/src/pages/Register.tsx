/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/customComponents/LoginCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { LoaderIcon } from "lucide-react";
import bgImage from "../assets/pexels-elijahsad-5418830.jpg";
import { postRequest } from "@/utils/apiUtils";

const initialFormState = {
  name: "",
  email: "",
  password: "",
  confirm_password: "",
};

function Register() {
  const [form, setForm] = useState(initialFormState);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Local validation (same as Laravel rules)
  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!form.name) errs.name = "Name is required.";
    if (!form.email) errs.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Email is invalid.";
    if (!form.password) errs.password = "Password is required.";
    else if (form.password.length < 6)
      errs.password = "Password must be at least 6 characters.";
    if (form.password !== form.confirm_password)
      errs.confirm_password = "Passwords do not match.";
    return errs;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      setLoading(false);
      return;
    }

    try {
      const res = await postRequest("/api/register", {
        name: form.name,
        email: form.email,
        password: form.password,
      });

      // If registration is successful, navigate to company step
      if (res?.user_id) {
        navigate(`/dashboard`);
      } else {
        setErrors({ general: "Something went wrong. Try again." });
      }
    } catch (error: any) {
      console.error("Error:", error);
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({ general: "Registration failed." });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage: `url(${bgImage})`,
      }}
    >
      <Card className="w-[350px] ">
        <CardHeader>
          <CardTitle className="text-3xl pt-0">Sign Up</CardTitle>
          <CardDescription>Create your SurveyFlow account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                />
                {errors.name && <p className="text-red-500">{errors.name}</p>}
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="example@gmail.com"
                />
                {errors.email && <p className="text-red-500">{errors.email}</p>}
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  type="password"
                  id="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="******"
                />
                {errors.password && (
                  <p className="text-red-500">{errors.password}</p>
                )}
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="confirm_password">Confirm Password</Label>
                <Input
                  type="password"
                  id="confirm_password"
                  value={form.confirm_password}
                  onChange={handleChange}
                  placeholder="******"
                />
                {errors.confirm_password && (
                  <p className="text-red-500">{errors.confirm_password}</p>
                )}
              </div>
            </div>
            {errors.general && (
              <p className="text-red-500 mt-2">{errors.general}</p>
            )}
            <Button
              type="submit"
              className="w-full cursor-pointer mt-4"
              disabled={loading}
            >
              {loading ? (
                <>
                  <LoaderIcon className="animate-spin mr-2" />
                  Loading...
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col justify-between pb-2">
          <p className="pt-2 text-sm">
            Already have an account?{" "}
            <Link to={"/login"} className="text-blue-400 cursor-pointer">
              Login Now
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Register;
