import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from './components/Home';
import ErrorPage from './components/ErrorPage';
import ProductsTable from './components/Controlpanel';
import { Toaster } from "sonner";
import { NextUIProvider } from "@nextui-org/react";
import { CartProvider } from "./components/CartContext";
import ThemeProvider from "./components/ThemeProvider";

function App() {

  return (
    <ThemeProvider>
      <NextUIProvider>
        <CartProvider>
          <div className={` text-foreground bg-background`}>
            <Router>
              <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/controlpanel' element={<ProductsTable />} />
                <Route path='*' element={<ErrorPage />} />
              </Routes>
            </Router>
            <Toaster richColors position="bottom-center" />
          </div>
        </CartProvider>
      </NextUIProvider>
    </ThemeProvider>
  )
}

export default App;
