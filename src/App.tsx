import { ThemeProvider } from "@/components/theme-provider";
import { Dashboard } from "./components/pages/dashboard";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AssignmentPage from "./components/pages/assignment";
import AttendancePage from "./components/pages/attendance";
import { LoginForm } from "./components/pages/login";
import { SignUpForm } from "./components/pages/signup";
import PrivateRoute from "../utils/PrivateRoute"; // Make sure this path is correct
import { AuthProvider } from "../context/AuthContext"; // Make sure this path is correct
import { Toast } from "./components/ui/toast";
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <>
      <Toaster />
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <Router>
            <AuthProvider>
              <Routes>
                <Route
                  path="/"
                  element={<PrivateRoute element={Dashboard} />}
                />
                <Route
                  path="/dashboard"
                  element={<PrivateRoute element={Dashboard} />}
                />
                <Route
                  path="/assignment"
                  element={<PrivateRoute element={AssignmentPage} />}
                />
                <Route
                  path="/attendance"
                  element={<PrivateRoute element={AttendancePage} />}
                />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/signup" element={<SignUpForm />} />
              </Routes>
            </AuthProvider>
          </Router>
        </ThemeProvider>
    </>
  );
}

export default App;
