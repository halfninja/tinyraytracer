import { Vec3 } from './geometry.js';

export class Light {
    position: Vec3;
    intensity: number;

    constructor(position: Vec3, intensity: number) {
        this.position = position;
        this.intensity = intensity;
    }
}