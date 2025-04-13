import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator, CommandShortcut
} from "@/components/ui/command";
import {Blend, CirclePlus, PaintBucket, Settings, SwatchBook} from "lucide-react";
import {useEffect, useState} from "react";
import {MenuItems} from "@/types/MenuItems";
import {router} from "next/client";
import {useRouter} from "next/router";

export const Search = ({ menuItems }: { menuItems: MenuItems[] }) => {
    const [open, setOpen] = useState(false)
    const router = useRouter();

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }

        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, []);

    const navigateTo = (url: string) => {
        setOpen(false);
        setTimeout(() => {
            router.push(url);
        }, 150);
    };

    return (
        <CommandDialog open={open} onOpenChange={setOpen}>
            <CommandInput placeholder="Type a command or search..."/>
            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Suggestions">
                    {
                        menuItems.map((item, index) => (
                            <CommandItem
                                key={index}
                                onSelect={() => navigateTo(item.path)}
                                onClick={() => navigateTo(item.path)}
                            >
                                {item.icon}
                                <span>{item.label}</span>
                            </CommandItem>
                        ))
                    }
                    <CommandItem>
                        <SwatchBook />
                        <span>Gradients</span>
                    </CommandItem>
                    <CommandItem>
                        <CirclePlus />
                        <span>Create</span>
                    </CommandItem>
                </CommandGroup>
                <CommandSeparator/>
                <CommandGroup heading="Colours">
                    <CommandItem>
                        <PaintBucket />
                        <span>Colours</span>
                    </CommandItem>
                    <CommandItem>
                        <Blend />
                        <span>Colour Harmony</span>
                        {/*<CommandShortcut>⌘B</CommandShortcut>*/}
                    </CommandItem>
                </CommandGroup>
            </CommandList>
        </CommandDialog>
    )
};

export default Search;