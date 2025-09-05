export const editStorageKey = (
    key: string,
    oldName: string,
    newName: string
) => {
    try {
        const existing = localStorage.getItem(key);
        if (!existing) return;

        const data: Record<string, any> = JSON.parse(existing);

        if (!data[oldName]) return; // oldName not found

        // Move the entry to the new key
        const entry = { ...data[oldName], paletteName: newName };
        delete data[oldName];
        data[newName] = entry;

        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error("Error editing storage key", error);
    }
};
