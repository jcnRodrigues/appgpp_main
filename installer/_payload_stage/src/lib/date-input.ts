const DATE_ONLY_RE = /^(\d{4})-(\d{2})-(\d{2})$/;

function parseDateOnly(value: string): Date | null {
    const match = value.match(DATE_ONLY_RE);
    if (!match) return null;

    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);

    const parsed = new Date(year, month - 1, day);
    if (
        parsed.getFullYear() !== year ||
        parsed.getMonth() !== month - 1 ||
        parsed.getDate() !== day
    ) {
        return null;
    }

    return parsed;
}

export function parseDateInput(value: unknown): Date {
    if (typeof value === "string") {
        const trimmed = value.trim();
        if (!trimmed) throw new Error("Data vazia.");

        const dateOnly = parseDateOnly(trimmed);
        if (dateOnly) return dateOnly;

        const parsed = new Date(trimmed);
        if (!Number.isNaN(parsed.getTime())) return parsed;
        throw new Error(`Data invalida: ${value}`);
    }

    if (value instanceof Date && !Number.isNaN(value.getTime())) {
        return value;
    }

    throw new Error(`Data invalida: ${String(value)}`);
}

export function parseOptionalDateInput(value: unknown): Date | undefined {
    if (typeof value === "undefined" || value === null || value === "") {
        return undefined;
    }

    return parseDateInput(value);
}

export function parseNullableDateInput(value: unknown): Date | null | undefined {
    if (typeof value === "undefined") return undefined;
    if (value === null || value === "") return null;
    return parseDateInput(value);
}

