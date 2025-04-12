import Link from "next/link";
import styles from "./Skeleton.module.css";

export default function Skeleton({route}: { route: string }) {
  return (
    <Link href={route}>
      <button className={styles.skeleton}>
        <h3 className="font-bold">Create your own</h3>
      </button>
    </Link>
  );
}
