import styles from "../../styles/Home.module.css";
import Nav from "../../components/nav/nav";
import PageTitle from "../../components/page-title/page-title";
import ColourCombinations from "../../components/colour-combinations/colour-combinations";

export const Index = () => {
    return (
        <div className={styles.container}>
            <Nav/>
            <PageTitle title="Colours"/>
            <ColourCombinations/>
        </div>
    );
};

export default Index;