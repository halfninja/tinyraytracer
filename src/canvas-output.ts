import * as log from './logger.js';

function mapPixelComponent(f: number) {
    return Math.min(255, Math.round(f * 255));
}

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
            antialias: true,
        }) as CanvasRenderingContext2D;

        
        canvas.style.width = `${width/2}px`;

        this.data = this.ctx.createImageData(width, height, {  });
    }

    /**
     * @param x X coordinate of pixel
     * @param y Y coordinate of pixel
     * @param r Red component of pixel (0..1)
     * @param g Green component of pixel (0..1)
     * @param b Blue component of pixel (0..1) 
     */
    setPixel(x: number, y: number, r: number, g: number, b: number) {
        // pixel data is a single RGBA array
        const offset = (x + y*this.width) * 4;
        const d = this.data.data;
        d[offset+0] = mapPixelComponent(r);
        d[offset+1] = mapPixelComponent(g);
        d[offset+2] = mapPixelComponent(b);
        d[offset+3] = mapPixelComponent(1); // maximum alpha 💪
    }

    /**
     * Commit all pixels set by setPixel to the final image. The image may
     * not display until this is called.
     */
    endFrame() {
        this.ctx.putImageData(this.data, 0, 0);
    }
}