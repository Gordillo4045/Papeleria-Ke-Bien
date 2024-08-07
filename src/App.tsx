import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from './components/Home';
import ErrorPage from './components/ErrorPage';
import ProductsTable from './components/Controlpanel';
import { Toaster } from "sonner";
import { NextUIProvider } from "@nextui-org/react";
import { CartProvider } from "./components/CartContext";
import ThemeProvider from "./components/ThemeProvider";
import { useTheme } from "./components/useTheme";

function AppContent() {
  const { theme } = useTheme();

  return (
    <div className={`${theme} text-foreground bg-background`}>
      <Router>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/controlpanel' element={<ProductsTable />} />
          <Route path='*' element={<ErrorPage />} />
        </Routes>
      </Router>
      <Toaster richColors position="bottom-right" />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <NextUIProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </NextUIProvider>
    </ThemeProvider>
  );
}

export default App;