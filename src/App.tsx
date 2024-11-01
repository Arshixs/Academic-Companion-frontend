import { ThemeProvider } from "@/components/theme-provider";
import { Dashboard } from "./components/pages/dashboard";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AssignmentPage from "./components/pages/assignment";
import AttendancePage from "./components/pages/attendance";
import { LoginForm } from "./components/pages/login";
import { SignUpForm } from "./components/pages/signup";
import PrivateRoute from "../utils/PrivateRoute"; // Make sure this path is correct
import { AuthProvider } from "../context/AuthContext"; // Make sure this path is correct
import { NotesGrid } from "./components/pages/notes/notegrid";
import Calendar from "./components/pages/calendar";

function App() {
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
                path="/calendar"
                element={<PrivateRoute element={Calendar} />}
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
