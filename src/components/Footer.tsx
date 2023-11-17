import { FaFacebookSquare, FaWhatsappSquare, FaReact } from "react-icons/fa";
import { BiLogoGmail, BiLogoTypescript, BiLogoFirebase } from "react-icons/bi";
import { SiVite, SiTailwindcss } from "react-icons/si";

export default function Footer() {
    return (
        <div className="grid grid-cols-2 rounded-b-xl bg-green-300">
            <div className="p-4">
                <span className="font-bold">Ubicacion</span>
                <p className="text-sm">Zona norte, Avenida F, Zona Norte, 22000 Tijuana, B.C.</p>
            </div>
            <div className="rounded-b-xl">
                <div className="flex items-center self-center gap-3">
                    <FaFacebookSquare size={"2.5rem"} color={"blue"} />
                    <FaWhatsappSquare size={"2.5rem"} color={"green"} />
                    <BiLogoGmail size={"2.5rem"} color={"red"} />

                </div>
                <div className="flex gap-1 place-content-end p-2">
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