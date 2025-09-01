export abstract class Inimigo {
    public x: number;
    public y: number;
    public width: number;
    public height: number;
    public isDefeated: boolean = false;
    protected speed: number;
    protected image: HTMLImageElement;

    constructor(x: number, y: number, width: number, height: number, speed: number, imagePath: string) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.image = new Image();
        this.image.src = imagePath;
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        if (this.image.complete && this.image.naturalHeight !== 0) {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        } else {
            ctx.fillStyle = 'red';
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    public update(): void {
        this.x -= this.speed;
    }
}

// CORREÇÃO: Proporções dos inimigos ajustadas
export class KoopaTroopa extends Inimigo {
    constructor(x: number, y: number) {
        super(x, y, 38, 45, 1.5, 'imagens/koopa.png');
    }
}

export class Bowser extends Inimigo {
    constructor(x: number, y: number) {
        super(x, y, 60, 60, 0.8, 'imagens/bowser.png');
    }
}