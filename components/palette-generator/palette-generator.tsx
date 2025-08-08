import { useState, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Badge } from "@/components/ui/badge"
import { Download, Copy, Palette, Eye, EyeOff } from "lucide-react"
// import { toast } from "@/hooks/use-toast"

// Color utility functions
const hexToHsl = (hex: string): [number, number, number] => {
    const r = Number.parseInt(hex.slice(1, 3), 16) / 255
    const g = Number.parseInt(hex.slice(3, 5), 16) / 255
    const b = Number.parseInt(hex.slice(5, 7), 16) / 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0,
        s = 0,
        l = (max + min) / 2

    if (max !== min) {
        const d = max - min
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0)
                break
            case g:
                h = (b - r) / d + 2
                break
            case b:
                h = (r - g) / d + 4
                break
        }
        h /= 6
    }

    return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)]
}

const hslToHex = (h: number, s: number, l: number): string => {
    h /= 360
    s /= 100
    l /= 100

    const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1
        if (t > 1) t -= 1
        if (t < 1 / 6) return p + (q - p) * 6 * t
        if (t < 1 / 2) return q
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
        return p
    }

    let r, g, b
    if (s === 0) {
        r = g = b = l
    } else {
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s
        const p = 2 * l - q
        r = hue2rgb(p, q, h + 1 / 3)
        g = hue2rgb(p, q, h)
        b = hue2rgb(p, q, h - 1 / 3)
    }

    const toHex = (c: number) => {
        const hex = Math.round(c * 255).toString(16)
        return hex.length === 1 ? "0" + hex : hex
    }

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

const getContrastRatio = (color1: string, color2: string): number => {
    const getLuminance = (hex: string) => {
        const rgb = [
            Number.parseInt(hex.slice(1, 3), 16),
            Number.parseInt(hex.slice(3, 5), 16),
            Number.parseInt(hex.slice(5, 7), 16),
        ].map((c) => {
            c = c / 255
            return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
        })
        return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]
    }

    const lum1 = getLuminance(color1)
    const lum2 = getLuminance(color2)
    const brightest = Math.max(lum1, lum2)
    const darkest = Math.min(lum1, lum2)

    return (brightest + 0.05) / (darkest + 0.05)
}

interface ColorPalette {
    name: string
    displayName: string
    hex: string
    hsl: string
    rgb: string
    shades: Array<{
        name: string
        hex: string
        hsl: string
        rgb: string
    }>
}

