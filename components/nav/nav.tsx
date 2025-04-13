import Link from "next/link";
import NavLink from "../nav-link/nav-link";
import { PaletteIcon, SwatchBook, CirclePlus, Menu, PaintBucket, Blend } from "lucide-react";
import { useState } from "react";

export default function Nav() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const menuItems = [
        {
            path: '/colour-harmony',
            label: 'Colour Harmony',
            icon: <Blend />,
        },
        {
            path: '/colours',
            label: 'Colours',
            icon: <PaintBucket />,
        },
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

    const toggleMenu = () => {
        setIsMenuOpen(prev => !prev);
    };

    return (
        <nav className="navbar bg-base-100 relative flex p-5">
            <div className="flex-1">
                <Link href="/" className="normal-case text-xl font-bold kleur-title">
                    kleur
                </Link>
            </div>
            {/* Mobile Menu Button */}
            <div className='btn-circle lg:hidden' onClick={toggleMenu}>
                <Menu />
            </div>
            {/* Menu Items */}
            {isMenuOpen && (
                <div className="flex flex-col lg:hidden absolute right-2 top-16 bg-white p-3 rounded-lg shadow-2xl z-10 items-start">
                    {
                        menuItems.map((item, index) => (
                            <NavLink key={index} path={item.path} label={item.label} icon={item.icon} />
                        ))
                    }
                </div>
            )}
            {/* Desktop Menu Items */}
            <div className="hidden lg:flex">
                {
                    menuItems.map((item, index) => (
                        <NavLink key={index} path={item.path} label={item.label} icon={item.icon} />
                    ))
                }
            </div>
        </nav>
    );
}
