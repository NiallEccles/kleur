"use client"

import Link from "next/link";
import {
  PaletteIcon,
  SwatchBook,
  CirclePlus,
  PaintBucket,
  Blend,
} from "lucide-react";
import {
  forwardRef,
  ElementRef,
  ComponentPropsWithoutRef,
} from "react";
import Search from "@/components/search/search";
import { MenuItem } from "@/types/MenuItem";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { MobileNav } from "@/components/ui/mobile-nav";
import useMenuItems from "@/customHooks/useMenuItems";

export default function Nav() {
  const menuItems: MenuItem[] = [
    {
      href: "/colour-harmony",
      label: "Colour Harmony",
      icon: <Blend />,
    },
    {
      href: "/colours",
      label: "Colours",
      icon: <PaintBucket />,
    },
    {
      href: "/palettes",
      label: "Palettes",
      icon: <PaletteIcon />,
    },
    {
      href: "/gradients",
      label: "Gradients",
      icon: <SwatchBook />,
    },
    {
      href: "/create",
      label: "Create",
      icon: <CirclePlus />,
    },
  ];

  const newMenuItems = useMenuItems();

  const ListItem = forwardRef<ElementRef<"a">, ComponentPropsWithoutRef<"a">>(
    ({ className, title, children, ...props }, ref) => {
      return (
        <li>
          <NavigationMenuLink asChild>
            <a
              ref={ref}
              className={cn(
                "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                className,
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
      );
    },
  );
  ListItem.displayName = "ListItem";

  return (
    <div className="flex w-full p-5 fixed z-5 dark:bg-transparent bg-transparent items-center top-0">
      <Link href="/" className="normal-case text-xl font-bold flex-1">
        kleur
      </Link>
      <NavigationMenu className="hidden sm:block">
        <NavigationMenuList>
          {newMenuItems.map((menuItem, index) => (
            <NavigationMenuItem
              key={menuItem.label}
              className={`hover:[&_button]:${menuItem.colour}!`}
            >
              <NavigationMenuTrigger
                className={`data-[state=open]:${menuItem.colour}!`}
              >
                {menuItem.label}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                  {menuItem.subItems.map((subItem) => (
                    <ListItem
                      key={subItem.label}
                      href={subItem.href}
                      title={subItem.label}
                    >
                      {subItem.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
      <MobileNav menuItems={newMenuItems} />
      <div className="flex gap-3 items-center">
        <Search menuItems={menuItems} />
      </div>
    </div>
  );
}
