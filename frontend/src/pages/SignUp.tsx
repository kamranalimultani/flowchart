// src/pages/SignUp.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate, Link } from "react-router-dom";
import { LoaderIcon, ArrowRight } from "lucide-react";

import bgImage from "@/assets/transparent-sg.png";
import { postRequest, formatValidationErrors } from "@/utils/apiUtils";
import { useNotification } from "@/context/NotificationContext";

interface RegisterResponse {
  success: boolean;
  message: string;
  user: {
    id: number;
    name: string;
    email: string;
    subscription_type: string;
    status: string;
  };
}

interface CheckoutResponse {
  success: boolean;
  message: string;
  checkout_url: string;
  checkout_id: string;
}

function SignUp() {
  const navigate = useNavigate();
  const { showSuccess, showError, showWarning } = useNotification();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    company_name: "",
    industry: "",
    subscription_type: "free_trial",
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear field error when user starts typing
    if (fieldErrors[e.target.name]) {
      setFieldErrors({ ...fieldErrors, [e.target.name]: "" });
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (!formData.company_name.trim()) {
      errors.company_name = "Company name is required";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      showWarning("Please fix the errors in the form");
      return;
    }

    setLoading(true);

    try {
      // Register user
      const userResponse = await postRequest("/api/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        company_name: formData.company_name,
        industry: formData.industry,
        subscription_type: formData.subscription_type,
      });

      if (!userResponse.success) {
        showError(userResponse.message || "Registration failed");
        return;
      }

      showSuccess("Account created successfully!");

      // Handle paid subscription
      if (formData.subscription_type === "paid") {
        try {
          const checkoutResponse = await postRequest("/create-checkout", {
            user_id: userResponse.user.id,
          });

          if (checkoutResponse.success && checkoutResponse.checkout_url) {
            showSuccess("Redirecting to payment...");
            setTimeout(() => {
              window.location.href = checkoutResponse.checkout_url;
            }, 1000);
          } else {
            showError("Failed to create checkout. Please contact support.");
          }
        } catch (checkoutError: any) {
          if (checkoutError) {
            showError(checkoutError.message);
          } else {
            showError("Payment setup failed. Please try again.");
          }
        }
      } else {
        // Free trial - redirect to login
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      }
    } catch (error: any) {
      if (error) {
        // Handle specific error codes
        switch (error.errorCode) {
          case "EMAIL_EXISTS":
            showError(
              "An account with this email already exists. Please login instead."
            );
            setFieldErrors({ email: "Email already registered" });
            break;

          case "NETWORK_ERROR":
            showError("Network error. Please check your internet connection.");
            break;

          default:
            showError(error.message);

            // Handle validation errors with proper typing
            if (error.errors) {
              const newFieldErrors = formatValidationErrors(error.errors);
              setFieldErrors(newFieldErrors);
            }
        }
      } else {
        showError("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex">
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-2">
            <Link to="/" className="inline-block">
              <h1 className="text-4xl font-black bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                MelvokFlow
              </h1>
            </Link>
            <p className="text-muted-foreground text-sm">
              Create your account to get started
            </p>
          </div>

          <Card className="border-2">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">Sign up</CardTitle>
              <CardDescription>
                Start your journey with MelvokFlow
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    className={`h-11 ${
                      fieldErrors.name ? "border-red-500" : ""
                    }`}
                  />
                  {fieldErrors.name && (
                    <p className="text-sm text-red-600">{fieldErrors.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className={`h-11 ${
                      fieldErrors.email ? "border-red-500" : ""
                    }`}
                  />
                  {fieldErrors.email && (
                    <p className="text-sm text-red-600">{fieldErrors.email}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      className={`h-11 ${
                        fieldErrors.password ? "border-red-500" : ""
                      }`}
                    />
                    {fieldErrors.password && (
                      <p className="text-sm text-red-600">
                        {fieldErrors.password}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`h-11 ${
                        fieldErrors.confirmPassword ? "border-red-500" : ""
                      }`}
                    />
                    {fieldErrors.confirmPassword && (
                      <p className="text-sm text-red-600">
                        {fieldErrors.confirmPassword}
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <Label>Company Details</Label>
                  <div className="space-y-3 mt-2">
                    <div>
                      <Input
                        name="company_name"
                        placeholder="Company Name"
                        value={formData.company_name}
                        onChange={handleChange}
                        className={
                          fieldErrors.company_name ? "border-red-500" : ""
                        }
                      />
                      {fieldErrors.company_name && (
                        <p className="text-sm text-red-600 mt-1">
                          {fieldErrors.company_name}
                        </p>
                      )}
                    </div>
                    <Input
                      name="industry"
                      placeholder="Industry (optional)"
                      value={formData.industry}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <Label>Choose Subscription Type</Label>
                  <select
                    name="subscription_type"
                    value={formData.subscription_type}
                    onChange={handleChange}
                    className="w-full border rounded-md h-11 px-3 mt-2"
                  >
                    <option value="free_trial">Free Trial</option>
                    <option value="paid">Paid (via Lemon Squeezy)</option>
                  </select>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 font-semibold"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Sign Up
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <div className="text-sm text-center text-muted-foreground">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-primary hover:underline"
                >
                  Sign in
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>

      <div
        className="hidden lg:flex flex-1 items-center justify-center p-12 relative bg-gray-100 overflow-hidden"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundPosition: "center",
          backgroundRepeat: "repeat",
        }}
      >
        <div className="absolute inset-0 bg-white/70 backdrop-blur-xs"></div>
        <div className="relative max-w-2xl space-y-8 text-center text-muted z-10">
          <h2 className="text-5xl font-bold tracking-tight text-muted">
            Get started with Flow Survey!
          </h2>
          <p className="text-lg text-muted-muted">
            Build, manage, and automate workflows for your entire company in one
            place. <br />
            <span className="text-sm font-black">Powered By Melvok.com</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
