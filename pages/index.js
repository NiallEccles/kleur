import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Palette from "../components/palette";
import Gradient from "../components/gradient";
import { gradients } from "../data/gradients";
import { palettes } from "../data/palettes";
import Skeleton from "../components/skeleton";
import { PAGES } from "/public/shared.constants";
import { useEffect, useState } from "react";
import Hero from "../components/hero/hero";

export default function Home() {
  const [localPalettes, setLocalPalettes] = useState([]);
  const [localGradients, setLocalGradients] = useState([]);

  useEffect(()=>{
    if (typeof window !== "undefined") {
      setLocalPalettes(JSON.parse(window.localStorage.getItem('palettes')));
      setLocalGradients(JSON.parse(window.localStorage.getItem('gradients')));
    }
  },[]);

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
      {
        localPalettes != null ? 
          <>
            <h2 className="text-2xl font-bold ml-5">My Palettes</h2>
            <div className={styles.paletteGrid}>
              {
                localPalettes.length > 0 ? localPalettes.map((palette, index) => {
                  return <Palette key={index} colours={palette} />;
                }) : ''
              }
            </div>
          </> : ''
      }
      {
        localGradients != null ? 
          <>
            <h2 className="text-2xl font-bold ml-5">My Gradients</h2>
            <div className={styles.paletteGrid}>
              {
                localGradients.length > 0 ? localGradients.map((gradient, index) => {
                  return <Gradient key={index} colours={gradient} />;
                }) : ''
              }
            </div>
          </> : ''
      }
    </div>
  );
}
