import * as log from './logger.js';

export default class CanvasOutput {
    width: number;
    height: number;
    ctx: CanvasRenderingContext2D;
    data: ImageData;

    constructor(container: HTMLElement, width: number, height: number) {
        this.width = width;
        this.height = height;
        log.log('Output to HTML');
        const canvas = document.createElement('canvas');
        container.appendChild(canvas);
        canvas.setAttribute("width", width.toString());
        canvas.setAttribute("height", height.toString());
        this.ctx = canvas.getContext('2d', {
            alpha: false,
            antialias: false,
        }) as CanvasRenderingContext2D;

        this.data = this.ctx.createImageData(width, height, {  });
    }

    setPixel(x, y, r, g, b) {
        // pixel data is a single RGBA array
        const offset = (x + y*this.width) * 4;
        const d = this.data.data;
        d[offset+0] = r;
        d[offset+1] = g;
        d[offset+2] = b;
        d[offset+3] = 255; // maximum alpha 💪
    }

    endFrame() {
        this.ctx.putImageData(this.data, 0, 0);
    }
}