"use client"

import { useState } from "react"
import useColourHarmonies from "@/customHooks/useColourHarmonies"
import { useUpdateControl } from "@/customHooks/useUpdateControl"
import ColourPicker from "@/components/colour-picker/colour-picker"
import { hexStringSanitizer } from "@/utils/paletteUtils"

export default function ColourHarmonyPage() {
  const [selectedColour, setSelectedColour] = useState("#FF9F45")

  const { controls, setControls, updateSingleControl, removeControl } =
    useUpdateControl(["#FF9F45"])

  const [currentControl, setCurrentControl] = useState(0)

  const { complementary, analogous, triadic, monochromatic } =
    useColourHarmonies(controls[0])

  return (
    <div className="mx-auto">
      <section className="my-10">
        <h2 className="text-3xl sm:text-7xl font-bold px-5">Colour Harmony</h2>
        <div className="flex flex-col items-center sm:flex-row max-w-lg mx-auto my-20">
          <div className="m-auto flex flex-col items-center">
            <div
              className="w-60 h-60 rounded-full"
              style={{ background: controls[0] }}
            ></div>
            <input
              type="text"
              className="bg-zinc-800 text-white p-1 w-20 font-semibold mt-2 mx-auto text-center"
              value={controls[0]}
              onChange={(e) =>
                updateSingleControl(0, hexStringSanitizer(e.target.value))
              }
            />
          </div>
          <ColourPicker
            controls={controls}
            updateSingleControl={updateSingleControl}
            currentControlIndex={currentControl}
          />
        </div>
        <h2 className="text-3xl sm:text-7xl font-bold px-5">Complementary</h2>
        <div className="grid grid-row-dense grid-cols-1 gap-4 my-20">
          <div className="m-auto">
            <div
              className="w-60 h-60 rounded-full"
              style={{ background: complementary }}
            ></div>
            <h2 className="bg-zinc-800 text-white p-1 w-20 font-semibold mt-2 mx-auto text-center">
              {complementary}
            </h2>
          </div>
        </div>
      </section>
      <section className="my-10">
        <h2 className="text-3xl sm:text-7xl font-bold px-5">Analogous</h2>
        <div className="grid grid-row-dense grid-cols-1 sm:grid-cols-2 gap-4 my-20">
          {analogous.map((item, index) => (
            <div key={index} className="m-auto">
              <div
                className="w-60 h-60 rounded-full"
                style={{ background: item }}
              ></div>
              <h2 className="bg-zinc-800 text-white p-1 w-20 font-semibold mt-2 mx-auto text-center">
                {item}
              </h2>
            </div>
          ))}
        </div>
      </section>
      <section className="my-10">
        <h2 className="text-3xl sm:text-7xl font-bold px-5">Triadic</h2>
        <div className="grid grid-row-dense grid-cols-1 sm:grid-cols-2 gap-4 my-20">
          {triadic.map((item, index) => (
            <div key={index} className="m-auto">
              <div
                className="w-60 h-60 rounded-full"
                style={{ background: item }}
              ></div>
              <h2 className="bg-zinc-800 text-white p-1 w-20 font-semibold mt-2 mx-auto text-center">
                {item}
              </h2>
            </div>
          ))}
        </div>
      </section>
      <section className="my-10">
        <h2 className="text-3xl sm:text-7xl font-bold px-5">Monochromatic</h2>
        <div className="grid grid-row-dense grid-cols-1 sm:grid-cols-2 gap-4 my-20">
          {monochromatic.map((item, index) => (
            <div key={index} className="m-auto">
              <div
                className="w-60 h-60 rounded-full"
                style={{ background: item }}
              ></div>
              <h2 className="bg-zinc-800 text-white p-1 w-20 font-semibold mt-2 mx-auto text-center">
                {item}
              </h2>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
