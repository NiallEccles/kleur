import styles from "../../styles/Home.module.css";
import Nav from "../../components/nav/nav";
import { useEffect, useState } from "react";
import Palette from "../../components/palette/palette";
import {useSearchParams} from "next/navigation";
import {getFromStorage} from "../../hooks/getFromStorage.hook";
import PaletteGenerator from "../../components/palette-generator/palette-generator";

export default function Index() {
  const [palette, setPalette] = useState([]);
  const [name, setName] = useState();
  const searchParams = useSearchParams();

  const data = getFromStorage('palettes', searchParams.get("name"));

  console.log(data)

  useEffect(() => {
    if (typeof window !== "undefined") {
      let url = new URL(window.location.href);
      let params = new URLSearchParams(url.search);
      console.log(params)

      // const paletteColours = params.get("p");
      // const formattedColours = paletteColours
      //   .split(",")
      //   .map((colour) => `#${colour}`);
      //
      // setPalette(formattedColours);
      //
      // const paletteName = params.get("name");
      // setName(paletteName);
    }
  }, []);

  return (
    <div className={styles.container}>
      <Nav />
      <div className="flex justify-center">
        <div>
          <PaletteGenerator name={data?.paletteName} cols={data?.colors} />
          {/*<Palette colours={palette} />*/}
          {/*<div className="px-8 font-semibold">*/}
          {/*  <span className="tag">{name}</span>*/}
          {/*</div>*/}
        </div>
      </div>
    </div>
  );
}
