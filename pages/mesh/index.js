import Link from "next/link";
import styles from "../../styles/Home.module.css";
import Nav from "../../components/nav";
import Mesh from "../../components/mesh";

export default function Index() {
  return (
    <div className={styles.container}>
      <Nav/>
      <Mesh/>
    </div>
  );
}
