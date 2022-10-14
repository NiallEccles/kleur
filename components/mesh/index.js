import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import PageTitle from "../page-title";
import styles from "./mesh.module.css";

export default function Mesh() {
  const [isVisible, setIsVisible] = useState(false);

  const canvasRef = useRef(null);

  const edgeInset = 20;
  const controlSize = 15;

  setTimeout(() => {
    setIsVisible(true);
  }, 300);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    context.fillStyle = '#2b2b2b';
    context.fillRect(0, 0, context.canvas.width, context.canvas.height)


    // top left
    context.fillStyle = 'green';
    context.fillRect(edgeInset, edgeInset, controlSize, controlSize);

    console.log(edgeInset);

    // bottom right
    context.fillStyle = 'green';
    context.fillRect((context.canvas.width - edgeInset) - controlSize, (context.canvas.height - edgeInset) - controlSize, controlSize, controlSize);


    // bottom left
    context.fillStyle = 'green';
    context.fillRect(edgeInset, (context.canvas.height - edgeInset) - controlSize, controlSize, controlSize);

    // top right
    context.fillStyle = 'green';
    context.fillRect((context.canvas.width - edgeInset) - controlSize, edgeInset, controlSize, controlSize);
  }, []);

  function handleClick(event) {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    console.log({x, y});
  }
  return (
    <motion.div initial={false} animate={{ opacity: isVisible ? 1 : 0 }}>
      <PageTitle title="Mesh" />
      <canvas ref={canvasRef} onClick={handleClick} className={styles.canvas}></canvas>
    </motion.div>
  );
}
