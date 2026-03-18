export function extractMapSrc(input) {
    if (!input) return null;
    const value = input.trim();

    if (value.includes("<iframe")) {
        const match = value.match(/src="([^"]+)"/);
        return match ? match[1] : null;
    }

    if (value.startsWith("http")) {
        return value;
    }
    return null;
}

export function getPreviewSrc(input) {
    if (!input) return null;
    const trimmed = input.trim();

    if (!trimmed.includes("google.com/maps/embed")) return null;
    return trimmed;
}