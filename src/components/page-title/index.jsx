import { motion } from 'framer-motion';
import React, { useState } from 'react';

// eslint-disable-next-line react/prop-types
export default function PageTitle({ title }) {
  const [isVisible, setIsVisible] = useState(false);

  setTimeout(() => {
    setIsVisible(true);
  }, 300);

  return (
    <motion.div initial={false} animate={{ opacity: isVisible ? 1 : 0 }}>
      <div className="my-8 py-20 sm:py-40 rounded-3xl">
        <h1 className="text-5xl sm:text-9xl font-bold text-center">{title}</h1>
      </div>
    </motion.div>
  );
}
