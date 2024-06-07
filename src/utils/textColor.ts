function hexToRgb(hex: string): [number, number, number] {
    // Remove leading '#' if present
    hex = hex.replace(/^#/, '');
    // Parse the hex color into RGB components
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return [r, g, b];
}

function calculateLuminance([r, g, b]: [number, number, number]): number {
    const a = [r, g, b].map(v => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}

function averageLuminance(lum1: number, lum2: number): number {
    return (lum1 + lum2) / 2;
}

export function getTextColor(hex1: string, hex2: string): string {
    const rgb1 = hexToRgb(hex1);
    const rgb2 = hexToRgb(hex2);

    const lum1 = calculateLuminance(rgb1);
    const lum2 = calculateLuminance(rgb2);

    const avgLuminance = averageLuminance(lum1, lum2);

    return avgLuminance > 0.5 ? 'black' : 'white';
}