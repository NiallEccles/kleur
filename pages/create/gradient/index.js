import styles from "../../../styles/Home.module.css";
import NewGradient from "../../../components/new-gradient/new-gradient";
import Nav from "../../../components/nav/nav";
import PageTitle from "../../../components/page-title/page-title";

export default function GradientNew() {
    return (
        <div className={styles.container}>
            <Nav/>
            <PageTitle title="Create Gradient"/>
            <NewGradient/>
        </div>
    );
}
