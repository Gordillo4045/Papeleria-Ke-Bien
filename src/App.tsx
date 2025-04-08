import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from './components/Home';
import ErrorPage from './components/ErrorPage';
import ProductsTable from './components/Controlpanel';
import { Toaster } from "sonner";
import { HeroUIProvider } from "@heroui/react";
import { CartProvider } from "./components/CartContext";
import ThemeProvider from "./components/ThemeProvider";
import { useTheme } from "./components/useTheme";
import Catalogo from "./components/Catalogo";

function AppContent() {
  const { theme } = useTheme();

  return (
    <div className={`${theme} text-foreground bg-background`}>
      <Router>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/catalogo' element={<Catalogo />} />
          <Route path='/controlpanel' element={<ProductsTable />} />
          <Route path='*' element={<ErrorPage />} />
        </Routes>
      </Router>
      <Toaster richColors position="bottom-center" />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <HeroUIProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </HeroUIProvider>
    </ThemeProvider>
  );
}

export default App;