import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
<<<<<<< HEAD
import Home from './components/Home'
import ErrorPage from './components/ErrorPage'
import ProductsTable from './components/Controlpanel'
=======
import Home from './components/Home';
import ErrorPage from './components/ErrorPage';
import ProductsTable from './components/Controlpanel';
import { Toaster } from "sonner";
import { NextUIProvider } from "@nextui-org/react";
>>>>>>> 0030282a25106a93c977e9c7eadf615004467787

function App() {

  return (
<<<<<<< HEAD
    <Router>
      <Routes>

        <Route path='/' element={<Home />} />
        <Route path='/controlpanel' element={<ProductsTable />} />
        <Route path='*' element={<ErrorPage />} />
      </Routes>
    </Router>
=======
    <NextUIProvider>
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
    </NextUIProvider>
>>>>>>> 0030282a25106a93c977e9c7eadf615004467787
  )
}

export default App;
