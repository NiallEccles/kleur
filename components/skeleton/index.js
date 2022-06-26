import Link from "next/link";
import styles from "./Skeleton.module.css";
import { PAGES } from "/public/shared.constants";

export default function Skeleton() {
  return (
    <Link href={PAGES.NEW}>
      <button className={styles.skeleton}>
        <h3 className="font-bold">Create your own</h3>
      </button>
    </Link>
  );
}
