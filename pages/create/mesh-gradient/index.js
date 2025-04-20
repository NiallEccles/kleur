import styles from "../../../styles/Home.module.css";
import NewPalette from "../../../components/new-palette/new-palette";
import Nav from "../../../components/nav/nav";
import PageTitle from "../../../components/page-title/page-title";
import MeshGradientGenerator from "../../../components/mesh-gradient/mesh-gradient";

export default function PaletteNew() {
    return (
        <div className={styles.container}>
            <Nav/>
            <PageTitle title="Mesh Gradient" />
            {/*<NewPalette/>*/}
            <MeshGradientGenerator/>
        </div>
    );
}
