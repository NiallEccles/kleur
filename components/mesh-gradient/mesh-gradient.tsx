"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {Copy, Pencil, Plus, Trash2} from "lucide-react"
import { cn } from "@/lib/utils"
// import { useToast } from "@/hooks/use-toast"
import {HexColorPicker} from "react-colorful";
import {Input} from "@/components/ui/input";
import {useRouter} from "next/router";
import {PAGES} from "@/public/constants";

type ColorPoint = {
    id: string
    color: string
    x: number
    y: number
    blurRadius: number
}

export default function MeshGradientGenerator() {
    const [colorPoints, setColorPoints] = useState<ColorPoint[]>([
        { id: "1", color: "#ff5757", x: 25, y: 25, blurRadius: 100 },
        { id: "2", color: "#7c4dff", x: 75, y: 75, blurRadius: 100 },
    ])
    const [activePoint, setActivePoint] = useState<string | null>(null)
    const [opacity, setOpacity] = useState(100)
    const [cssCode, setCssCode] = useState("")
    const canvasRef = useRef<HTMLDivElement>(null)
    const [name, setName] = useState<string | null>(null);
    const router = useRouter();
    // const { toast } = useToast()

    // Generate a unique ID for new color points
    const generateId = () => `color-${Date.now()}`

    // Add a new color point
    const addColorPoint = () => {
        const newColor = getRandomColor()
        const newPoint: ColorPoint = {
            id: generateId(),
            color: newColor,
            x: Math.random() * 80 + 10,
            y: Math.random() * 80 + 10,
            blurRadius: 100, // Default blur radius
        }
        setColorPoints([...colorPoints, newPoint])
    }

    // Remove a color point
    const removeColorPoint = (id: string) => {
        if (colorPoints.length <= 2) {
            // toast({
            //     title: "Cannot remove",
            //     description: "You need at least two color points for a gradient",
            //     variant: "destructive",
            // })
            return
        }
        setColorPoints(colorPoints.filter((point) => point.id !== id))
        if (activePoint === id) {
            setActivePoint(null)
        }
    }

    // Update color of a point
    const updateColor = (id: string, color: string) => {
        setColorPoints(colorPoints.map((point) => (point.id === id ? { ...point, color } : point)))
    }

    // Update blur radius of a point
    const updateBlurRadius = (id: string, blurRadius: number) => {
        setColorPoints(colorPoints.map((point) => (point.id === id ? { ...point, blurRadius } : point)))
    }

    // Handle mouse down on a color point
    const handleMouseDown = (id: string) => {
        setActivePoint(id)
    }

    // Handle mouse move for dragging
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!activePoint || !canvasRef.current) return

        const rect = canvasRef.current.getBoundingClientRect()
        const x = ((e.clientX - rect.left) / rect.width) * 100
        const y = ((e.clientY - rect.top) / rect.height) * 100

        // Constrain to canvas boundaries
        const clampedX = Math.max(0, Math.min(100, x))
        const clampedY = Math.max(0, Math.min(100, y))

        setColorPoints(
            colorPoints.map((point) => (point.id === activePoint ? { ...point, x: clampedX, y: clampedY } : point)),
        )
    }

    // Handle mouse up to stop dragging
    const handleMouseUp = () => {
        setActivePoint(null)
    }

    // Generate random color
    const getRandomColor = () => {
        const letters = "0123456789ABCDEF"
        let color = "#"
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)]
        }
        return color
    }

    // Generate CSS code for the gradient
    useEffect(() => {
        const generateCssCode = () => {
            const radialGradients = colorPoints
                .map(
                    (point) =>
                        `radial-gradient(circle at ${point.x}% ${point.y}%, ${point.color} 0%, transparent ${point.blurRadius}%)`,
                )
                .join(", ")

            return `background: ${radialGradients};
opacity: ${opacity}%;`
        }

        setCssCode(generateCssCode())
    }, [colorPoints, opacity])

    // Copy CSS code to clipboard
    const copyToClipboard = () => {
        navigator.clipboard.writeText(cssCode)
        // toast({
        //     title: "Copied!",
        //     description: "CSS code copied to clipboard",
        // })
    }

    return (
        <div className="grid gap-8 md:grid-cols-[1fr_300px]">
            {/* Gradient Preview */}
            <div className="relative">
                <div
                    ref={canvasRef}
                    className="relative w-full aspect-video rounded-lg border overflow-hidden"
                    style={{
                        background: colorPoints
                            .map(
                                (point) =>
                                    `radial-gradient(circle at ${point.x}% ${point.y}%, ${point.color} 0%, transparent ${point.blurRadius}%)`,
                            )
                            .join(", "),
                        opacity: opacity / 100,
                    }}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                >
                    {colorPoints.map((point) => (
                        <div
                            key={point.id}
                            className={cn(
                                "absolute w-6 h-6 rounded-full border-2 border-white shadow-md cursor-move transform -translate-x-1/2 -translate-y-1/2",
                                activePoint === point.id && "ring-2 ring-white ring-opacity-70",
                            )}
                            style={{
                                backgroundColor: point.color,
                                left: `${point.x}%`,
                                top: `${point.y}%`,
                            }}
                            onMouseDown={() => handleMouseDown(point.id)}
                        />
                    ))}
                </div>
            </div>

            {/* Controls */}
            <div className="space-y-6">
                <Tabs defaultValue="colors">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="colors">Colors</TabsTrigger>
                        <TabsTrigger value="settings">Settings</TabsTrigger>
                    </TabsList>

                    <TabsContent value="colors" className="space-y-4 pt-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-medium">Color Points</h3>
                            <Button onClick={addColorPoint} size="sm" variant="outline">
                                <Plus className="h-4 w-4 mr-1" /> Add Color
                            </Button>
                        </div>

                        <div className="space-y-3 max-h-[310px] overflow-y-auto pr-2">
                            {colorPoints.map((point) => (
                                <Card key={point.id}>
                                    <CardContent>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <div
                                                            className="w-8 h-8 rounded-full cursor-pointer border"
                                                            style={{ backgroundColor: point.color }}
                                                        />
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start">
                                                        {/*<ColorPicker color={point.color} onChange={(color) => updateColor(point.id, color)} />*/}
                                                        <HexColorPicker color={point.color} onChange={(color) => updateColor(point.id, color)} />
                                                    </PopoverContent>
                                                </Popover>
                                                <div>
                                                    <div className="text-sm font-medium">{point.color}</div>
                                                    <div className="text-xs text-muted-foreground">
                                                        X: {point.x.toFixed(0)}%, Y: {point.y.toFixed(0)}%
                                                    </div>
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="icon" onClick={() => removeColorPoint(point.id)}>
                                                <Trash2 className="h-4 w-4 text-muted-foreground" />
                                            </Button>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex justify-between">
                                                <label className="text-xs font-medium">Blur Radius</label>
                                                <span className="text-xs text-muted-foreground">{point.blurRadius}%</span>
                                            </div>
                                            <Slider
                                                value={[point.blurRadius]}
                                                min={10}
                                                max={200}
                                                step={1}
                                                onValueChange={(value) => updateBlurRadius(point.id, value[0])}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="settings" className="space-y-6 pt-4">
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <label className="text-sm font-medium">Opacity</label>
                                <span className="text-sm text-muted-foreground">{opacity}%</span>
                            </div>
                            <Slider value={[opacity]} min={20} max={100} step={1} onValueChange={(value) => setOpacity(value[0])} />
                        </div>
                    </TabsContent>
                </Tabs>
                <div className='flex gap-2'>
                    <Input
                        type="name"
                        id="name"
                        placeholder="Mesh gradient name"
                        value={name || ""}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <Button onClick={() => createPalette(colorPoints, name, router)}>Create</Button>
                </div>
                {/*<Card>*/}
                {/*    <CardContent className="p-4 space-y-3">*/}
                {/*        <div className="flex justify-between items-center">*/}
                {/*            <h3 className="text-sm font-medium">CSS Code</h3>*/}
                {/*            <Button variant="ghost" size="icon" onClick={copyToClipboard}>*/}
                {/*                <Copy className="h-4 w-4" />*/}
                {/*            </Button>*/}
                {/*        </div>*/}
                {/*        <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">{cssCode}</pre>*/}
                {/*    </CardContent>*/}
                {/*</Card>*/}
            </div>
        </div>
    )
}

function createPalette(
    controls: ColorPoint[],
    name: string | null,
    router: ReturnType<typeof useRouter>
): void {
    const prevLocalStorage =
        localStorage.getItem("meshGradients") === null
            ? []
            : JSON.parse(localStorage.getItem("meshGradients") as string);

    const createdAt = new Date().getTime();

    const newPalette = [...prevLocalStorage, { controls, name, createdAt }];

    localStorage.setItem("meshGradients", JSON.stringify(newPalette));

    router.push(PAGES.HOME);
}