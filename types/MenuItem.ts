import {JSX, ReactElement } from "react";

export type MenuItem = {
    href: string;
    label: string;
    icon: ReactElement;
}

export type NewMenuItems = {
    label: string;
    colour: string
    subItems: ({
        label: string;
        href: string;
        description: string;
        icon: JSX.Element;
    } | {
        label: string;
        href: string;
        description: string;
        icon?: undefined;
    })[] }[]