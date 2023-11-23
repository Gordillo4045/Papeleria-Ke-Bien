import { FaFacebookSquare, FaWhatsappSquare, FaReact } from "react-icons/fa";
import { BiLogoGmail, BiLogoTypescript, BiLogoFirebase } from "react-icons/bi";
import { SiVite, SiTailwindcss } from "react-icons/si";

export default function Footer() {
    return (
        <div className="grid grid-rows-2 md:grid-rows-none md:grid-flow-col rounded-b-xl">
            <div className="p-4 row-span-3">
                <span className="font-bold">Ubicacion</span>
                <p className="text-sm">Zona norte, Avenida F, Zona Norte, 22000 Tijuana, B.C.</p>
            </div>
            <div className="rounded-b-xl col-span-2 md:pt-4">
                <div className="flex items-center place-content-center md:place-content-start self-center gap-3 ">
                    <a href="https://www.facebook.com/people/Papeleria-Ke-bien/61553994592502/" target="_blank">
                        <FaFacebookSquare size={"2rem"} color={"blue"} />
                    </a>
                    <a href="https://wa.me/6631257749" target="_blank">
                        <FaWhatsappSquare size={"2rem"} color={"green"} />
                    </a>
                    <a href="mailto:pape.kebien@gmail.com" target="_blank">
                        <BiLogoGmail size={"2rem"} color={"red"} />
                    </a>
                </div>
                <div className="flex gap-1 place-content-end p-2 row-span-2 col-span-2">
                    <FaReact />
                    <BiLogoTypescript />
                    <SiTailwindcss />
                    <BiLogoFirebase />
                    <SiVite />
                </div>
            </div>
        </div>
    )
}