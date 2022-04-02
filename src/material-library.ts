import { RgbPix, Material } from './material.js';

const COLORS = {
    red: [200, 0, 0] as RgbPix,
    green: [0, 150, 50],
    grey: [200, 200, 200],
    darkGrey: [100, 100, 100],
} as const;

export const RED = Material.diffuse([100, 25, 25]);
export const IVORY = Material.diffuse([100, 100, 75])