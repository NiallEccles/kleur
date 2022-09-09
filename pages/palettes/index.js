import homeStyles from "../../styles/Home.module.css";
import paletteStyles from "./Palettes.module.css";
import { palettes } from "../../data/palettes";
import Nav from "../../components/nav";
import Palette from "../../components/palette";
import { motion } from "framer-motion";
import { useState } from "react";

const container = {
  hidden: { opacity: 1, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.2,
    },
  },
};

const item = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

export default function Index() {
  const [isVisible, setIsVisible] = useState(false);

  setTimeout(() => {
    setIsVisible(true);
  }, 300);
  return (
    <div className={homeStyles.container}>
      <Nav />
      <motion.div initial={false} animate={{ opacity: isVisible ? 1 : 0 }}>
        <div className="my-8 py-40 rounded-3xl">
          <h1 className="text-9xl font-bold text-center">Palettes</h1>
        </div>
      </motion.div>
      <motion.div
        className={paletteStyles.grid}
        variants={container}
        initial="hidden"
        animate="visible"
      >
        {palettes.map((palette, index) => (
          <motion.div key={index} variants={item} className="flex mx-auto">
            <Palette
              key={index}
              colours={palette.colours}
              name={palette.name}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
