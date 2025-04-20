import {JSX, useEffect, useState} from "react";
import styles from "../gradient/gradient.module.css";

type GradientProps = {
    controls: string[];
    name?: string;
};

type ColorPoint = {
    id: string
    color: string
    x: number
    y: number
    blurRadius: number
}

type MeshProps = {
    controls: ColorPoint[],
    name: string
}

export default function Mesh({controls, name} : MeshProps) {
    const [copiedColour, setCopiedColour] = useState<string>("");
    const [cssCode, setCssCode] = useState("")

    useEffect(() => {
        const generateCssCode = () => {
            const radialGradients = controls
                .map(
                    (point: ColorPoint) =>
                        `radial-gradient(circle at ${point.x}% ${point.y}%, ${point.color} 0%, transparent ${point.blurRadius}%)`,
                )
                .join(", ")

            return `${radialGradients}`
        }

        setCssCode(generateCssCode())
        console.log(generateCssCode())
    }, [controls])

    return (
        <div>
            <div
                className={styles.gradient}
                style={{background: cssCode}}
            >
                {/*<button*/}
                {/*    className={styles.copyIcon}*/}
                {/*    onClick={() => {*/}
                {/*        const gradient = `linear-gradient(${degrees}deg, ${colours.toString()})`;*/}
                {/*        navigator.clipboard.writeText(gradient);*/}
                {/*        setCopiedColour(colours.toString());*/}
                {/*        setTimeout(() => {*/}
                {/*            setCopiedColour("");*/}
                {/*        }, 1500);*/}
                {/*    }}*/}
                {/*>*/}
                {/*    {copiedColour === colours.toString() ? successIcon() : copyIcon()}*/}
                {/*</button>*/}
            </div>
            {name ? (
                <div className={styles.sliver}>
                    <span>{name}</span>
                </div>
            ) : null}
        </div>
    );
}

function copyIcon(): JSX.Element {
    return (
        <svg
            id="Layer_1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 37.65 43.6"
        >
            <path d="M12,36.2c-1.27,0-2.34-.46-3.23-1.38s-1.33-1.97-1.33-3.17V4.55c0-1.2,.44-2.26,1.33-3.17,.88-.92,1.96-1.38,3.23-1.38h21.05c1.27,0,2.35,.46,3.25,1.38,.9,.92,1.35,1.97,1.35,3.17V31.65c0,1.2-.45,2.26-1.35,3.17s-1.98,1.38-3.25,1.38H12Zm0-4.55h21.05V4.55H12V31.65h0Zm-7.4,11.95c-1.27,0-2.35-.46-3.25-1.38s-1.35-1.98-1.35-3.17V9.6H4.6v29.45H27.55v4.55H4.6ZM12,4.55h0V31.65h0V4.55h0Z" />
        </svg>
    );
}

function successIcon(): JSX.Element {
    return (
        <svg
            id="Layer_1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 34.65 25.65"
        >
            <path d="M12.25,25.65L0,13.4l3.3-3.3,8.95,9L31.35,0l3.3,3.25L12.25,25.65Z" />
        </svg>
    );
}
