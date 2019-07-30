import * as jpeg from 'jpeg-js';
import { Image } from './types/Image';
const fs = require('fs');



const jpegData = fs.readFileSync('./assets/1.jpg');
const rawImageData = jpeg.decode(jpegData, true);

let avg = rawImageData.data.reduce((accum, curr) => accum + curr) / rawImageData.data .length;
let newImage = rawImageData.data.map(value => avg);


let image = new Image(rawImageData.data, rawImageData.width, rawImageData.height);
image.blur(25);
image.turnUpPixels(0);

image.save("./assets/2.jpg");