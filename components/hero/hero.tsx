import { useState } from "react";

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false);

  setTimeout(()=>{
    setIsVisible(true);
  },300)
  return (
      <div className="my-8 py-20 sm:py-40 rounded-3xl">
        <h1 className="text-5xl sm:text-9xl font-bold text-center">kleur</h1>
        <h2 className="text-xl font-bold text-center">
            All about colour.
        </h2>
      </div>
  );
}