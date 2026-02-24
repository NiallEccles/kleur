import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator
} from "@/components/ui/command";
import {useEffect, useState} from "react";
import {MenuItem} from "@/types/MenuItem";
import {useRouter} from "next/navigation";
import {Button} from "@/components/ui/button";
import {useCommandItems} from "@/customHooks/useCommandItems";

export const Search = ({ menuItems }: { menuItems: MenuItem[] }) => {
    const [open, setOpen] = useState(false)
    const router = useRouter();
    const commands = useCommandItems(setOpen);

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
        <div className='ml-5 hidden sm:flex'>
            <div className="w-full flex-1 md:w-auto md:flex-none">
                <Button
                    onClick={() => setOpen(true)}
                    className='inline-flex items-center gap-2 whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 border border-input hover:bg-accent hover:text-accent-foreground px-4 py-2 relative h-8 w-full justify-start rounded-[0.5rem] bg-muted/50 text-sm font-normal text-muted-foreground shadow-none sm:pr-12 w-40'
                >
                    <span className="hidden lg:inline-flex">Search</span>
                    <span className="inline-flex lg:hidden">Search...</span>
                    <kbd
                        className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                        <span className="text-xs">⌘
                        </span>K
                    </kbd>
                </Button>
            </div>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Type a command or search..."/>
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading="Suggestions">
                        {
                            menuItems.map((item, index) => (
                                <CommandItem
                                    key={index}
                                    onSelect={() => navigateTo(item.href)}
                                    onClick={() => navigateTo(item.href)}
                                >
                                    {item.icon}
                                    <span>{item.label}</span>
                                </CommandItem>
                            ))
                        }
                    </CommandGroup>
                    <CommandSeparator/>
                    <CommandGroup heading="Commands">
                        {
                            commands.map((command) => (
                                <CommandItem
                                    key={command.label}
                                    onSelect={() => command.action()}
                                    onClick={() => command.action()}
                                >
                                    {command.icon}
                                    <span>{command.label}</span>
                                </CommandItem>
                            ))
                        }
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </div>
    )
};

export default Search;