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
        <div className='flex w-full p-5 sticky z-5 bg-white align-baseline items-baseline'>
            <Link href="/" className="normal-case text-xl font-bold flex-1">
                kleur
            </Link>
            <NavigationMenu>
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <NavigationMenuTrigger>Library</NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                                {/*<li className="row-span-3">*/}
                                {/*    <NavigationMenuLink asChild>*/}
                                {/*        <a*/}
                                {/*            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"*/}
                                {/*            href="/"*/}
                                {/*        >*/}
                                {/*            <div className="mb-2 mt-4 text-lg font-medium">*/}
                                {/*                kleur*/}
                                {/*            </div>*/}
                                {/*            <p className="text-sm leading-tight text-muted-foreground">*/}
                                {/*                Beautifully designed components built with Radix UI and*/}
                                {/*                Tailwind CSS.*/}
                                {/*            </p>*/}
                                {/*        </a>*/}
                                {/*    </NavigationMenuLink>*/}
                                {/*</li>*/}
                                <ListItem href="/palettes" title="Palettes">
                                    Explore curated color sets to spark your creativity
                                </ListItem>
                                <ListItem href="/gradients" title="Gradients">
                                    Create smooth transitions between colors
                                </ListItem>
                                <ListItem href="/colours" title="Colours">
                                    Browse and explore a wide range of colors
                                </ListItem>
                            </ul>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuTrigger>Create</NavigationMenuTrigger>
                        <NavigationMenuContent>
                            {/*<ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">*/}
                            {/*    {menuItems.map((component) => (*/}
                            {/*        <ListItem*/}
                            {/*            key={component.href}*/}
                            {/*            title={component.label}*/}
                            {/*            href={component.href}*/}
                            {/*        >*/}
                            {/*            {component.label}*/}
                            {/*        </ListItem>*/}
                            {/*    ))}*/}
                            {/*</ul>*/}
                            <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                                <ListItem href="/create/palette" title="Palette">
                                    Build your own custom color palette
                                </ListItem>
                                <ListItem href="/create/gradient" title="Gradient">
                                    Design your own linear gradients
                                </ListItem>
                                <ListItem href="/create/radial-gradient" title="Radial Gradient">
                                    Create vibrant radial gradients
                                </ListItem>
                            </ul>
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
            <Search menuItems={menuItems}/>
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
