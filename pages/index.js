import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Palette from "../components/palette";

export default function Home() {
  return (
    <div className={styles.container}>
      <div className="navbar bg-base-100">
        <div className="flex-1">
          <a className="btn btn-ghost normal-case text-xl font-bold kleur-title">
            kleur
          </a>
        </div>
      </div>
      <div className={styles.paletteGrid}>
        <Palette colours={['#F47C7C','#EF9F9F', '#FAD4D4', '#FFF2F2']}/>
        <Palette colours={['#293462','#F24C4C', '#EC9B3B', '#F7D716']}/>
        <Palette colours={['#293462','#F24C4C', '#F7D716']}/>
        <Palette colours={['#F7D716','#F24C4C', ]}/>
        <Palette colours={['#293462','#F24C4C', '#F7D716']}/>
        <Palette colours={['#293462','#F24C4C', '#EC9B3B', '#F7D716']}/>
        <Palette colours={['#F7D716','#F24C4C', ]}/>
        <Palette colours={['#293462','#F24C4C', '#EC9B3B', '#F7D716']}/>
      </div>
    </div>
  );
}
