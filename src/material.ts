import { Vec3f } from './geometry.js';

type float = number;
type int = number;

/** 8 bits per component */
export type RgbPix = readonly [int, int, int];

export class Material {
    diffuse: RgbPix;

    constructor(diffuse: RgbPix) {
        this.diffuse = diffuse;
    }

    static diffuse(color: RgbPix): Material {
        return new Material(color);
    }
}