import * as log from './logger.js';
import { Vec3, Sphere } from './geometry.js';
import { Light } from './lighting.js';
import CanvasOutput from './canvas-output.js';
import { RgbPix, Material } from './material.js';
import * as materials from './material-library.js';

/*
 tinyraytracer

 heavily cribbed off
 https://raw.githubusercontent.com/ssloy/tinyraytracer/master/tinyraytracer.cpp
*/

log.success("Loading");

const width = 1024;
const height = 768;
const FOV = 0.6 // in radians
const TANFOV2 = 2 * Math.tan(FOV/2.0);
const SHADOWS = true;
const MAX_DEPTH = 4;

const spheres: Sphere[] = [
    new Sphere(new Vec3(-3,    0,   -16), 2, materials.IVORY),
    new Sphere(new Vec3(-1.0, -1.5, -12), 2, materials.RED),
    new Sphere(new Vec3( 1.5, -0.5, -18), 3, materials.RED),
    new Sphere(new Vec3( 7,    5,   -18), 4, materials.MIRROR),
];

const lights: Light[] = [
    new Light(new Vec3(-20, 20, 20), 1.5),
    new Light(new Vec3(30, 50, -25), 0.5),
    new Light(new Vec3(3, 20, 30), 0.5),
];

type IntersectResult = null | {
    hit: Vec3;
    N: Vec3;
    material: Material;
}

function reflect(I: Vec3, N: Vec3): Vec3 {
    return I.minus(N.scale(2 * I.multiply(N)));
}

function scene_intersect(orig: Vec3, dir: Vec3, spheres: Sphere[]): IntersectResult {
    var spheresDist = Number.MAX_SAFE_INTEGER;
    var result: IntersectResult = null;
    // check every sphere but only keep the closest hit.
    for (const sphere of spheres) {
        const [hit, dist] = sphere.ray_intersect(orig, dir);
        if (hit && dist < spheresDist) {
            spheresDist = dist;
            const hit = (orig.plus(dir.scale(dist)))
            result = {
                hit,
                N: hit.minus(sphere.position).normalized(),
                material: sphere.material,
            }
        }
    };
    if (spheresDist < 1000) {
        return result;
    } else {
        return null;
    }
}

function cast_ray(orig: Vec3, dir: Vec3, depth: number = 0): RgbPix {
    const result = scene_intersect(orig, dir, spheres);
    if (depth <= MAX_DEPTH && result) {
        const { material: m, N, hit } = result;
        const { diffuse, albedo, specularExponent } = m;
        const reflectDir = reflect(dir, N).normalized();
        const reflectColor = cast_ray(hit, reflectDir, depth + 1);
        var diffuseLightIntensity = 0;
        var specularLightIntensity = 0;
        for (const light of lights) {
            const lightDir = light.position.minus(result.hit).normalized();
            if (SHADOWS) {
                const lightIntersect = scene_intersect(hit, lightDir, spheres);
                if (lightIntersect && lightIntersect.hit.minus(hit).norm() < light.position.minus(hit).norm()) {
                    continue; // light is blocked by something - shadow
                }
            }
            diffuseLightIntensity += light.intensity * Math.max(0, lightDir.multiply(result.N));
            specularLightIntensity += Math.pow(Math.max(0, reflect(lightDir, result.N).multiply(dir)), specularExponent);
        }
        const diffuseVec = diffuse.scale(diffuseLightIntensity * albedo[0]);
        const specVec = new Vec3(1,1,1).scale(specularLightIntensity * albedo[1])
        return diffuseVec.plus(specVec).plus(reflectColor.scale(albedo[2]));
    } else {
        // background: garish checkerboard
        if (
            ((Math.abs(Math.atan2(dir.x, dir.z) * 10))  % 2 > 1)
            === (Math.abs(Math.atan2(dir.y, dir.z) * 10) % 2 > 1)
        ) {
            return new Vec3(1.0, 0.75, 0.9);
        } else {
            return new Vec3(0.6, 0.75, 0.9);
        }
    }
}

// Vague attempt to separate the drawing code from how it's output,
// so we could switch to writing to file, dot matrix printer or whatever
const start = window.performance.now();
const output = new CanvasOutput(document.getElementById('app-root'), width, height);
for (var x=0; x<width; x++) {
    for (var y=0; y<height; y++) {
        const dir_x = (2 * (x+0.5) / width - 1) * TANFOV2 * width / height;
        const dir_y = -(2 * (y+0.5) / height - 1) * TANFOV2;
        const dir_z = -1;

        const color = cast_ray(new Vec3(0,0,0), new Vec3(dir_x, dir_y, dir_z).normalized());
        output.setPixel(x, y, ...color.toTuple());
    }
}
output.endFrame();
const timeMillis = window.performance.now() - start;
log.success(`Render took ${timeMillis}ms`);