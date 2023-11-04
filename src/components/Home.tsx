import Card from "./Card"
import NavBar from "./NavBar"
export default function Home(){
    return (
        <>
        <NavBar/>
        <div className="grid grid-flow-col grid-cols-auto bg-slate-50 h-screen xl:mx-36">
            <div className="bg-red-300 rounded-l-md">Home</div>
            <div className="bg-blue-300 pt-5 rounded-r-md"><Card/></div>
        </div>
        </>
    )
}