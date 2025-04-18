import styles from "../../../styles/Home.module.css";
import NewRadialGradient from "../../../components/new-radial-gradient/new-radial-gradient";
import Nav from "../../../components/nav/nav";
import PageTitle from "../../../components/page-title/page-title";

export default function GradientNew() {
    return (
        <div className={styles.container}>
            <Nav/>
            <PageTitle title="Create Radial Gradient"/>
            <NewRadialGradient/>
        </div>
    );
}
