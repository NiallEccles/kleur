import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";
import Gradient from "../components/gradient";
import Palette from "../components/palette";

export default function LocalPalettes() {
  const [localPalettes, setLocalPalettes] = useState([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setLocalPalettes(JSON.parse(window.localStorage.getItem("palettes")));
    }
  }, []);

  return localPalettes != null ? (
    <>
      <h2 className="text-2xl font-bold ml-5">My Palettes</h2>
      <div className={styles.paletteGrid}>
        {localPalettes.length > 0
          ? localPalettes.map((palette, index) => {
              return <Palette key={index} colours={palette} />;
            })
          : ""}
      </div>
    </>
  ) : (
    ""
  );
}
