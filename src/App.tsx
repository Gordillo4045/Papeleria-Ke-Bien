import Home from './components/Home'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import ErrorPage from './components/ErrorPage'
import ControlPanel from './components/ControlPanel';
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/Papeleria-Ke-Bien",
    element: <Home />,
  },
  {
    path: "/Papeleria-Ke-Bien/controlpanel",
    element: <ControlPanel />,
  },
  {
    path: "/controlpanel",
    element: <ControlPanel/>
  },
  {
    path: "*",
    element: <ErrorPage/>
  }
])


function App() {

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
