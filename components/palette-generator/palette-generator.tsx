import {useState, useCallback, useMemo, KeyboardEvent} from "react"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {
    Select,
    SelectContent, SelectGroup,
    SelectItem, SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {Label} from "@/components/ui/label";
import {Download, Copy, Eye, EyeOff, Pencil, Check, Save, LoaderCircle, X, Trash2, Plus} from "lucide-react"
import {toast} from "sonner"
import { hexToHsl, hslToHex, rgbToHex, hexToRgb } from "@/lib/utils";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch"
import Link from "next/link";
import saveToStorage from "@/hooks/saveToStorage.hook";
import {editStorageKey} from "@/hooks/editStorageKey.hook";
import {usePathname, useSearchParams} from "next/navigation";
import {useRouter} from "next/router";

const parseColorString = (colorStr: string): [number, number, number] | null => {
    // Remove whitespace
    colorStr = colorStr.trim()

    // Hex format
    if (colorStr.startsWith('#')) {
        if (colorStr.length === 7) {
            return hexToRgb(colorStr)
        }
    }

    // RGB format
    const rgbMatch = colorStr.match(/rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/)
    if (rgbMatch) {
        return [parseInt(rgbMatch[1]), parseInt(rgbMatch[2]), parseInt(rgbMatch[3])]
    }

    // HSL format
    const hslMatch = colorStr.match(/hsl\s*\(\s*(\d+)\s*,\s*(\d+)%?\s*,\s*(\d+)%?\s*\)/)
    if (hslMatch) {
        const h = parseInt(hslMatch[1])
        const s = parseInt(hslMatch[2])
        const l = parseInt(hslMatch[3])
        const hex = hslToHex(h, s, l)
        return hexToRgb(hex)
    }

    return null
}

const convertColorToHex = (colorStr: string): string => {
    const rgb = parseColorString(colorStr)
    if (!rgb) return "#000000"
    return rgbToHex(rgb[0], rgb[1], rgb[2])
}

const formatColor = (hex: string, format: string): string => {
    switch (format) {
        case 'hex':
            return hex
        case 'rgb': {
            const [r, g, b] = hexToRgb(hex)
            return `rgb(${r}, ${g}, ${b})`
        }
        case 'hsl': {
            const [h, s, l] = hexToHsl(hex)
            return `hsl(${h}, ${s}%, ${l}%)`
        }
        default:
            return hex
    }
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

interface Color {
    name: string
    displayName: string
    hex: string
}

type SupportedColourFormats = 'hex' | 'rgb' | 'hsl';

interface PaletteGeneratorProps {
    name: string;
    cols: Color[];
}

export default function PaletteGenerator({name, cols}: PaletteGeneratorProps) {
    const [selectedColourFormat, setSelectedColourFormat] = useState<SupportedColourFormats>("hex")

    const [colors, setColors] = useState(cols ?? [
        { name: "Primary", hex: "#3b82f6", displayName: "" },
        { name: "Secondary", hex: "#10b981", displayName: "" },
        { name: "Tertiary", hex: "#f59e0b", displayName: "" },
    ]);

    const defaultPaletteName = "New Palette";

    const [showAccessibility, setShowAccessibility] = useState(false)

    const [editingNameIndex, setEditingNameIndex] = useState<number | null>(null)
    const [colourIndex, setColourIndex] = useState<number | null>(null);

    const [paletteName, setPaletteName] = useState(name ?? defaultPaletteName);
    const [editingPaletteName, setEditingPaletteName] = useState(false);

    const [editedPaletteName, setEditedPaletteName] = useState<string | null>(null);

    const [isSaving, setIsSaving] = useState(false);

    const [colorValue, setColorValue] = useState([0, 0, 0, 1]); // Example initial RGBA

    const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);

    const handleColorPickerChange = (newRgba: number[]) => {
        setColorValue(newRgba);
        console.log("New RGBA:", newRgba);
    };

    // Convert the stored hex values to the selected format for display
    const getDisplayValue = (hexValue: string) => formatColor(hexValue, selectedColourFormat)
    const getPlaceholder = (hexValue: string) => formatColor(hexValue, selectedColourFormat)

    const generateShades = useCallback((hex: string, count = 9) => {
        const [h, s, l] = hexToHsl(hex)
        const shades = []

        // Define standard shade levels
        const shadeLevels = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]
        const lightnesses = [95, 85, 75, 65, 55, 45, 35, 25, 15, 10]

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
        return colors.map((color) => {
            const [h, s, l] = hexToHsl(color.hex)
            return {
                name: color.name,
                displayName: color.displayName,
                hex: color.hex,
                hsl: `hsl(${h}, ${s}%, ${l}%)`,
                rgb: `rgb(${parseInt(color.hex.slice(1, 3), 16)}, ${parseInt(color.hex.slice(3, 5), 16)}, ${parseInt(color.hex.slice(5, 7), 16)})`,
                shades: generateShades(color.hex),
            }
        })
    }, [colors, generateShades])

    const updateColor = (index: number, newHex: string) => {
        setColors((prev) => {
            const newColors = [...prev]
            newColors[index] = { ...newColors[index], hex: convertColorToHex(newHex) }
            return newColors
        })
    }

    const updateColorName = (index: number, newName: string) => {
        setColors((prev) => {
            const newColors = [...prev]
            newColors[index] = { ...newColors[index], name: newName }
            return newColors
        })
    }

    const addColor = () => {
        setColors((prev) => [
            ...prev,
            { name: `Color ${prev.length + 1}`, hex: "#000000", displayName: "" },
        ])
    }

    const removeColor = (index: number) => {
        setColors((prev) => prev.filter((_, i) => i !== index))
    }

    const searchParams = useSearchParams();
    const { replace } = useRouter();
    const pathname = usePathname();

    const exportFormats = useMemo(() => {

        const getShadeValue = (shade: { hex: string; hsl: string; rgb: string }) => {
            switch (selectedColourFormat) {
                case 'rgb':
                    return shade.rgb
                case 'hsl':
                    return shade.hsl
                case 'hex':
                default:
                    return shade.hex
            }
        }

        const cssVariables = palette
            .map(
                (color) =>
                    `/* ${color.name} */\n` +
                    color.shades.map((shade) => `  --color-${color.name.toLowerCase()}-${shade.name}: ${getShadeValue(shade)};`).join("\n"),
            )
            .join("\n\n")

        const cssClasses = palette
            .map((color) =>
                color.shades
                    .map(
                        (shade) =>
                            `.bg-${color.name.toLowerCase()}-${shade.name} { background-color: ${getShadeValue(shade)}; }\n` +
                            `.text-${color.name.toLowerCase()}-${shade.name} { color: ${getShadeValue(shade)}; }`,
                    )
                    .join("\n"),
            )
            .join("\n\n")

        const tailwindTheme = {
            colors: palette.reduce(
                (acc, color) => {
                    acc[color.name.toLowerCase()] = color.shades.reduce(
                        (shadeAcc, shade) => {
                            shadeAcc[shade.name] = getShadeValue(shade)
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
                    acc[color.name.toLowerCase()] = color.shades.map((shade) => getShadeValue(shade))
                    return acc
                },
                {} as Record<string, string[]>,
            ),
        }

        const daisyUITheme = palette.reduce(
            (acc, color, index) => {
                const colorNames = ["primary", "secondary", "accent"]
                if (index < colorNames.length) {
                    acc[colorNames[index]] = getShadeValue(color)
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
    }, [palette, selectedColourFormat])

    const copyToClipboard = (text: string, format: string) => {
        navigator.clipboard.writeText(text);
        console.log(format)
        let toastData;
        if (format != 'Color') {
            toastData = {
                description: format,
            }
        } else {
            toastData = {
                icon: <div className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                           style={{backgroundColor: text}}/>
            };
        }
        toast('Copied', toastData);
    }

    const downloadFile = (content: string, filename: string) => {
        const blob = new Blob([content], {type: "text/plain"})
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

    const handleColorChange = (colorStr: string, setter: (value: string) => void) => {
        // Convert input to hex for internal storage
        const hexColor = convertColorToHex(colorStr)
        setter(hexColor)
    }

    const save = () => {
        setIsSaving(true);
        setTimeout(() => {
            saveToStorage('palettes', {paletteName, colors});
            setIsSaving(false);
            toast('Saved');
        }, 500);
        console.log(pathname);
        const params = new URLSearchParams(searchParams);
        params.set('name', paletteName);
        console.log(paletteName, params.toString());
        replace(`/palette?${params.toString()}`);
    };

    return (
        <div>
            <div className='flex justify-between items-center'>
                <div className="flex items-center">
                    {editingPaletteName ? (
                        <form
                            onSubmit={(e) => {
                                console.log('jnkjn')
                                setEditingPaletteName(true);
                                e.preventDefault(); // prevent page reload
                                // setEditingNameIndex(null); // optional, exit edit mode
                                console.log(e)
                            }}
                            className="flex flex-1 mr-2 font-semibold"
                        >
                            <Input
                                value={paletteName}
                                onChange={(e) => {
                                    setPaletteName(e.target.value);
                                    setEditedPaletteName(e.target.value);
                                }}
                                onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                                    if(e.key === 'Enter') {
                                        e.preventDefault();
                                        setEditingPaletteName(false);
                                        if(editedPaletteName) {
                                            editStorageKey('palettes', paletteName, editedPaletteName);
                                        }
                                    }
                                }}
                                // onBlur={() => setEditingNameIndex(null)}
                                className="flex flex-1 mr-2"
                                autoFocus
                            />
                            <Button
                                variant="ghost"
                                onClick={() => {
                                    setEditingPaletteName(false);
                                    if (paletteName.length <= 0) {
                                        setPaletteName(defaultPaletteName)
                                        if(editedPaletteName) {
                                            editStorageKey('palettes', paletteName, editedPaletteName);
                                        }
                                    }
                                }}
                            >
                                <Check/>
                                Save
                            </Button>
                        </form>
                    ) : (
                        <div className="flex flex-1 gap-3">
                            <span className="flex flex-1 leading-none font-semibold items-center">{paletteName}</span>
                            <Button
                                variant="ghost"
                                onClick={() => setEditingPaletteName(true)}
                            >
                                <Pencil className="w-4 h-4 mr-2"/>
                                Edit
                            </Button>
                        </div>
                    )}
                </div>
                <div className='flex items-end gap-2'>
                    <SelectGroup>
                        <SelectLabel>Colour Format</SelectLabel>
                        <Select value={selectedColourFormat} onValueChange={(value: SupportedColourFormats) => {
                            setSelectedColourFormat(value)
                        }}>
                            <SelectTrigger className="w-30">
                                <SelectValue/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="hex">Hex</SelectItem>
                                <SelectItem value="rgb">RGB</SelectItem>
                                <SelectItem value="hsl">HSL</SelectItem>
                            </SelectContent>
                        </Select>
                    </SelectGroup>
                    <div className='flex items-end gap-2'>
                        <Button
                            disabled={isSaving}
                            variant="outline"
                            asChild
                        >
                            <Link href="#export">
                                <Download className="w-4 h-4 mr-2"/>
                                Export
                            </Link>
                        </Button>
                        <Button
                            onClick={save}
                            disabled={isSaving}
                        >

                            {
                                isSaving ? (
                                    <>
                                        <LoaderCircle className="w-4 h-4 mr-2 animate-spin"/>
                                        Saving
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4 mr-2"/>
                                        Save
                                    </>
                                )
                            }
                        </Button>
                    </div>
                </div>
            </div>
            <div className='flex items-center justify-end gap-4 mt-6 mb-6'>
                <div className='flex items-center justify-end gap-2'>
                    <Label htmlFor="a11y">
                        Show Accessibility Info
                    </Label>
                    <Switch id="a11y" checked={showAccessibility} onCheckedChange={() => setShowAccessibility(!showAccessibility)} />
                </div>
                <Button
                    variant="outline"
                >
                    <Plus className="w-4 h-4 mr-2"/>
                    Add Color
                </Button>
            </div>
            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-3">
                    <Card>
                        <CardHeader>
                            <CardTitle>Base Colours</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col gap-4">
                                    {colors.map((color, index) => (
                                        <div className="space-y-2" key={index}>
                                            <div className="flex flex-col gap-2">
                                                <div className="flex items-center">
                                                    {editingNameIndex === index ? (
                                                        <form
                                                            onSubmit={(e) => {
                                                                e.preventDefault(); // prevent page reload
                                                                updateColorName(index, color.name);
                                                                // setEditingNameIndex(null); // optional, exit edit mode
                                                            }}
                                                            className="flex flex-1 mr-2"
                                                        >
                                                            <Input
                                                                value={color.name}
                                                                onChange={(e) => updateColorName(index, e.target.value)}
                                                                // onBlur={() => setEditingNameIndex(null)}
                                                                className="flex-1 mr-2"
                                                                autoFocus
                                                            />
                                                            <Button
                                                                size="icon"
                                                                variant="ghost"
                                                                onClick={() => setEditingNameIndex(null)}
                                                            >
                                                                <Check/>
                                                            </Button>
                                                        </form>
                                                    ) : (
                                                        <>
                                                            <span className="flex-1 truncate leading-none font-semibold flex items-center gap-3">{color.name}</span>
                                                            <Button
                                                                variant="ghost"
                                                                onClick={() => setEditingNameIndex(index)}
                                                            >
                                                                <Pencil className="w-4 h-4 mr-2"/>
                                                                Edit
                                                            </Button>
                                                        </>
                                                    )}
                                                </div>

                                                <div className="flex">
                                                    <Input
                                                        type="color"
                                                        value={color.hex}
                                                        onChange={(e) => updateColor(index, e.target.value)}
                                                        className="w-16 h-10 p-1 border-2"
                                                    />
                                                    <Input
                                                        value={getDisplayValue(color.hex)}
                                                        onChange={(e) => updateColor(index, e.target.value)}
                                                        placeholder={getPlaceholder(color.hex)}
                                                        className="flex-1"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    <Button variant="outline" size="sm" onClick={addColor}>
                                        + Add Color
                                    </Button>
                                </div>
                            </div>


                            <div className="flex flex-col gap-2">
                                <Button variant="outline" size="sm"
                                        onClick={() => setShowAccessibility(!showAccessibility)}>
                                    {showAccessibility ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                                    {showAccessibility ? "Hide" : "Show"} Accessibility Info
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="col-span-9">
                    <div className="flex flex-col gap-6">
                        {palette.map((colorGroup, index) => (
                            <Card key={colorGroup.name}>
                                <CardHeader>
                                    <CardTitle className="flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="relative w-8 h-8 rounded-full border-4 border-white shadow-sm"
                                                style={{backgroundColor: colorGroup.hex}}
                                            >
                                            </div>
                                            {colorGroup.name}
                                        </div>
                                        <Button
                                            className="hover:bg-red-500 hover:text-white focus:bg-red-500 dark:hover:text-red-400"
                                            variant="ghost"
                                            onClick={() => removeColor(index)}
                                        >
                                            <Trash2 className="w-4 h-4 mr-2"/>
                                            Delete
                                        </Button>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-10 gap-3">
                                        {colorGroup.shades.map((shade) => {
                                            const a11y = getAccessibilityInfo(shade.hex)
                                            const displayValue = formatColor(shade.hex, selectedColourFormat)
                                            return (
                                                <div key={shade.name} className="space-y-2">
                                                    <div
                                                        className="group aspect-square rounded-lg border-2 border-white shadow-sm cursor-pointer hover:scale-105 transition-transform flex items-center justify-center"
                                                        style={{backgroundColor: shade.hex}}
                                                        onClick={() => copyToClipboard(displayValue, "Color")}
                                                    />
                                                    <div className="text-center space-y-1">
                                                        <div className="font-medium text-sm">{shade.name}</div>
                                                        <div className="text-xs text-slate-600 space-y-0.5">
                                                            <div>{displayValue}</div>
                                                        </div>
                                                        {showAccessibility && (
                                                            <div className="text-xs space-y-1">
                                                                <div className="flex justify-between">
                                                                    <span>vs White:</span>
                                                                    <span
                                                                        className={`px-1 rounded text-xs ${a11y.contrastWhite.level === "Fail" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}>
                                                                        {a11y.contrastWhite.level}
                                                                    </span>
                                                                </div>
                                                                <div className="flex justify-between">
                                                                    <span>vs Black:</span>
                                                                    <span
                                                                        className={`px-1 rounded text-xs ${a11y.contrastBlack.level === "Fail" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}>
                                                                        {a11y.contrastBlack.level}
                                                                    </span>
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
            </div>

            <Dialog open={isExportDialogOpen}>
                <DialogHeader className="sr-only">
                    <DialogTitle>test</DialogTitle>
                    <DialogDescription>test</DialogDescription>
                </DialogHeader>
                <DialogContent>
                    <h1>h</h1>
                </DialogContent>
            </Dialog>
            <div id="export"></div>
            <Card className="mt-8">
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
                                    <Copy className="w-4 h-4 mr-2"/>
                                    Copy
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => downloadFile(exportFormats.cssVariables, "palette-variables.css")}
                                >
                                    <Download className="w-4 h-4 mr-2"/>
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
                                    <Copy className="w-4 h-4 mr-2"/>
                                    Copy
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => downloadFile(exportFormats.cssClasses, "palette-classes.css")}
                                >
                                    <Download className="w-4 h-4 mr-2"/>
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
                                    <Copy className="w-4 h-4 mr-2"/>
                                    Copy
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => downloadFile(exportFormats.tailwindTheme, "tailwind-theme.json")}
                                >
                                    <Download className="w-4 h-4 mr-2"/>
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
                                    <Copy className="w-4 h-4 mr-2"/>
                                    Copy
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => downloadFile(exportFormats.mantineTheme, "mantine-theme.json")}
                                >
                                    <Download className="w-4 h-4 mr-2"/>
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
                                    <Copy className="w-4 h-4 mr-2"/>
                                    Copy
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => downloadFile(exportFormats.daisyUITheme, "daisyui-theme.json")}
                                >
                                    <Download className="w-4 h-4 mr-2"/>
                                    Download
                                </Button>
                            </div>
                            <pre className="bg-slate-100 dark:bg-zinc-800 p-4 rounded-lg text-sm overflow-x-auto">
                                <code>{exportFormats.daisyUITheme}</code>
                            </pre>
                        </TabsContent>

                        <TabsContent value="json" className="space-y-4">
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm"
                                        onClick={() => copyToClipboard(exportFormats.json, "JSON")}>
                                    <Copy className="w-4 h-4 mr-2"/>
                                    Copy
                                </Button>
                                <Button variant="outline" size="sm"
                                        onClick={() => downloadFile(exportFormats.json, "palette.json")}>
                                    <Download className="w-4 h-4 mr-2"/>
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
    )
}