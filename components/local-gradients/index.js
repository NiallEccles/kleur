import styles from "../../styles/Home.module.css";
import { useEffect, useState } from "react";
import Gradient from "../gradient";

export default function LocalGradients() {
  const [localGradients, setLocalGradients] = useState([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setLocalGradients(JSON.parse(window.localStorage.getItem("gradients")));
    }
  }, []);

  return localGradients != null ? (
    <>
      <h2 className="text-2xl font-bold ml-5">My Gradients</h2>
      <div className={styles.paletteGrid}>
        {localGradients.length > 0
          ? localGradients.map((gradient, index) => {
              return <Gradient key={index} colours={gradient} />;
            })
          : ""}
      </div>
    </>
  ) : (
    ""
  );
}
