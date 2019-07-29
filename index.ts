import * as jpeg from 'jpeg-js';
const fs = require('fs');

class Image {
    public pixels: Pixel[];

    constructor(imageData: Uint8Array) {
        this.pixels = new Array<Pixel>();

        let count = 0;

        while (count <= imageData.length - 1) {
            this.pixels.push(new Pixel(imageData.slice(count, count + 4)));
            count += 4;
        }
    }

    public turnOffEveryRedPixel() {
        this.pixels.forEach(pixel => pixel.r = 0);
    }

    public writeToDisk(file: string) {
        let array = new Array<Number>();

        this.pixels.forEach(pixel => {
            pixel.createUIntArray().forEach(int => {
                array.push(int);
            });
        });

        var nums = Uint8Array.of();


        fs.writeFileSync(file, );
    }
}

const jpegData = fs.readFileSync('./assets/1.jpg');
const rawImageData = jpeg.decode(jpegData, true);

console.log(rawImageData.data.length);

let avg = rawImageData.data.reduce((accum, curr) => accum + curr) / rawImageData.data .length;
let newImage = rawImageData.data.map(value => avg);


let image = new Image(rawImageData.data);

class Pixel {
    public r: number;
    public g: number;
    public b: number;
    public a: number;

    constructor(imageData: Uint8Array) {
        this.r = imageData[0];
        this.g = imageData[1];
        this.b = imageData[2];
        this.a = imageData[3];
    }

    public createUIntArray(): Uint8Array {
        let array = [this.r, this.g, this.b, this.a];
        let uArray = new Uint8Array(array);

        return uArray;
    }
}

image.turnOffEveryRedPixel();