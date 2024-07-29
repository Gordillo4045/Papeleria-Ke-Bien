import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { NextUIProvider } from "@nextui-org/react";
import { Toaster } from 'sonner';
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <NextUIProvider>
    <App />
    <Toaster richColors position="bottom-center" />
  </NextUIProvider>
)
