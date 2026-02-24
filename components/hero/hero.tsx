import { Button } from "@/components/ui/button";
import Link from "next/link";
import Grainient from "@/components/Grainient";

export const Hero = () => {
  return (
    <div className="relative flex items-center justify-center h-dvh">
      <div className="relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl md:leading-18 font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-6">
            <span className="block text-slate-900 dark:text-slate-100 mt-2">
              Master Colour <br /> Like Never Before
            </span>
          </h1>
        </div>
        <p className="text-md sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-3xl mx-auto text-center leading-relaxed">
          A comprehensive suite of color tools <br /> designed for designers and
          developers
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center text-white">
          <Button
            size="lg"
            asChild
            className="dark:bg-zinc-800 dark:text-zinc-100"
          >
            <Link href={"/explore"}>Explore Tools</Link>
          </Button>
        </div>
      </div>
      <div className="w-full absolute top-0 left-0 h-dvh overflow-hidden">
        <Grainient
          className="h-full"
          color1="#E9D5FF"
          color2="#93C5FD"
          color3="#6EE7B7"
          timeSpeed={0.25}
          colorBalance={0}
          warpStrength={1}
          warpFrequency={5}
          warpSpeed={2}
          warpAmplitude={50}
          blendAngle={0}
          blendSoftness={0.05}
          rotationAmount={500}
          noiseScale={2}
          grainAmount={0.1}
          grainScale={2}
          grainAnimated={false}
          contrast={1.5}
          gamma={1}
          saturation={1}
          centerX={0}
          centerY={0}
          zoom={0.9}
        />
        <div className="pointer-events-none absolute -bottom-0.5 z-10 left-0 h-35 w-full bg-gradient-to-t from-white to-transparent"></div>
      </div>
    </div>
  );
};

export default Hero;
