import styles from "../../styles/Home.module.css";
import { useEffect, useState } from "react";
import Gradient from "../gradient/gradient";
import Mesh from "@/components/mesh/mesh";

export default function LocalMeshes() {
    const [localMeshes, setLocalMeshes] = useState<Mesh[]>([]);

    type MeshControl = {
        id: string;
        color: string;
        x: number;
        y: number;
        blurRadius: number;
    };

    type Mesh = {
        controls: MeshControl[];
        name: string;
    }

    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedMeshes = window.localStorage.getItem("meshGradients");
            if (storedMeshes) {
                setLocalMeshes(JSON.parse(storedMeshes));
            }

            console.log(storedMeshes)
        }
    }, []);

    return localMeshes != null ? (
        <>
            <h2 className="text-2xl font-bold ml-5">My Mesh Gradients</h2>
            <div className={styles.paletteGrid}>
                {localMeshes.length > 0
                    ? localMeshes.map((mesh) => {
                        return <Mesh key={mesh.name} controls={mesh.controls} name={mesh.name}/>;
                    })
                    : ""}
            </div>
        </>
    ) : (
        ""
    );
}
