import Card from "./Card"
import NavBar from "./NavBar"
export default function Home(){
    return (
        <>
        <NavBar/>
        <div className="grid grid-flow-col grid-cols-auto bg-slate-50 h-screen xl:mx-36">
            <div className=" rounded-l-md text-center font-bold text-2xl">Filtros</div>
            <div className=" pt-5 rounded-r-md "><Card/></div>
        </div>
        </>
    )
}