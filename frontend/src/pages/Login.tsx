/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
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
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { LoaderIcon } from "lucide-react";
import bgImage from "../assets/pexels-elijahsad-5418830.jpg"; // Replace with your image URL
import { useSelector } from "react-redux";
import type { RootState } from "store";
function Login() {
  const navigate = useNavigate();
  const [loading, setloading] = useState(false);
  const { user } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, []);
  // const backgroundImageUrl = "src/assets/182428240217.jpg"; // Replace with your image URL
  const handleSubmit = (e: any) => {
    setloading(true);
    e.preventDefault();

    // API call to login

    setloading(false); // Ensure the variable name matches your code convention
  };
  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh", // Full height
        width: "100%", // Full width
      }}
    >
      <div className="absolute inset-0 "></div>

      <Card className="w-[350px] ">
        <CardHeader>
          <CardTitle className="text-3xl pt-0">LogIn</CardTitle>
          <CardDescription>Here comes some descrtiptions</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">E-mail</Label>
                <Input id="name" placeholder="example@gmail.com" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input type="password" id="password" placeholder="******" />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col justify-between pb-2">
          {/* <h6 className="text-sm">Done have account? Create now!</h6> */}
          {/* <Button variant="outline">Cancel</Button> */}
          <Button className="w-full " onClick={handleSubmit}>
            {loading ? (
              <>
                <LoaderIcon className="animate-spin" color="black" />
                Loading...
              </>
            ) : (
              "LogIn"
            )}
          </Button>
          <p className="pt-2">
            Don't have an account?{" "}
            <Link to={"/sign-up"} className="text-blue-400">
              SignUp Now
            </Link>
          </p>
        </CardFooter>
        {/* //stest */}
      </Card>
    </div>
  );
}

export default Login;
