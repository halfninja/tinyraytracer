import * as log from './logger.js';
import { Vec3f, Sphere } from './geometry.js';
import CanvasOutput from './canvas-output.js';
import { RgbPix, Material } from './material.js';
import * as materials from './material-library.js';

log.success("Hello!!");

const width = 640;
const height = 480;
const FOV = 1.05 // 60 degrees in radians
const TANFOV2 = 2 * Math.tan(FOV/2.0);

const spheres = [
    new Sphere(new Vec3f(-3,    0,   -16), 2, materials.IVORY),
    new Sphere(new Vec3f(-1.0, -1.5, -12), 2, materials.RED),
    new Sphere(new Vec3f( 1.5, -0.5, -18), 3, materials.RED),
    new Sphere(new Vec3f( 7,    5,   -18), 4, materials.IVORY),
]

type IntersectResult = null | {
    hit: Vec3f;
    N: Vec3f;
    material: Material;
}

function scene_intersect(orig: Vec3f, dir: Vec3f, spheres: Sphere[]): IntersectResult {
    var spheresDist = Number.MAX_SAFE_INTEGER;
    var result: IntersectResult = null;
    spheres.forEach((sphere) => {
        const [hit, dist] = sphere.ray_intersect(orig, dir, 0);
        if (hit && dist < spheresDist) {
            spheresDist = dist;
            const hit = (orig.plus(dir.scale(dist)))
            result = {
                hit,
                N: hit.minus(sphere.position).normalized(),
                material: sphere.material,
            }
        }
    });
    if (spheresDist < 1000) {
        return result;
    } else {
        return null;
    }
}

function cast_ray(orig: Vec3f, dir: Vec3f, depth: number = 0): RgbPix {
    const result = scene_intersect(orig, dir, spheres);
    if (result) {
        return result.material.diffuse;
    } else {
        return [50,50,50];
    }
}

// Vague attempt to separate the drawing code from how it's output,
// so we could switch to writing to file, dot matrix printer or whatever
const output = new CanvasOutput(document.getElementById('app-root'), width, height);
for (var x=0; x<width; x++) {
    for (var y=0; y<height; y++) {
        const dir_x = (2 * (x+0.5) / width - 1) * TANFOV2 * width / height;
        const dir_y = -(2 * (y+0.5) / height - 1) * TANFOV2;
        const dir_z = -1;

        const color = cast_ray(new Vec3f(0,0,0), new Vec3f(dir_x, dir_y, dir_z).normalized());
        output.setPixel(x, y, ...color);
    }
}
output.endFrame();