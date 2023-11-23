import Home from './components/Home'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import ErrorPage from './components/ErrorPage'
import ProductsTable from './components/Table'
function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/papeleria-ke-bien' Component={Home}/>
        <Route path='/papeleria-ke-bien/controlpanel' Component={ProductsTable}/>
        <Route path='*' Component={ErrorPage}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
