import * as jpeg from 'jpeg-js';
import { Image } from './types/Image';
import { Image2 } from './types/Image2';
import { Square } from './types/Shapes/Square';
import { Point } from './types/Point';
const fs = require('fs');



const jpegData = fs.readFileSync('./assets/2.jpg');
const rawImageData = jpeg.decode(jpegData, true);

const jpegDataOriginal = fs.readFileSync('./assets/od.jpeg');
const rawImageDataOriginal = jpeg.decode(jpegDataOriginal, true);


let modfiedImage = new Image2(rawImageData.data, rawImageData.width, rawImageData.height);
let originalImage = new Image2(rawImageDataOriginal.data, rawImageDataOriginal.width, rawImageDataOriginal.height);

let square = new Square([new Point(0,0), new Point(300, 0), new Point(0, 300), new Point(300, 300)])
//modfiedImage.turnUpPixels(100);
modfiedImage.compare(originalImage, 50);
modfiedImage.save("./assets/2.jpg");
originalImage.save('./assets/3.jpg');


