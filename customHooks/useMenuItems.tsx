import {PaletteIcon, SwatchBook} from "lucide-react";
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
                    label: 'Colours',
                    href: '/colours',
                    description: 'Browse and explore a wide range of colors'
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
                }
            ]
        }
    ];

    return menuItems;
};

export default useMenuItems;