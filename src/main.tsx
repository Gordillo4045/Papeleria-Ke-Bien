import ReactDOM from 'react-dom/client'
import App from './App.tsx'
<<<<<<< HEAD
import { NextUIProvider } from "@nextui-org/react";
import { CartProvider } from './components/CartContext';
import { Toaster } from 'sonner';
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <NextUIProvider>
    <CartProvider>
      <App />
      <Toaster richColors position="bottom-center" />
    </CartProvider>
  </NextUIProvider>
=======
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <App />
>>>>>>> 0030282a25106a93c977e9c7eadf615004467787
)
