import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Palette from "../components/palette";
import Gradient from "../components/gradient";
import { gradients } from "../data/gradients";
import { palettes } from "../data/palettes";
import Skeleton from "../components/skeleton";
import { PAGES } from "/public/shared.constants";
import Hero from "../components/hero/hero";
import LocalGradients from "../components/local-gradients";
import LocalPalettes from "../components/local-palettes";
import Nav from "../components/nav";

export default function Home() {
  return (
    <div className={styles.container}>
      <Nav/>
      <Hero/>
      <h2 className="text-2xl font-bold ml-5">Featured Palettes</h2>
      <div className={styles.paletteGrid}>
        {palettes.map((palette, index) => {
          return <Palette key={index} colours={palette.colours} />;
        })}
        <Skeleton route={PAGES.NEW.PALETTE}/>
      </div>
      <br />
      <h2 className="text-2xl font-bold ml-5">Featured Gradients</h2>
      <div className={styles.paletteGrid}>
        {gradients.map((gradient, index) => {
          return <Gradient key={index} colours={gradient.colours} />;
        })}
        <Skeleton route={PAGES.NEW.GRADIENT}/>
      </div>
      <br />
      <LocalPalettes/>
      <br />
      <LocalGradients/>
    </div>
  );
}
