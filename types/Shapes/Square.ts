import { Shape } from "./Shape";
import { Point } from "../Point";

export class Square extends Shape {
    set points(value: Point[]) {
      if (this.distance(value[0], value[1]) === this.distance(value[2], value[3]) && this.distance(value[0], value[2]) === this.distance(value[1], value[3]))
        this._points = value
    }
  
    get points(): Point[] {
      return this._points.concat([]);
    }
  
    get topLeftCorner(): Point {
      return this._points[0];
    }
  
    set topLeftCorner(value: Point) {
      this._points[0] = value;
    }
  
    get topRightCorner(): Point {
      return this._points[1];
    }
  
    set topRightCorner(value: Point) {
      this._points[1] = value;
    }
  
    get bottomLeftCorner(): Point {
      return this._points[2];
    }
  
    set bottomLeftCorner(value: Point) {
      this._points[2] = value;
    }
  
    get bottomRightCorner(): Point {
      return this._points[3];
    }
  
    set bottomRightCorner(value: Point) {
      this._points[3] = value;
    }
  
    get height(): number {
      return this.distance(this._points[0], this.points[2]);
    }
  }