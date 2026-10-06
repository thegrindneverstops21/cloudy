import { createContext, useContext } from "react";

export type Theme = "light" | "dark";

export interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

//create context for the theme 
export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

//custom hook 
export function useTheme() {
    const context = useContext(ThemeContext);
    if(!context) {
        throw new Error("useTheme must be used within theme provider")
    }
    return context;
}