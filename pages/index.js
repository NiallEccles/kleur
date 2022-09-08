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

export default function Home() {
  return (
    <div className={styles.container}>
      <div className="navbar bg-base-100">
        <div className="flex-1">
          <a className="btn btn-ghost normal-case text-xl font-bold kleur-title">
            kleur
          </a>
        </div>
      </div>
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
      <LocalPalettes/>
      <LocalGradients/>
    </div>
  );
}
