import { Point } from "../Point";

export class Shape {
    protected _points: Point[];
  
    constructor(points: Point[]) {
      this._points = points;
    }
  
    protected distance(p1: Point, p2: Point): number {
      let xs = p2.x - p1.x;
      let ys = p2.y - p1.y;
  
      xs = Math.pow(xs, 2)
      ys = Math.pow(ys, 2);
  
      return Math.sqrt(xs + ys);
    }
  }