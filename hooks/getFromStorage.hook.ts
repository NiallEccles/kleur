export const getFromStorage = <T = any>(key: string, itemKey: string): T | null => {
    try {
        const existing = localStorage.getItem(key);
        if (!existing) return null;

        const data: Record<string, any> = JSON.parse(existing);

        return data[itemKey] ?? null;
    } catch (error) {
        console.error("Error getting from localStorage", error);
        return null;
    }
};
