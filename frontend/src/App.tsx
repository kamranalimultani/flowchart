import { ThemeProvider } from "@/components/theme-provider";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import DefaultLayout from "./layouts/mainLayout";
import { FlowList } from "./pages/FlowList";
import { FlowDetails } from "./pages/FlowDetails";
import { FormTemplates } from "./pages/FormTemplates";
import AddFormTemplate from "./pages/AddFormTemplate";
import PrivateRoute from "./utils/ProtectedRoutes";
import { Dashboard } from "./pages/Dashboard";
import { LandingPage } from "./pages/LandingPage";
import Documentation from "./pages/Documents";
import SignUp from "./pages/SignUp";
import PaymentSuccess from "./pages/PaymentSuccess";
import { NotificationProvider } from "./context/NotificationContext";
import { HelmetProvider } from "react-helmet-async";
import BlogsPage from "./pages/Blogs";

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <NotificationProvider>
          <Routes>
            {/* Public routes */}
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<SignUp />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />

            <Route
              path="/"
              element={
                <DefaultLayout>
                  <LandingPage />
                </DefaultLayout>
              }
            />
            <Route
              path="/blogs"
              element={
                <DefaultLayout>
                  <BlogsPage />
                </DefaultLayout>
              }
            />
            <Route
              path="/documentation"
              element={
                <DefaultLayout>
                  <Documentation />
                </DefaultLayout>
              }
            />

            {/* Protected routes with PrivateRoute per route */}
            <Route
              path="/flows"
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
              path="/flow-shared"
              element={
                <DefaultLayout>
                  <FlowDetails />
                </DefaultLayout>
              }
            />
            <Route
              path="/flow"
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
        </NotificationProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
