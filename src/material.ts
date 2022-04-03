import { Vec3 } from './geometry.js';

type float = number;

type Albedo = readonly [float,float,float,float];

/** [0,1] per component */
export type RgbPix = Vec3;

export class Material {
    albedo: Albedo;
    diffuse: RgbPix;
    specularExponent: number;

    constructor(albedo: Albedo, diffuse: RgbPix, specularExponent: number) {
        this.albedo = albedo;
        this.diffuse = diffuse;
        this.specularExponent = specularExponent;
    }
}