import { RgbPix, Material } from './material.js';
import { Vec3 } from './geometry.js'

const COLORS = {
    red: [0.8, 0, 0],
    green: [0, 150, 50],
    grey: [0.8, 0.8, 0.8],
    darkGrey: [0.4, 0.4, 0.4],
} as const;

export const RED = new Material(
    [0.9, 0.1, 0.3, 0.0],
    new Vec3(0.4, 0.1, 0.1),
    50
);
export const IVORY = new Material(
    [0.6, 0.3, 0.3, 0.0],
    new Vec3(0.4, 0.4, 0.3),
    50
);
export const MIRROR = new Material(
    [0.0, 16.0, 0.8, 0.0],
    new Vec3(1,1,1),
    1425
);