export default function PaletteGenerator() {
    const [baseColor, setBaseColor] = useState("#3b82f6")
    const [secondaryColor, setSecondaryColor] = useState("#10b981")
    const [tertiaryColor, setTertiaryColor] = useState("#f59e0b")
    const [showAccessibility, setShowAccessibility] = useState(true)

    const [baseDisplayName, setBaseDisplayName] = useState("");
    const [secondaryDisplayName, setSecondaryDisplayName] = useState("");
    const [tertiaryDisplayName, setTertiaryDisplayName] = useState("");

    const generateShades = useCallback((hex: string, count = 9) => {
        const [h, s, l] = hexToHsl(hex)
        const shades = []

        // Define standard shade levels
        const shadeLevels = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]
        const lightnesses = [95, 85, 75, 65, 55, 45, 35, 25, 15, 5]

        // Find the closest shade level for the base color
        let baseShadeIndex = 5 // Default to 500
        let minDiff = Math.abs(l - lightnesses[5])

        for (let i = 0; i < lightnesses.length; i++) {
            const diff = Math.abs(l - lightnesses[i])
            if (diff < minDiff) {
                minDiff = diff
                baseShadeIndex = i
            }
        }

        // Generate all shades
        for (let i = 0; i < shadeLevels.length; i++) {
            let newHex, newH, newS, newL

            if (i === baseShadeIndex) {
                // Use the original base color
                newHex = hex
                newH = h
                newS = s
                newL = l
            } else {
                // Generate shade
                const lightness = lightnesses[i]
                const saturation = i <= 1 ? Math.max(s - 20, 10) : s
                newHex = hslToHex(h, saturation, lightness)
                    ;[newH, newS, newL] = hexToHsl(newHex)
            }

            shades.push({
                name: shadeLevels[i].toString(),
                hex: newHex,
                hsl: `hsl(${newH}, ${newS}%, ${newL}%)`,
                rgb: `rgb(${parseInt(newHex.slice(1, 3), 16)}, ${parseInt(newHex.slice(3, 5), 16)}, ${parseInt(newHex.slice(5, 7), 16)})`,
            })
        }

        return shades
    }, [])

    const palette = useMemo((): ColorPalette[] => {
        const colors = [
            { name: "Primary", hex: baseColor, displayName: baseDisplayName },
            { name: "Secondary", hex: secondaryColor, displayName: secondaryDisplayName },
            { name: "Tertiary", hex: tertiaryColor, displayName: tertiaryDisplayName },
        ]

        return colors.map((color) => {
            const [h, s, l] = hexToHsl(color.hex)
            return {
                name: color.name,
                displayName: color.displayName,
                hex: color.hex,
                hsl: `hsl(${h}, ${s}%, ${l}%)`,
                rgb: `rgb(${Number.parseInt(color.hex.slice(1, 3), 16)}, ${Number.parseInt(color.hex.slice(3, 5), 16)}, ${Number.parseInt(color.hex.slice(5, 7), 16)})`,
                shades: generateShades(color.hex),
            }
        })
    }, [baseColor, secondaryColor, tertiaryColor, generateShades])

    console.log(palette);

    const exportFormats = useMemo(() => {
        const cssVariables = palette
            .map(
                (color) =>
                    `/* ${color.name} */\n` +
                    color.shades.map((shade) => `  --color-${color.name.toLowerCase()}-${shade.name}: ${shade.hex};`).join("\n"),
            )
            .join("\n\n")

        const cssClasses = palette
            .map((color) =>
                color.shades
                    .map(
                        (shade) =>
                            `.bg-${color.name.toLowerCase()}-${shade.name} { background-color: ${shade.hex}; }\n` +
                            `.text-${color.name.toLowerCase()}-${shade.name} { color: ${shade.hex}; }`,
                    )
                    .join("\n"),
            )
            .join("\n\n")

        const tailwindTheme = {
            colors: palette.reduce(
                (acc, color) => {
                    acc[color.name.toLowerCase()] = color.shades.reduce(
                        (shadeAcc, shade) => {
                            shadeAcc[shade.name] = shade.hex
                            return shadeAcc
                        },
                        {} as Record<string, string>,
                    )
                    return acc
                },
                {} as Record<string, Record<string, string>>,
            ),
        }

        const mantineTheme = {
            colors: palette.reduce(
                (acc, color) => {
                    acc[color.name.toLowerCase()] = color.shades.map((shade) => shade.hex)
                    return acc
                },
                {} as Record<string, string[]>,
            ),
        }

        const daisyUITheme = palette.reduce(
            (acc, color, index) => {
                const colorNames = ["primary", "secondary", "accent"]
                if (index < colorNames.length) {
                    acc[colorNames[index]] = color.hex
                }
                return acc
            },
            {} as Record<string, string>,
        )

        const jsonExport = {
            palette: palette.map((color) => ({
                name: color.name,
                hex: color.hex,
                hsl: color.hsl,
                rgb: color.rgb,
                shades: color.shades,
            })),
        }

        return {
            cssVariables,
            cssClasses,
            tailwindTheme: JSON.stringify(tailwindTheme, null, 2),
            mantineTheme: JSON.stringify(mantineTheme, null, 2),
            daisyUITheme: JSON.stringify(daisyUITheme, null, 2),
            json: JSON.stringify(jsonExport, null, 2),
        }
    }, [palette])

    const copyToClipboard = (text: string, format: string) => {
        navigator.clipboard.writeText(text)
        // toast({
        //   title: "Copied to clipboard",
        //   description: `${format} format copied successfully`,
        // })
    }

    const downloadFile = (content: string, filename: string) => {
        const blob = new Blob([content], { type: "text/plain" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = filename
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }

    const getAccessibilityInfo = (color: string) => {
        const contrastWhite = getContrastRatio(color, "#ffffff")
        const contrastBlack = getContrastRatio(color, "#000000")

        const getLevel = (ratio: number) => {
            if (ratio >= 7) return "AAA"
            if (ratio >= 4.5) return "AA"
            if (ratio >= 3) return "AA Large"
            return "Fail"
        }

        return {
            contrastWhite: {
                ratio: contrastWhite.toFixed(2),
                level: getLevel(contrastWhite),
            },
            contrastBlack: {
                ratio: contrastBlack.toFixed(2),
                level: getLevel(contrastBlack),
            },
            recommendedText: contrastWhite > contrastBlack ? "white" : "black",
        }
    }

    return (
        <div>
            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-9">
                    <div className="flex flex-col gap-6">
                        {palette.map((colorGroup) => (
                            <Card key={colorGroup.name}>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-3">
                                        <div
                                            className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                                            style={{ backgroundColor: colorGroup.hex }}
                                        />
                                        {colorGroup.name}
                                        {/* <Badge variant="secondary">{colorGroup.hex}</Badge> */}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-10 gap-3">
                                        {colorGroup.shades.map((shade) => {
                                            const a11y = getAccessibilityInfo(shade.hex)
                                            return (
                                                <div key={shade.name} className="space-y-2">
                                                    <div
                                                        className="aspect-square rounded-lg border-2 border-white shadow-sm cursor-pointer hover:scale-105 transition-transform"
                                                        style={{ backgroundColor: shade.hex }}
                                                        onClick={() => copyToClipboard(shade.hex, "Hex color")}
                                                    />
                                                    <div className="text-center space-y-1">
                                                        <div className="font-medium text-sm">{shade.name}</div>
                                                        <div className="text-xs text-slate-600 space-y-0.5">
                                                            <div>{shade.hex}</div>
                                                            <div>{shade.hsl}</div>
                                                            <div>{shade.rgb}</div>
                                                        </div>
                                                        {showAccessibility && (
                                                            <div className="text-xs space-y-1">
                                                                <div className="flex justify-between">
                                                                    <span>vs White:</span>
                                                                    {/* <Badge
                                  variant={a11y.contrastWhite.level === "Fail" ? "destructive" : "secondary"}
                                  className="text-xs px-1 py-0"
                                >
                                  {a11y.contrastWhite.level}
                                </Badge>
                              </div>
                              <div className="flex justify-between">
                                <span>vs Black:</span>
                                <Badge
                                  variant={a11y.contrastBlack.level === "Fail" ? "destructive" : "secondary"}
                                  className="text-xs px-1 py-0"
                                >
                                  {a11y.contrastBlack.level}
                                </Badge> */}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
                <div className="col-span-3 max-h-min">
                    <Card className="sticky top-20">
                        <CardHeader>
                            <CardTitle>Base Colors</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex flex-col">
                                <div className="space-y-2">
                                    <Label htmlFor="base-color">Primary Color</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="base-color"
                                            type="color"
                                            value={baseColor}
                                            onChange={(e) => setBaseColor(e.target.value)}
                                            className="w-16 h-10 p-1 border-2"
                                        />
                                        <Input
                                            value={baseColor}
                                            onChange={(e) => setBaseColor(e.target.value)}
                                            placeholder="#3b82f6"
                                            className="flex-1"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="secondary-color">Secondary Color</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="secondary-color"
                                            type="color"
                                            value={secondaryColor}
                                            onChange={(e) => setSecondaryColor(e.target.value)}
                                            className="w-16 h-10 p-1 border-2"
                                        />
                                        <Input
                                            value={secondaryColor}
                                            onChange={(e) => setSecondaryColor(e.target.value)}
                                            placeholder="#10b981"
                                            className="flex-1"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="tertiary-color">Tertiary Color</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="tertiary-color"
                                            type="color"
                                            value={tertiaryColor}
                                            onChange={(e) => setTertiaryColor(e.target.value)}
                                            className="w-16 h-10 p-1 border-2"
                                        />
                                        <Input
                                            value={tertiaryColor}
                                            onChange={(e) => setTertiaryColor(e.target.value)}
                                            placeholder="#f59e0b"
                                            className="flex-1"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" onClick={() => setShowAccessibility(!showAccessibility)}>
                                    {showAccessibility ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    {showAccessibility ? "Hide" : "Show"} Accessibility Info
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
            <div className="max-w-7xl mx-auto space-y-8">

                <div className="space-y-6">

                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Export Palette</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="css-variables" className="w-full">
                            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
                                <TabsTrigger value="css-variables">CSS Variables</TabsTrigger>
                                <TabsTrigger value="css-classes">CSS Classes</TabsTrigger>
                                <TabsTrigger value="tailwind">Tailwind</TabsTrigger>
                                <TabsTrigger value="mantine">Mantine</TabsTrigger>
                                <TabsTrigger value="daisyui">DaisyUI</TabsTrigger>
                                <TabsTrigger value="json">JSON</TabsTrigger>
                            </TabsList>

                            <TabsContent value="css-variables" className="space-y-4">
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => copyToClipboard(exportFormats.cssVariables, "CSS Variables")}
                                    >
                                        <Copy className="w-4 h-4 mr-2" />
                                        Copy
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => downloadFile(exportFormats.cssVariables, "palette-variables.css")}
                                    >
                                        <Download className="w-4 h-4 mr-2" />
                                        Download
                                    </Button>
                                </div>
                                <pre className="bg-slate-100 dark:bg-zinc-800 p-4 rounded-lg text-sm overflow-x-auto">
                                    <code>{exportFormats.cssVariables}</code>
                                </pre>
                            </TabsContent>

                            <TabsContent value="css-classes" className="space-y-4">
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => copyToClipboard(exportFormats.cssClasses, "CSS Classes")}
                                    >
                                        <Copy className="w-4 h-4 mr-2" />
                                        Copy
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => downloadFile(exportFormats.cssClasses, "palette-classes.css")}
                                    >
                                        <Download className="w-4 h-4 mr-2" />
                                        Download
                                    </Button>
                                </div>
                                <pre className="bg-slate-100 dark:bg-zinc-800 p-4 rounded-lg text-sm overflow-x-auto">
                                    <code>{exportFormats.cssClasses}</code>
                                </pre>
                            </TabsContent>

                            <TabsContent value="tailwind" className="space-y-4">
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => copyToClipboard(exportFormats.tailwindTheme, "Tailwind Theme")}
                                    >
                                        <Copy className="w-4 h-4 mr-2" />
                                        Copy
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => downloadFile(exportFormats.tailwindTheme, "tailwind-theme.json")}
                                    >
                                        <Download className="w-4 h-4 mr-2" />
                                        Download
                                    </Button>
                                </div>
                                <pre className="bg-slate-100 dark:bg-zinc-800 p-4 rounded-lg text-sm overflow-x-auto">
                                    <code>{exportFormats.tailwindTheme}</code>
                                </pre>
                            </TabsContent>

                            <TabsContent value="mantine" className="space-y-4">
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => copyToClipboard(exportFormats.mantineTheme, "Mantine Theme")}
                                    >
                                        <Copy className="w-4 h-4 mr-2" />
                                        Copy
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => downloadFile(exportFormats.mantineTheme, "mantine-theme.json")}
                                    >
                                        <Download className="w-4 h-4 mr-2" />
                                        Download
                                    </Button>
                                </div>
                                <pre className="bg-slate-100 dark:bg-zinc-800 p-4 rounded-lg text-sm overflow-x-auto">
                                    <code>{exportFormats.mantineTheme}</code>
                                </pre>
                            </TabsContent>

                            <TabsContent value="daisyui" className="space-y-4">
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => copyToClipboard(exportFormats.daisyUITheme, "DaisyUI Theme")}
                                    >
                                        <Copy className="w-4 h-4 mr-2" />
                                        Copy
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => downloadFile(exportFormats.daisyUITheme, "daisyui-theme.json")}
                                    >
                                        <Download className="w-4 h-4 mr-2" />
                                        Download
                                    </Button>
                                </div>
                                <pre className="bg-slate-100 dark:bg-zinc-800 p-4 rounded-lg text-sm overflow-x-auto">
                                    <code>{exportFormats.daisyUITheme}</code>
                                </pre>
                            </TabsContent>

                            <TabsContent value="json" className="space-y-4">
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" onClick={() => copyToClipboard(exportFormats.json, "JSON")}>
                                        <Copy className="w-4 h-4 mr-2" />
                                        Copy
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={() => downloadFile(exportFormats.json, "palette.json")}>
                                        <Download className="w-4 h-4 mr-2" />
                                        Download
                                    </Button>
                                </div>
                                <pre className="bg-slate-100 dark:bg-zinc-800 p-4 rounded-lg text-sm overflow-x-auto">
                                    <code>{exportFormats.json}</code>
                                </pre>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
