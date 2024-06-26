import {motion} from "framer-motion";
import {useState} from "react";

export default function PageTitle({title}) {
    const [isVisible, setIsVisible] = useState(false);

    setTimeout(() => {
        setIsVisible(true);
    }, 300);

    return (
        <motion.div initial={false} animate={{opacity: isVisible ? 1 : 0}}>
            <div className="my-4 py-5 sm:py-10 rounded-3xl">
                <h1 className="text-3xl sm:text-7xl font-bold px-5">{title}</h1>
            </div>
        </motion.div>
    );
}
