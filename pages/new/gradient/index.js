import Link from "next/link";
import styles from "../../../styles/Home.module.css";
import NewGradient from "../../../components/new-gradient";
import { PAGES } from "/public/shared.constants";

export default function GradientNew() {
  return (
    <div className={styles.container}>
      <div className="navbar bg-base-100">
        <div className="flex-1">
          <Link href={PAGES.HOME}>
            <a className="btn btn-ghost normal-case text-xl font-bold kleur-title">
              kleur
            </a>
          </Link>
        </div>
      </div>
      <NewGradient />
    </div>
  );
}
