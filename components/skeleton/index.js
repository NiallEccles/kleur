import Head from "next/head";
import Image from "next/image";
import styles from "./Skeleton.module.css";

export default function Skeleton() {
  return (
    <button className={styles.skeleton}>
        <h3>Create your own</h3>
    </button>
  );
}
