import LogIn from './components/LogIn';
import Home from './components/Home';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import ErrorPage from './components/ErrorPage';
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <LogIn/>
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
