import React, { useState } from 'react';
import { motion } from 'framer-motion';
import homeStyles from '../../styles/Home.module.css';
import gradientStyles from './Gradients.module.css';
import { gradients } from '../../data/gradients';
import Nav from '../../components/nav';
import Gradient from '../../components/gradient';
import PageTitle from '../../components/page-title';

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
  // eslint-disable-next-line no-unused-vars
  const [isVisible, setIsVisible] = useState(false);

  setTimeout(() => {
    setIsVisible(true);
  }, 300);
  return (
    <div className={homeStyles.container}>
      <Nav />
      <PageTitle title="Gradients" />
      <motion.div
        className={gradientStyles.grid}
        variants={container}
        initial="hidden"
        animate="visible"
      >
        {gradients.map((palette) => (
          <motion.div key={palette.name} variants={item} className=" mx-auto">
            <Gradient
              key={palette.name}
              colours={palette.colours}
              name={palette.name}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
