import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "./components/mode-toggle";
import { NavigationMenuDemo } from "./components/nav-bar";
import { Dashboard } from "./components/pages/dashboard";


function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Dashboard />
    </ThemeProvider>
  );
}

export default App;
