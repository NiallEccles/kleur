import Link from "next/link";
import { ReactNode } from "react";
import {MenuItem} from "@/types/MenuItem";

const NavLink = ({ href, icon, label }: MenuItem) => {
    return (
        <Link
            href={href}
            className="flex text-lg md:text-lg font-semibold items-center normal-case ml-5 mb-2 lg:mb-0"
        >
            {icon}
            <span className="ml-2">{label}</span>
        </Link>
    );
};

export default NavLink;
