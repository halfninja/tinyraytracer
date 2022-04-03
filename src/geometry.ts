import { Material } from './material.js';

export class Vec3 {
    x: number;
    y: number;
    z: number;
    
    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    plus(other: Vec3): Vec3 {
        return new Vec3(
            this.x + other.x,
            this.y + other.y,
            this.z + other.z,
        );
    }

    minus(other: Vec3): Vec3 {
        return new Vec3(
            this.x - other.x,
            this.y - other.y,
            this.z - other.z,
        );
    }

    multiply(other: Vec3): number {
        return (
            this.x * other.x +
            this.y * other.y +
            this.z * other.z
        );
    }

    scale(factor: number): Vec3 {
        return new Vec3(
            this.x * factor,
            this.y * factor,
            this.z * factor,
        );
    }

    norm(): number {
        return Math.sqrt(this.multiply(this));
    }

    normalized() {
        return this.scale(1.0/this.norm());
    }

    toTuple() {
        return [this.x,this.y,this.z] as const;
    }
}

export interface Shape {
    ray_intersect(orig: Vec3, dir: Vec3): [boolean, number];
}

export class Sphere {
    position: Vec3;
    radius: number;
    material: Material;

    constructor(position: Vec3, radius: number, material: Material) {
        this.position = position;
        this.radius = radius;
        this.material = material;
    }

    ray_intersect(orig: Vec3, dir: Vec3): [boolean, number] {
        const l: Vec3 = this.position.minus(orig);
        const tca: number = l.multiply(dir);
        const d2 = l.multiply(l) - tca*tca;
        const r2 = this.radius * this.radius;
        if (d2 > r2) return [false, 0];
        const thc: number = Math.sqrt(r2 - d2);
        var t0 = tca - thc;
        const t1 = tca + thc;
        if (t0 > 0.001) return [true, t0]
        if (t1 > 0.001) return [true, t1];
        return [false, 0];
    }
}