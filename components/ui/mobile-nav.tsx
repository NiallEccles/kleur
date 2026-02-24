"use client"

import * as React from "react"
import Link, { LinkProps } from "next/link"
import { useRouter } from "next/navigation"

import { cn } from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {Drawer, DrawerContent, DrawerTrigger} from "@/components/ui/drawer";
import {NewMenuItems} from "@/types/MenuItem";
import {Menu} from "lucide-react";

export function MobileNav({ menuItems }: { menuItems: NewMenuItems }){
    const [open, setOpen] = React.useState(false)

    const onOpenChange = React.useCallback(
        (open: boolean) => {
            setOpen(open)
        },
        []
    )

    return (
        <Drawer open={open} onOpenChange={onOpenChange}>
            <DrawerTrigger asChild>
                <Button
                    variant="ghost"
                    className="gap-4 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 sm:hidden"
                >
                    <Menu className='!size-6' />
                    <span className="sr-only">Toggle Menu</span>
                </Button>
            </DrawerTrigger>
            <DrawerContent className="max-h-[80svh] p-0">
                <div className="overflow-auto p-6">
                    <div className="flex flex-col space-y-3">
                        {
                            menuItems.map((menuItem) => (
                                <>
                                    <h2 className='text-xl font-bold mb-0' key={menuItem.label}>{menuItem.label}</h2>
                                    <ol className='ml-6'>
                                        {
                                            menuItem.subItems.map((subItem) => (
                                                <li className='my-2' key={subItem.href}>
                                                    <MobileLink
                                                        href={subItem.href}
                                                        onOpenChange={setOpen}
                                                    >
                                                        {subItem.label}
                                                    </MobileLink>
                                                </li>
                                            ))
                                        }
                                    </ol>
                                </>
                            ))
                        }
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    )
}

interface MobileLinkProps extends LinkProps {
    onOpenChange?: (open: boolean) => void
    children: React.ReactNode
    className?: string
}

function MobileLink({
                        href,
                        onOpenChange,
                        className,
                        children,
                        ...props
                    }: MobileLinkProps) {
    const router = useRouter()
    return (
        <Link
            href={href}
            onClick={() => {
                router.push(href.toString())
                onOpenChange?.(false)
            }}
            className={cn("text-[1.15rem]", className)}
            {...props}
        >
            {children}
        </Link>
    )
}