import Link from "next/link";
import NavLink from "../nav-link/nav-link";
import {PaletteIcon, SwatchBook, CirclePlus, Menu, PaintBucket, Blend} from "lucide-react";
import {useState, ReactElement, forwardRef, ElementRef, ComponentPropsWithoutRef} from "react";
import Search from "@/components/search/search";
import {MenuItem} from "@/types/MenuItem";
import {
    NavigationMenu, NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList, NavigationMenuTrigger
} from "@/components/ui/navigation-menu";
import {cn} from "@/lib/utils";
import {MobileNav} from "@/components/ui/mobile-nav";
import {ThemeToggle} from "@/components/theme-toggle/theme-toggle";
import useMenuItems from "@/customHooks/useMenuItems";

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

    const newMenuItems = useMenuItems();

    const ListItem = forwardRef<
        ElementRef<"a">,
        ComponentPropsWithoutRef<"a">
    >(({ className, title, children, ...props }, ref) => {
        return (
            <li>
                <NavigationMenuLink asChild>
                    <a
                        ref={ref}
                        className={cn(
                            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                            className
                        )}
                        {...props}
                    >
                        <div className="text-sm font-medium leading-none">{title}</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            {children}
                        </p>
                    </a>
                </NavigationMenuLink>
            </li>
        )
    })
    ListItem.displayName = "ListItem"

    return (
        <div className='flex w-full p-5 sticky z-5 dark:bg-black bg-white items-center top-0'>
            <Link href="/" className="normal-case text-xl font-bold flex-1">
                kleur
            </Link>
            <NavigationMenu className="hidden sm:block">
                <NavigationMenuList>
                    {
                        newMenuItems.map((menuItem, index) => (
                            <NavigationMenuItem key={menuItem.label} className={`hover:[&_button]:${menuItem.colour}!`}>
                                <NavigationMenuTrigger className={`data-[state=open]:${menuItem.colour}!`}>{menuItem.label}</NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                                        {
                                            menuItem.subItems.map((subItem) => (
                                                <ListItem key={subItem.label} href={subItem.href} title={subItem.label}>
                                                    {subItem.description}
                                                </ListItem>
                                            ))
                                        }
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                        ))
                    }
                </NavigationMenuList>
            </NavigationMenu>
            {/* Mobile Menu Button */}
            {/*<div className='btn-circle lg:hidden' onClick={toggleMenu}>*/}
            {/*    <Menu/>*/}
            {/*</div>*/}
            <MobileNav menuItems={newMenuItems} />
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
            <div className='flex gap-3 items-center'>
                <Search menuItems={menuItems}/>
                <ThemeToggle />
            </div>
            {/* Desktop Menu Items*/}
            {/*<div className="hidden lg:flex">*/}
            {/*    {*/}
            {/*        menuItems.map((item, index) => (*/}
            {/*            <NavLink key={index} href={item.href} label={item.label} icon={item.icon}/>*/}
            {/*        ))*/}
            {/*    }*/}
            {/*</div>*/}
        </div>
    );
}
