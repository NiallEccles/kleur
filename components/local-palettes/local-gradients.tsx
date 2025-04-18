import styles from "../../styles/Home.module.css";
import { useEffect, useState } from "react";
import Palette from "../palette/palette";

export default function LocalPalettes() {
  const [localPalettes, setLocalPalettes] = useState([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
        const storedPalettes = window.localStorage.getItem("palettes");
        if (storedPalettes) {
            setLocalPalettes(JSON.parse(storedPalettes));
        }
    }
  }, []);

  return localPalettes != null ? (
    <>
      <h2 className="text-2xl font-bold ml-5">My Palettes</h2>
      <div className={styles.paletteGrid}>
        {localPalettes.length > 0
          ? localPalettes.map((palette: {controls: string[], name: string}, index) => {
              return <Palette key={index} colours={palette.controls} name={palette.name} />;
            })
          : ""}
      </div>
    </>
  ) : (
    ""
  );
}
