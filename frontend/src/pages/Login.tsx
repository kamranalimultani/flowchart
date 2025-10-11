/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
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
import { LoaderIcon, Workflow, Shield, Zap, ArrowRight } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "store";
import { postRequest } from "@/utils/apiUtils";
import { setUser } from "@/slice/userSlice";

function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state: RootState) => state.user);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await postRequest("/api/login", {
        email,
        password,
      });

      const { token, user } = data;
      localStorage.setItem("auth", JSON.stringify({ token, userId: user.id }));
      dispatch(setUser(user));
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex">
      <Helmet>
        <title>
          Login – MelvokFlow | Flowchart & Survey Builder for Automations
        </title>
        <meta
          name="description"
          content="Sign in to MelvokFlow — the visual flowchart and survey builder to create automated workflows, forms, and surveys without code. Secure, fast, and designed for teams."
        />
        <meta
          name="keywords"
          content="flowchart builder, survey maker, workflow automation, visual flow builder, no-code automation, form builder, MelvokFlow"
        />
        <link rel="canonical" href="https://melvokflow.com/login" />

        {/* Open Graph / Facebook */}
        <meta
          property="og:title"
          content="Login – MelvokFlow | Flowchart & Survey Builder"
        />
        <meta
          property="og:description"
          content="Sign in to MelvokFlow to create and manage visual workflows and surveys. Build automations, collect responses, and monitor analytics — no code required."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://melvokflow.com/login" />
        <meta
          property="og:image"
          content="https://melvokflow.com/og-image.png"
        />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Login – MelvokFlow | Flowchart & Survey Builder"
        />
        <meta
          name="twitter:description"
          content="Sign in to MelvokFlow to build visual workflows and surveys without writing code. Secure, collaborative, and enterprise-ready."
        />
        <meta
          name="twitter:image"
          content="https://melvokflow.com/og-image.png"
        />

        {/* Structured Data */}
        <script type="application/ld+json">{`{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Login – MelvokFlow",
          "url": "https://melvokflow.com/login",
          "description": "Sign in to MelvokFlow — the visual flowchart and survey builder to create automated workflows, forms, and surveys without code.",
          "publisher": {
            "@type": "Organization",
            "name": "MelvokFlow",
            "url": "https://melvokflow.com"
          },
           "sameAs": [
          "https://www.reddit.com/user/kamranalimultani/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button",
          "https://www.instagran.com/melvok.official"
        ]
        }`}</script>
      </Helmet>
      {/* Left Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8">
          {/* Logo and Header */}
          <div className="text-center space-y-2">
            <Link to="/" className="inline-block">
              <h1 className="text-4xl font-black bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                MelvokFlow
              </h1>
            </Link>
            <p className="text-muted-foreground text-sm">
              Streamline your workflow automation
            </p>
          </div>

          {/* Login Card */}
          <Card className="border-2">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
              <CardDescription>
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      to="/forgot-password"
                      className="text-sm text-primary hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-11"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 font-semibold"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign in
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="text-sm text-center text-muted-foreground">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="font-semibold text-primary hover:underline"
                >
                  Sign up for free
                </Link>
              </div>
            </CardFooter>
          </Card>

          {/* Trust indicators */}
          <div className="text-center text-xs text-muted-foreground">
            <p>
              By signing in, you agree to our{" "}
              <Link to="/terms" className="underline hover:text-foreground">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="underline hover:text-foreground">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Feature Showcase */}
      <div className="hidden lg:flex flex-1 bg-muted p-12 items-center justify-center">
        <div className="max-w-lg space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold tracking-tight">
              Automate your workflow with ease
            </h2>
            <p className="text-lg text-muted-foreground">
              Build powerful automation flows without writing a single line of
              code. Save time and boost productivity.
            </p>
          </div>

          {/* Feature highlights */}
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="rounded-lg bg-primary/10 p-3">
                <Workflow className="h-6 w-6 text-primary" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold">Visual Flow Builder</h3>
                <p className="text-sm text-muted-foreground">
                  Create complex workflows with our intuitive drag-and-drop
                  interface
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="rounded-lg bg-primary/10 p-3">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold">Real-time Analytics</h3>
                <p className="text-sm text-muted-foreground">
                  Monitor your workflows with comprehensive analytics and
                  insights
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="rounded-lg bg-primary/10 p-3">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold">Enterprise Security</h3>
                <p className="text-sm text-muted-foreground">
                  Bank-level encryption and security for your sensitive data
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 pt-8 border-t">
            <div className="space-y-1">
              <div className="text-3xl font-bold">10K+</div>
              <div className="text-sm text-muted-foreground">Active Users</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-bold">50M+</div>
              <div className="text-sm text-muted-foreground">
                Flows Executed
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-bold">99.9%</div>
              <div className="text-sm text-muted-foreground">Uptime</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
