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

function App() {
  return (
    <>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <Routes>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="/" element={<ComingSoon />} />

          <Route
            path="/flow"
            element={
              <DefaultLayout>
                <FlowList />
              </DefaultLayout>
            }
          />
          <Route
            path="/flow/:id"
            element={
              <DefaultLayout>
                <FlowDetails />
              </DefaultLayout>
            }
          />
          <Route
            path="/forms-templates"
            element={
              <DefaultLayout>
                <FormTemplates />
              </DefaultLayout>
            }
          />
          <Route
            path="/add-form-template"
            element={
              <DefaultLayout>
                <AddFormTemplate />
              </DefaultLayout>
            }
          />
        </Routes>
      </ThemeProvider>
    </>
  );
}

export default App;
