import { ThemeProvider } from "@/components/theme-provider";
import { Dashboard } from "./components/pages/dashboard";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AssignmentPage from "./components/pages/assignment";
import AttendancePage from "./components/pages/attendance";
import { LoginForm } from "./components/pages/login";
import { SignUpForm } from "./components/pages/signup";
import PrivateRoute from "../utils/PrivateRoute"; // Make sure this path is correct
import { AuthProvider } from "../context/AuthContext"; // Make sure this path is correct
import { NotesGrid } from "./components/pages/notes/notegrid";
import { Toaster } from "./components/ui/toaster";
import Calendar from "./components/pages/calendar";
import LandingPage from "./components/pages/home";
import CodeEditor from "./components/pages/code_editor";
import Cookies from "js-cookie";
import ProfilePage from "./components/pages/profile";

function App() {
  const access = Cookies.get("access_token") || null;

  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Router>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<PrivateRoute element={Dashboard} />} />
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
              <Route
                path="/notes"
                element={<PrivateRoute element={NotesGrid} />}
              />
              <Route
                path="/profile"
                element={<PrivateRoute element={ProfilePage} />}
              />
              <Route
                path="/calendar"
                element={<PrivateRoute element={Calendar} />}
              />
              <Route path="/home" element={<LandingPage />} />
              <Route path="/code" element={<CodeEditor />} />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/signup" element={<SignUpForm />} />
              {/* Redirect any other routes to /home */}
              <Route
                path="*"
                element={
                  access ? (
                    <Navigate to="/dashboard" replace />
                  ) : (
                    <Navigate to="/home" replace />
                  )
                }
              />
            </Routes>
          </AuthProvider>
        </Router>
      </ThemeProvider>
      <Toaster />
    </>
  );
}

export default App;
