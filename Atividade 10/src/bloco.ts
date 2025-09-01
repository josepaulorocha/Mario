export class Bloco {
    public x: number;
    public y: number;
    public width: number = 40;
    public height: number = 40;
    private active: boolean = true;
    private activeImage: HTMLImageElement;
    private inactiveImage: HTMLImageElement;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.activeImage = new Image();
        this.activeImage.src = 'imagens/bloco.png';
        this.inactiveImage = new Image();
        this.inactiveImage.src = 'imagens/blocoVazio.png';
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        const image = this.active ? this.activeImage : this.inactiveImage;
        if (image.complete && image.naturalHeight !== 0) {
            ctx.drawImage(image, this.x, this.y, this.width, this.height);
        } else {
            // Placeholder em caso de falha no carregamento da imagem
            ctx.fillStyle = this.active ? 'yellow' : 'brown';
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    public hit(): void {
        if (this.active) {
            this.active = false;
        }
    }

    public isActive(): boolean {
        return this.active;
    }
}