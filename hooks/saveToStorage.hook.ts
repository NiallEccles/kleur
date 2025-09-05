export const saveToStorage = (
    key: string,
    value: { paletteName: string; [k: string]: any }
) => {
    try {
        const existing = localStorage.getItem(key);
        let data: Record<string, any> = {};

        if (existing) {
            data = JSON.parse(existing);
        }

        // Store by paletteName
        data[value.paletteName] = value;

        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error("Error saving to localStorage", error);
    }
};

export default saveToStorage;
