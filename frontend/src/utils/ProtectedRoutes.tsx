import React, { useEffect, useState } from "react";
import { Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getRequest } from "@/utils/apiUtils"; // Ensure this utility exists and handles 'auth/me' fetching
import { setUser, clearUser } from "@/slice/userSlice";
import type { RootState } from "store";

interface PrivateRouteProps {
  bypass: boolean;
  element: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ bypass, element }) => {
  const { user } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(!bypass);
  const [allowed, setAllowed] = useState(bypass);

  // Logout helper
  const logout = () => {
    localStorage.removeItem("auth");
    dispatch(clearUser());
  };

  useEffect(() => {
    let mounted = true;

    const fetchUserData = async () => {
      if (bypass) {
        setAllowed(true);
        setLoading(false);
        return;
      }

      try {
        const latestUser = await getRequest("/api/auth/me", true);

        if (!mounted) return;

        if (!latestUser) {
          logout();
          setAllowed(false);
        } else {
          dispatch(setUser(latestUser));
          setAllowed(true);
        }
      } catch (error) {
        console.error("User fetch failed:", error);
        logout();
        setAllowed(false);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchUserData();

    return () => {
      mounted = false;
    };
  }, [bypass, dispatch]);

  if (loading) {
    // Optionally a loading spinner or placeholder
    return <div>Loading...</div>;
  }

  if (!allowed) {
    // User not authenticated or not allowed, redirect to login
    return <Navigate to="/login" replace />;
  }

  // Render the route with wrapped element and children if any
  return <>{element}</>;
};

export default PrivateRoute;
