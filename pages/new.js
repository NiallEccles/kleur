import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Palette from "../components/palette";
import Gradient from "../components/gradient";
import { gradients } from "../data/gradients";
import { palettes } from "../data/palettes";
import Skeleton from "../components/skeleton";
import NewPalette from "../components/new-palette";
import NewGradient from "../components/new-gradient";

export default function New() {
  return (
    <div className={styles.container}>
      <div className="navbar bg-base-100">
        <div className="flex-1">
          <a className="btn btn-ghost normal-case text-xl font-bold kleur-title">
            kleur
          </a>
        </div>
      </div>
      {/* <NewPalette /> */}
      <NewGradient />
    </div>
  );
}
