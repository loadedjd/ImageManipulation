import { Pixel } from "./Pixel";
import * as jpeg from "jpeg-js";
import * as fs from "fs";
import { Color } from "./Color";
import { Shape } from "./Shapes/Shape";
import { Point } from "./Point";
import { Square } from "./Shapes/Square";

export class Image implements IImage {
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
      this.rows.push(this.pixels.slice(i, count * this.width));
      count++;
    }
  }

  public turnOffEveryRedPixel() {
    this.pixels.forEach(pixel => (pixel.color.r = 0));
  }

  public turnOffEveryBluePixel() {
    this.pixels.forEach(pixel => (pixel.color.b = 0));
  }

  public turnUpPixels(degree: number = 0) {
    this.pixels.forEach(pixel => {
      pixel.color.b += degree;
      pixel.color.g += degree;
      pixel.color.r += degree;
    });
  }

  public compare(unModified: Image, maxDiff: number) {
    let tempPixels = new Array<Pixel>();
    for (var i = 0; i < this.pixels.length; i++) {
      let redDiff = 0
      let greenDiff = 0;
      let blueDiff = 0;

      if (unModified.pixels[i].color.r > this.pixels[i].color.r)
        redDiff = unModified.pixels[i].color.r - this.pixels[i].color.r;
      else
        redDiff = this.pixels[i].color.r - unModified.pixels[i].color.r;

      if (unModified.pixels[i].color.g > this.pixels[i].color.g)
        redDiff = unModified.pixels[i].color.g - this.pixels[i].color.g;
      else
        redDiff = this.pixels[i].color.g - unModified.pixels[i].color.g;

      if (unModified.pixels[i].color.b > this.pixels[i].color.b)
        redDiff = unModified.pixels[i].color.b - this.pixels[i].color.b;
      else
        redDiff = this.pixels[i].color.b - unModified.pixels[i].color.b;

      let avgDiff = (redDiff + greenDiff + blueDiff) / 3;

      if (Math.abs(avgDiff) >= maxDiff) {
        unModified.pixels[i].color.r = 255;
        unModified.pixels[i].color.b = 0;
        unModified.pixels[i].color.g = 0;
      }
    }
  }

  public save(file: string) {
    let array = new Array<Number>();

    this.pixels.forEach(pixel => {
      pixel.createUIntArray().forEach(int => {
        array.push(int);
      });
    });

    var nums = (array as any) as Uint8Array;
    var encodeObject = {
      data: nums,
      width: this.width,
      height: this.height
    };
    var finalImage = jpeg.encode(encodeObject);

    fs.writeFileSync(file, finalImage.data);
  }

  public blur(squares: number) {
    let rowsPerSquare = this.height / squares;
    let columnsPerSquare = this.width / squares;

    let x1 = 0;
    let x2 = (x1 + columnsPerSquare) - 1;
    let y = 0;

    for (var i = 0; i < this.width * this.height / squares; i++) {
      let pixels = this.getPixels(rowsPerSquare, x1, x2, y);
      let avgBlockColor = this.avgColors(pixels.map(p => p.color));
      pixels.forEach(p => p.color = avgBlockColor);

      if (x2 === this.width - 1) {
        x1 = 0;
        x2 = (x1 + columnsPerSquare) - 1;
        y += rowsPerSquare;
      } else {
        x1 += columnsPerSquare;
        x2 += columnsPerSquare;
      }
    }
  }

  public turnOffRow(row: number) {
    this.rows[row].forEach(p => p.color.turnOff());
  }

  public shiftLeft(degree: number) {
    for (var i = 0; i < this.pixels.length; i++) {
      if (this.doesPixelExist(i)) {
        if (degree > 0) {
          if (this.doesPixelExist(i + degree))
            this.pixels[i].color = this.pixels[i + degree].color;
        } else {
          if (this.doesPixelExist(i - degree))
            this.pixels[i].color = this.pixels[i - degree].color;
        }
      }
    }
  }

  public shiftUp(degree: number) {
    for (var i = 0; i < this.pixels.length; i++) {
      if (this.doesPixelExist(i)) {
        if (degree > 0) {
          if (this.doesPixelExist(i + degree * this.width))
            this.pixels[i].color = this.pixels[i + this.width * degree].color;
        } else {
          if (this.doesPixelExist(i - this.width * degree))
            this.pixels[i].color = this.pixels[i - this.width].color;
        }
      }
    }
  }

  public crop(square: Square, origin: Point) {
    var x = this.getPixels(square.height, square.topLeftCorner.x, square.topRightCorner.x, origin.y);
    this.pixels = x;
    console.log(x.length);
  }

  protected findSurroundingPixels(pixelIndex: number, radius: number = 1) {
    let surroundingIndexes = [
      pixelIndex - this.width, // Above
      pixelIndex,
      pixelIndex + this.width
    ];

    for (var i = 0; i <= radius; i++) {
      if (this.doesPixelExist(pixelIndex - this.width - i))
        surroundingIndexes.push(pixelIndex - this.width - i);

      if (this.doesPixelExist(pixelIndex - (this.width + i)))
        surroundingIndexes.push(pixelIndex - this.width + i);

      if (this.doesPixelExist(pixelIndex + (this.width - i)))
        surroundingIndexes.push(pixelIndex + (this.width - i)); // Above Left

      if (this.doesPixelExist(pixelIndex - (this.width + i)))
        surroundingIndexes.push(pixelIndex - (this.width + i));

      if (this.doesPixelExist(pixelIndex + i))
        surroundingIndexes.push(pixelIndex + i);

      if (this.doesPixelExist(pixelIndex - i))
        surroundingIndexes.push(pixelIndex - i);
    }

    return surroundingIndexes.filter(index => this.pixels[index] !== undefined).map(i => this.pixels[i]);
  }

  protected doesPixelExist(index: number): boolean {
    return this.pixels[index] !== undefined;
  }

  public flip(degree: number) {
    for (var x = 0; x < 1000; x++) {
      for (var y = 0; y < 1000; y++) {
        try {
          this.swapPixelAt(new Point(x, y), this.getPixel(new Point(y, x)));
        } catch {
        }
      }
    }
  }

  public replaceColorWith() {

  }

  protected swapPixelAt(point: Point, newPixel: Pixel) {
    let initialColor = this.rows[point.x][point.y].color;
    this.rows[point.y][point.x].color = newPixel.color;
    this.rows[point.x][point.y].color = initialColor;
  }

  protected getPixel(point: Point): Pixel {
    return this.rows[point.y][point.x];
  }

  private avgColors(colors: Color[]): Color {
    let averageColor = colors[0];
    colors
      .slice(1)
      .forEach(color => (averageColor = averageColor.averageColor(color)));
    return averageColor;
  }

  private getPixels(rows: number, x1: number, x2: number, y: number): Pixel[] {
    let pixels = new Array<Pixel>();
    this.rows.slice(y, y + rows + 2).forEach(row => {
      row.slice(x1, x2 + 1).forEach(pixel => {
        pixels.push(pixel);
      });
    });

    return pixels;
  }
}

interface IImage {
  save(file: string);
  blur(squares: number);
  shiftLeft(degree: number);
  shiftUp(degree: number);
  crop(square: Shape, origin: Point);
  flip(degree: number);

  pixels: Pixel[];
  rows: Array<Pixel[]>;
  width: number;
  height: number;
}