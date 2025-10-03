import React from "react";
import { ThemeProvider } from "@/components/theme-provider";
import ComingSoon from "./pages/comingsoon";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DefaultLayout from "./layouts/mainLayout";
import { FlowList } from "./pages/FlowList";
import { FlowDetails } from "./pages/FlowDetails";
import { FormTemplates } from "./pages/FormTemplates";
import AddFormTemplate from "./pages/AddFormTemplate";
import PrivateRoute from "./utils/ProtectedRoutes";
import { Dashboard } from "./pages/Dashboard";
import { LandingPage } from "./pages/LandingPage";

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <Routes>
        {/* Public routes */}
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="/" element={<LandingPage />} />

        {/* Protected routes with PrivateRoute per route */}
        <Route
          path="/flow"
          element={
            <PrivateRoute
              bypass={false}
              element={
                <DefaultLayout>
                  <FlowList />
                </DefaultLayout>
              }
            />
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute
              bypass={false}
              element={
                <DefaultLayout>
                  <Dashboard />
                </DefaultLayout>
              }
            />
          }
        />
        <Route
          path="/flow/:id"
          element={
            <PrivateRoute
              bypass={false}
              element={
                <DefaultLayout>
                  <FlowDetails />
                </DefaultLayout>
              }
            />
          }
        />
        <Route
          path="/forms-templates"
          element={
            <PrivateRoute
              bypass={false}
              element={
                <DefaultLayout>
                  <FormTemplates />
                </DefaultLayout>
              }
            />
          }
        />
        <Route
          path="/add-form-template"
          element={
            <PrivateRoute
              bypass={false}
              element={
                <DefaultLayout>
                  <AddFormTemplate />
                </DefaultLayout>
              }
            />
          }
        />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
