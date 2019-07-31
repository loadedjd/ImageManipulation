import { Image } from './Image';
export class Image2 extends Image {
  public blur(squares: number) {
    for (var i = 0; i < this.pixels.length; i++) {
      let surroundingPixels = this.findSurroundingPixels(i, squares);
      let avgColor = surroundingPixels.map(pixel => pixel.color).reduce((accum, curr) => accum.averageColor(curr));
      this.pixels[i].color = avgColor;
    }
  }
}