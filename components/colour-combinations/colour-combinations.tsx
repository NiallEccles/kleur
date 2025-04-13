import Link from "next/link";
import {useState} from "react";

export const ColourCombinations = () => {
    const [inputtedHex, setInputtedHex] = useState('#62D2A2');

    const colours = [
        "#FF5733",
        "#33FF57",
        "#5733FF",
        "#FFD700",
        "#8A2BE2",
        "#00CED1",
        "#DC143C",
        "#7FFF00",
        "#FF4500",
        "#48D1CC",
        "#DAA520",
        "#20B2AA",
        "#FF69B4",
        "#6A5ACD",
        "#B22222",
    ];

    return (
        <>
            <div className='grid grid-flow-row-dense md:grid-cols-3 gap-4 my-20'>
                {
                    colours.map((item, index) => (
                        <Link key={index} href={`/colour/${item.replace('#', '')}`} className="flex flex-col items-center w-40 m-auto">
                            <div key={index}>
                                <div className='w-60 h-60 rounded-full' style={{background: item}}></div>
                                <h2 className="bg-zinc-800 text-white p-1 w-20 font-semibold mt-2">{item}</h2>
                            </div>
                        </Link>
                    ))
                }
            </div>
        </>
    );
};

export default ColourCombinations;