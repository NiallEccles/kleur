import { useTheme } from "next-themes";
import {Dispatch, SetStateAction, useEffect, useState} from "react";

export const useCommandItems = (setOpen: Dispatch<SetStateAction<boolean>>) => {
    const { setTheme, theme } = useTheme();
    const [currentTheme, setCurrentTheme] = useState(theme);

    const themeCommand = () => {
        if (theme === 'dark') {
           setTheme('light');
           setCurrentTheme('light')
        } else {
            setTheme('dark');
            setCurrentTheme('dark')
        }
        setOpen(false);
    }

    useEffect(() => {

    }, [currentTheme]);

    const commandItems = [
        {
            label: currentTheme === 'dark' ? 'Set Light Theme' : 'Set Dark Theme',
            action: themeCommand,
            icon: null
        }
    ];

    return commandItems;
}