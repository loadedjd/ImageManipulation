export class Color {
    public r: number;
    public g: number;
    public b: number;
    public a: number;

    constructor(r: number, g: number, b: number, a: number) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    public averageColor(color: Color): Color {
        let newRed = (this.r + color.r) / 2;
        let newGreen = (this.g + color.g) / 2;
        let newBlue = (this.b + color.b) / 2;

        return new Color(newRed, newGreen, newBlue, color.a)
    }

    public turnOff() {
        this.r = 0;
        this.g = 0; 
        this.b = 0;
    }
}