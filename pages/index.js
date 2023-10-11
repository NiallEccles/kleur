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
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 1, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.2
    }
  }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1
  }
};

export default function Home() {
  return (
    <div className={styles.container}>
      <Nav/>
      <Hero/>
      <h2 className="text-2xl font-bold ml-5">Featured Palettes</h2>
      <motion.div
        className={styles.paletteGrid}
          variants={container}
          initial="hidden"
          animate="visible"
        >
        {palettes.map((palette, index) =>
          index < 3 ?
          <motion.div key={index} variants={item}>
            <Palette key={index} colours={palette.colours} name={palette.name} />
          </motion.div> : ""
        )}
        <motion.div variants={item}>
          <Skeleton route={PAGES.NEW.PALETTE}/>
        </motion.div>
      </motion.div>
      <br />
      <h2 className="text-2xl font-bold ml-5">Featured Gradients</h2>
      <motion.div
        className={styles.paletteGrid}
          variants={container}
          initial="hidden"
          animate="visible"
        >
        {gradients.map((gradient, index) =>
          index < 3 ?
          <motion.div key={index} variants={item}>
            <Gradient key={index} colours={gradient.colours} name={gradient.name} />
          </motion.div> : ""
        )}
        <motion.div variants={item}>
          <Skeleton route={PAGES.NEW.GRADIENT}/>
        </motion.div>
      </motion.div>
      <br />
      <LocalPalettes/>
      <br />
      <LocalGradients/>
      <span style="position: absolute; bottom: 1em; right: 1em; background: black; color: white; ">Experimental</span>
    </div>
  );
}
