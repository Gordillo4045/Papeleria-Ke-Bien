import Home from './components/Home'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ErrorPage from './components/ErrorPage'
import ProductsTable from './components/Table'
function App() {

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/controlpanel' element={<ProductsTable />} />
        <Route path='*' element={<ErrorPage />} />
      </Routes>
    </Router>
  )
}

export default App
