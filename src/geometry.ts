import { Material } from './material.js';

export class Vec3f {
    x: number;
    y: number;
    z: number;
    
    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    plus(other: Vec3f): Vec3f {
        return new Vec3f(
            this.x + other.x,
            this.y + other.y,
            this.z + other.z,
        );
    }

    minus(other: Vec3f): Vec3f {
        return new Vec3f(
            this.x - other.x,
            this.y - other.y,
            this.z - other.z,
        );
    }

    multiply(other: Vec3f): number {
        return (
            this.x * other.x +
            this.y * other.y +
            this.z * other.z
        );
    }

    scale(factor: number): Vec3f {
        return new Vec3f(
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
}

export class Sphere {
    position: Vec3f;
    radius: number;
    material: Material;

    constructor(position: Vec3f, radius: number, material: Material) {
        this.position = position;
        this.radius = radius;
        this.material = material;
    }

    ray_intersect(orig: Vec3f, dir: Vec3f, t0in: number): [boolean, number] {
        const l: Vec3f = this.position.minus(orig);
        const tca: number = l.multiply(dir);
        const d2 = l.multiply(l) - tca*tca;
        const r2 = this.radius * this.radius;
        if (d2 > r2) return [false, t0in];
        const thc: number = Math.sqrt(r2 - d2);
        var t0 = tca - thc;
        const t1 = tca + thc;
        if (t0 < 0) t0 = t1;
        if (t0 < 0) return [false, t0];
        return [true, t0];
    }
}