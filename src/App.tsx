import { ThemeProvider } from "@/components/theme-provider";
import { Dashboard } from "./components/pages/dashboard";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AssignmentPage from "./components/pages/assignment";

function App() {
  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Router>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/assignment" element={<AssignmentPage />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </>
  );
}

export default App;
