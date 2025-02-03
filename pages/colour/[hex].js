import styles from "../../styles/Home.module.css";
import Nav from "../../components/nav";
import { useEffect, useState } from "react";
import { useRouter } from 'next/router';import useColourHarmonies from "../../customHooks/useColourHarmonies";

export default function Hex() {
    const [palette, setPalette] = useState([]);
    const [name, setName] = useState();
    const router = useRouter();
    const selectedColour = router.query.hex;

    const {
        complementary,
        analogous,
        triadic,
        monochromatic,
    } = useColourHarmonies(`#${selectedColour}`);

    console.log({
        complementary,
        analogous,
        triadic,
        monochromatic,
    })

    return (
        <div className={styles.container}>
            <Nav/>
            <section className="my-10">
                <h2 className="text-3xl sm:text-7xl font-bold px-5">Colour Harmony</h2>
                <div className="grid grid-row-dense grid-cols-1 gap-4 my-20">
                    <div className='m-auto'>
                        <div className='w-60 h-60 rounded-full' style={{background: `#${selectedColour}`}}></div>
                        <h2 className="bg-zinc-800 text-white p-1 w-20 font-semibold mt-2 mx-auto text-center">{selectedColour}</h2>
                    </div>
                </div>
                <h2 className="text-3xl sm:text-7xl font-bold px-5">Complementary</h2>
                    <div className="grid grid-row-dense grid-cols-1 gap-4 my-20">
                        <div className='m-auto'>
                            <div className='w-60 h-60 rounded-full' style={{background: complementary}}></div>
                            <h2 className="bg-zinc-800 text-white p-1 w-20 font-semibold mt-2 mx-auto text-center">{complementary}</h2>
                        </div>
                    </div>
            </section>
            <section className="my-10">
                <h2 className="text-3xl sm:text-7xl font-bold px-5">Analogous</h2>
                <div className="grid grid-row-dense grid-cols-1 sm:grid-cols-2 gap-4 my-20">
                    {
                        analogous.map((item, index) => (
                            <div key={index} className="m-auto">
                                <div className='w-60 h-60 rounded-full' style={{background: item}}></div>
                                <h2 className="bg-zinc-800 text-white p-1 w-20 font-semibold mt-2 mx-auto text-center">{item}</h2>
                            </div>
                        ))
                    }
                </div>
            </section>
            <section className="my-10">
                <h2 className="text-3xl sm:text-7xl font-bold px-5">Triadic</h2>
                <div className="grid grid-row-dense grid-cols-1 sm:grid-cols-2 gap-4 my-20">
                    {
                        triadic.map((item, index) => (
                            <div key={index} className="m-auto">
                                <div className='w-60 h-60 rounded-full' style={{background: item}}></div>
                                <h2 className="bg-zinc-800 text-white p-1 w-20 font-semibold mt-2 mx-auto text-center">{item}</h2>
                            </div>
                        ))
                    }
                </div>
            </section>
            <section className="my-10">
                <h2 className="text-3xl sm:text-7xl font-bold px-5">Monochromatic</h2>
                <div className="grid grid-row-dense grid-cols-1 sm:grid-cols-2 gap-4 my-20">
                    {
                        monochromatic.map((item, index) => (
                            <div key={index} className="m-auto">
                                <div className='w-60 h-60 rounded-full' style={{background: item}}></div>
                                <h2 className="bg-zinc-800 text-white p-1 w-20 font-semibold mt-2 mx-auto text-center">{item}</h2>
                            </div>
                        ))
                    }
                </div>
            </section>
        </div>
);
};