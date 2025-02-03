import styles from "../../../styles/Home.module.css";
import NewPalette from "../../../components/new-palette";
import Nav from "../../../components/nav";
import PageTitle from "../../../components/page-title";

export default function PaletteNew() {
    return (
        <div className={styles.container}>
            <Nav/>
            <PageTitle title="Create Palette"/>
            <NewPalette/>
        </div>
    );
}
