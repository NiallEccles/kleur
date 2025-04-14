import Link from "next/link";
import NavLink from "../nav-link/nav-link";
import {PaletteIcon, SwatchBook, CirclePlus, Menu, PaintBucket, Blend} from "lucide-react";
import { useState, ReactElement } from "react";
import Search from "@/components/search/search";
import {MenuItem} from "@/types/MenuItem";
import {
    NavigationMenu, NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList, NavigationMenuTrigger
} from "@/components/ui/navigation-menu";

export default function Nav() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const menuItems: MenuItem[] = [
        {
            href: '/colour-harmony',
            label: 'Colour Harmony',
            icon: <Blend />,
        },
        {
            href: '/colours',
            label: 'Colours',
            icon: <PaintBucket />,
        },
        {
            href: '/palettes',
            label: 'Palettes',
            icon: <PaletteIcon />,
        },
        {
            href: '/gradients',
            label: 'Gradients',
            icon: <SwatchBook />,
        },
        {
            href: '/create',
            label: 'Create',
            icon: <CirclePlus />,
        },
    ];

    const toggleMenu = () => {
        setIsMenuOpen(prev => !prev);
    };

    return (
        <div>
            <Link href="/" className="normal-case text-xl font-bold kleur-title">
                kleur
            </Link>
            <NavigationMenu className="navbar bg-base-100 relative flex p-5 w-full">
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <NavigationMenuTrigger>Tools</NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <NavigationMenuLink>Link</NavigationMenuLink>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuTrigger>Create</NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <NavigationMenuLink>Link</NavigationMenuLink>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
            {/* Mobile Menu Button */}
            <div className='btn-circle lg:hidden' onClick={toggleMenu}>
                <Menu/>
            </div>
            {/* Menu Items */}
            {isMenuOpen && (
                <div
                    className="flex flex-col lg:hidden absolute right-2 top-16 bg-white p-3 rounded-lg shadow-2xl z-10 items-start">
                    {
                        menuItems.map((item, index) => (
                            <NavLink key={index} href={item.href} label={item.label} icon={item.icon}/>
                        ))
                    }
                </div>
            )}
            {/* Desktop Menu Items */}
            {/*<div className="hidden lg:flex">*/}
            {/*    {*/}
            {/*        menuItems.map((item, index) => (*/}
            {/*            <NavLink key={index} path={item.path} label={item.label} icon={item.icon}/>*/}
            {/*        ))*/}
            {/*    }*/}
            {/*    <Search menuItems={menuItems} />*/}
            {/*</div>*/}
        </div>
    );
}
