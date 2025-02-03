import Link from "next/link";
import NavLink from "../nav-link/nav-link";
import { PaletteIcon, SwatchBook, CirclePlus } from "lucide-react";

export default function Nav() {
    const menuItems = [
        {
            path: '/palettes',
            label: 'Palettes',
            icon: <PaletteIcon />,
        },
        {
            path: '/gradients',
            label: 'Gradients',
            icon: <SwatchBook />,
        },
        {
            path: '/create',
            label: 'Create',
            icon: <CirclePlus />,
        },
    ];
    return (
        <nav className="navbar bg-base-100">
            <div className="flex-1">
                <Link href="/" className="btn btn-ghost normal-case text-xl font-bold kleur-title">
                    kleur
                </Link>
            </div>
            <div className="flex">
                    {
                        menuItems.map((item, index) => (
                            <NavLink key={index} path={item.path} label={item.label} icon={item.icon} />
                        ))
                    }
                </div>
        </nav>
    );
}
