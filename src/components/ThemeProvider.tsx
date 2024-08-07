import { createContext, useEffect, useState } from "react";

const ThemeContext = createContext<any>(undefined);
export default function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState(() => localStorage.getItem("theme") ?? "dark");

    const toggleTheme = () => {
        const newTheme = localStorage.getItem("theme") == "dark" ? "light" : "dark";
        document.querySelector("body")?.classList.replace(theme, newTheme);
        localStorage.setItem("theme", newTheme);
        setTheme(newTheme);
    }

    useEffect(() => {
        document.querySelector("body")?.classList.add(theme, "text-foreground", "bg-background");
    })

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}