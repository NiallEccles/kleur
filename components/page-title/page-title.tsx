"use client"

import {useState} from "react";

export default function PageTitle({title}: {title: string}) {
    const [isVisible, setIsVisible] = useState(false);

    setTimeout(() => {
        setIsVisible(true);
    }, 300);

    return (
        <div className="my-4 rounded-3xl">
            <h1 className="text-2xl font-bold mb-10">{title}</h1>
        </div>
    );
}
