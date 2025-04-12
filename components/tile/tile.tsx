import styles from "./tile.module.css";
import Link from "next/link";

const Tile = ({label, route}) => {
    console.log(label.replace(/\s/g, ''));
    return(
        <Link href={route}>
            <div className={`${styles.tile} ${styles[label.replace(/\s/g, '')]}`}>
                <h2 className='text-xl sm:text-3xl font-semibold px-5 text-white p-1 bg-zinc-800'>
                    {label}
                </h2>
            </div>
        </Link>
    )
}

export default Tile;