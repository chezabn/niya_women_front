/** Keeps the first occurrence of each API record, preserving list order. */
export function uniqueById<T extends { id: string | number }>(items: T[]): T[] {
    const seen = new Set<string>();

    return items.filter((item) => {
        const id = String(item.id);
        if (seen.has(id)) return false;
        seen.add(id);
        return true;
    });
}
