import homeStyles from "../../styles/Home.module.css";
import paletteStyles from "./Palettes.module.css";
import { palettes } from "../../data/palettes";
import Nav from "../../components/nav";
import Palette from "../../components/palette";
import { motion } from "framer-motion";
import PageTitle from "../../components/page-title";

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
  return (
    <div className={homeStyles.container}>
      <Nav />
      <PageTitle title="Palettes" />
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
