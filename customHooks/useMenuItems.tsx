import {PaletteIcon, SwatchBook, Briefcase, ArrowLeftRight} from "lucide-react";
import {NewMenuItems} from "@/types/MenuItem";

export const useMenuItems = () => {
    const menuItems: NewMenuItems = [
        {
            label: 'Library',
            colour: 'text-blue-500',
            subItems: [
                {
                    label: 'Palettes',
                    href: '/palettes',
                    description: 'Explore curated color sets to spark your creativity',
                    icon: <PaletteIcon />
                },
                {
                    label: 'Gradients',
                    href: '/gradients',
                    description: 'Create smooth transitions between colors',
                    icon: <SwatchBook />
                },
                {
                    label: 'Brand Kit',
                    href: '/brand-kit',
                    description: 'Analyse your palette — shades, components, A11y, dark mode',
                    icon: <Briefcase />
                },
                {
                    label: 'Colours',
                    href: '/colours',
                    description: 'Browse and explore a wide range of colors'
                },
                {
                    label: 'Convert',
                    href: '/convert',
                    description: 'Convert colours between HEX, RGB, HSL and OKLCH',
                    icon: <ArrowLeftRight />
                }
            ]
        },
        {
            label: 'Create',
            colour: 'text-red-500',
            subItems: [
                {
                    label: 'Palette',
                    href: '/create/palette',
                    description: 'Build your own custom color palette'
                },
                {
                    label: 'Gradient',
                    href: '/create/gradient',
                    description: 'Design your own linear gradients'
                },
                {
                    label: 'Radial Gradient',
                    href: '/create/radial-gradient',
                    description: 'Create vibrant radial gradients'
                },
                {
                    label: 'Mesh Gradient',
                    href: '/create/mesh-gradient',
                    description: 'Mesh gradients with total control'
                }
            ]
        }
    ];

    return menuItems;
};

export default useMenuItems;