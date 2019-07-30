import { Pixel } from "./Pixel";
import * as jpeg from "jpeg-js";
import * as fs from "fs";
import { Color } from "./Color";

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
        x2 = ( x1 + columnsPerSquare ) - 1;
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

  private fillInColor(
    x1: number,
    x2: number,
    x3: number,
    x4: number,
    color: Color,
    width
  ) {
    while (x1 <= x3) {
      for (var i = x1; i <= x2; i++) {
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
  public bottomLeftCorner: Point;
  public bottomRightCorner: Point;
  public image: Image;

  constructor(private _width: number, private _height: number, image: Image) {
    this.topLeftCorner = new Point(0, 0);
    this.topRightCorner = new Point(this.topLeftCorner.x + _width, 0);

    this.bottomLeftCorner = new Point(0, _height);
    this.bottomRightCorner = new Point(
      this.bottomLeftCorner.x + _width,
      _height
    );

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
