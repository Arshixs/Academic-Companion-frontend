import { ThemeProvider } from "@/components/theme-provider";
import { Dashboard } from "./components/pages/dashboard";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AssignmentPage from "./components/pages/assignment";
import AttendancePage from "./components/pages/attendance";
import NotesPage from "./components/pages/notes";

function App() {
  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Router>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/assignment" element={<AssignmentPage />} />
            <Route path="/attendance" element={<AttendancePage />} />
            <Route path="/notes" element={<NotesPage />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </>
  );
}

export default App;
