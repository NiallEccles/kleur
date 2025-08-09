import styles from "../../../styles/Home.module.css";
import NewPalette from "../../../components/new-palette/new-palette";
import Nav from "../../../components/nav/nav";
import PageTitle from "../../../components/page-title/page-title";
import PaletteGenerator from "../../../components/palette-generator/palette-generator";

export default function PaletteNew() {
    return (
        <div className={styles.container}>
            <Nav/>
            <PageTitle title="Create Palette"/>
            {/*<NewPalette/>*/}
            <PaletteGenerator/>
        </div>
    );
}
