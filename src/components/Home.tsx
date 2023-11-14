import Card from "./Card"
import NavBar from "./NavBar"
export default function Home(){
    return (
        <div className="bg-gray-50 h-items">
        <NavBar/>
        <div className="grid grid-flow-col grid-cols-auto bg-slate-50 h-screen xl:mx-36">
            <div className=" rounded-l-md text-center font-bold text-2xl shadow-md">Filtros Cambio</div>
            <div className=" pt-5 rounded-r-md shadow-inner"><Card/></div>
        </div>
        </div>
    )
}