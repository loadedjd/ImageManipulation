import { Pixel } from './Pixel';
import * as jpeg from 'jpeg-js';
import * as fs from 'fs';
import { Color } from './Color';

export class Image {
    public pixels: Pixel[];
    public rows: Array<Pixel[]>;
    public width: number;
    public height: number;

    constructor(imageData: Uint8Array, width: number, height: number) {
        this.pixels = new Array<Pixel>();
        this.height = height;
        this.width = width;
        this.rows = new Array<Pixel[]>();

        let count = 0;

        while (count <= imageData.length - 1) {
            this.pixels.push(new Pixel(imageData.slice(count, count + 4)));
            count += 4;
        }

        count = 1;

        for (var i = 0; i < this.pixels.length - 1; i += this.width) {
            this.rows.push(this.pixels.slice(i, (count * this.width)));
            count++;
        }

        this.rows.forEach(r => console.log(r.length));
    }

    public turnOffEveryRedPixel() {
        this.pixels.forEach(pixel => pixel.color.r = 0);
    }

    public turnOffEveryBluePixel() {
        this.pixels.forEach(pixel => pixel.color.b = 0);
    }

    public turnUpPixels(degree: number = 0) {
        this.pixels.forEach(pixel => {
            pixel.color.b += degree;
            pixel.color.g += degree;
            pixel.color.r += degree;
        });
    }

    public save(file: string) {
        let array = new Array<Number>();

        this.pixels.forEach(pixel => {
            pixel.createUIntArray().forEach(int => {
                array.push(int);
            });
        });


        var nums = array as unknown as Uint8Array
        var encodeObject = {
            data: nums,
            width: this.width,
            height: this.height
        };
        var finalImage = jpeg.encode(encodeObject)

        fs.writeFileSync(file, finalImage.data);
    }

    public blur(squares: number) {
        for (var square = 0; square <= square; square++) {
            let squareWidth = this.width / squares;

            let origin = new Point(square * squareWidth, (squareWidth * square) / this.width);
            let point2 = new Point(origin.x + squareWidth, origin.y);
            let point3 = new Point(origin.x, point2.y + squareWidth);
            let point4 = new Point(point3.x + squareWidth, point3.y);

            let squaredPixels = this.getPixels(origin, point2, point3, point4);
            let avgBlockColor = squaredPixels.map(pixel => pixel.color).reduce((accum, curr) => accum.averageColor(curr))
            squaredPixels.forEach(pixel => pixel.color = avgBlockColor);

        }
    }

    

    public turnOffRow(row: number) {
        this.rows[row].forEach(p => p.color.turnOff());
    }

    private avgColors(colors: Color[]): Color {
        let averageColor = colors[0];
        colors.slice(1).forEach(color => averageColor = averageColor.averageColor(color));
        return averageColor;
    }

    private getPixels(origin: Point, point2: Point, point3: Point, point4: Point): Pixel[] {
        let pixs = new Array<Pixel>();
        let rows = this.rows.slice(origin.y, point4.y);
        rows.forEach(row => {
            for (var i = origin.x; i < point2.x; i++) {
                pixs.push(row[i]);
            }
        });

        return pixs;
    }

    private fillInColor(x1: number, x2: number, x3: number, x4: number, color: Color, width) {
        while (x1 <= x3) {
            for ( var i = x1; i <= x2; i++ ) {
                this.pixels[i].color = color;
            }

            x1 += width;
            x2 += width;
        }
    }
}


class Lens {

    public topLeftCorner: Point;
    public topRightCorner: Point;
    public bottomLeftCorner: Point
    public bottomRightCorner: Point;
    public image: Image;

    constructor(private _width: number, private _height: number, image: Image) {
        this.topLeftCorner = new Point(0, 0);
        this.topRightCorner = new Point(this.topLeftCorner.x + _width, 0);

        this.bottomLeftCorner = new Point(0, _height);
        this.bottomRightCorner = new Point(this.bottomLeftCorner.x + _width, _height);

        this.image = image;
    }
}

class Point {
    public x: number;
    public y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public moveRight(distance: number) {
        this.x += distance;
    }

    public moveDown(distance: number) {
        this.y += distance;
    }

    public moveBackToZeroX() {
        this.x = 0;
    }
}