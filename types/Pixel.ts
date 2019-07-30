import {Color} from './Color';

export class Pixel {
    public color: Color;

    public constructor(imageData: Uint8Array) {
        this.color = new Color(imageData[0], imageData[1], imageData[2], imageData[3]);
    }

    public createUIntArray(): Uint8Array {
        let array = [this.color.r, this.color.g, this.color.b, this.color.a];
        let uArray = new Uint8Array(array);

        return uArray;
    }
}