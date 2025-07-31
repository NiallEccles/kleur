import {useState, useEffect} from "react";
import {Button} from "@/components/ui/button";
import Link from "next/link";

export default function Hero() {
    const [isVisible, setIsVisible] = useState(false);
    const [randomTheme, setRandomTheme] = useState("");

    const textThemes = [
        "from-sky-400 via-teal-400 to-indigo-500",

        "from-cyan-400 via-fuchsia-500 to-lime-400",
        "from-orange-500 via-pink-500 to-red-500",
        "from-fuchsia-500 via-yellow-400 to-cyan-400",
        "from-sky-400 via-teal-400 to-indigo-500",
        "from-lime-400 via-rose-500 to-amber-400",
        "from-cyan-300 via-blue-500 to-purple-500",
        "from-rose-300 via-orange-300 to-yellow-300",
        "from-indigo-500 via-violet-600 to-fuchsia-500",
        "from-amber-600 via-orange-500 to-rose-500",
        "from-emerald-400 via-teal-300 to-cyan-300",
        "from-pink-300 via-rose-400 to-fuchsia-400",
        "from-teal-400 via-lime-400 to-yellow-400",
        "from-purple-700 via-fuchsia-600 to-amber-500",
        "from-sky-300 via-pink-300 to-violet-300",
        "from-blue-300 via-cyan-200 to-teal-200",
        "from-green-400 via-yellow-400 to-red-400",
        "from-yellow-500 via-amber-500 to-rose-600",
        "from-emerald-500 via-cyan-500 to-violet-600",

        "from-red-400 via-pink-500 to-purple-600",
        "from-violet-500 via-indigo-400 to-blue-400",
        "from-rose-500 via-amber-400 to-lime-300",
        "from-yellow-300 via-emerald-400 to-cyan-500",
        "from-purple-400 via-fuchsia-400 to-pink-500",
        "from-indigo-400 via-sky-400 to-teal-300"
    ];


    useEffect(() => {
        setRandomTheme(textThemes[Math.floor(Math.random() * textThemes.length)]);
    }, []);

    setTimeout(() => {
        setIsVisible(true);
    }, 300)
    return (
        <div className="my-8 py-20 sm:py-40 rounded-3xl text-center">
            <div className="text-center max-w-4xl mx-auto">
                <h1 className="text-4xl sm:text-5xl lg:text-8xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-6">
                    <span className="block text-slate-900 dark:text-slate-100 mt-2">
                        Master <span className={`text-transparent bg-clip-text bg-gradient-to-r font-bold ${randomTheme}`}>Colour</span> Like Never Before
                    </span>
                </h1>
            </div>
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 font-medium mb-8 max-w-3xl mx-auto leading-relaxed">
                A comprehensive suite of color tools designed for designers and developers
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center text-white">
                <Button asChild className='dark:bg-zinc-800 dark:text-zinc-100'>
                    <Link href={'/explore'}>Explore Tools</Link>
                </Button>
            </div>
        </div>
    );
}