import { PowerUp } from "./powerups.js";
import { Inimigo } from "./inimigo.js";
import { Bloco } from "./bloco.js";

// Interface para qualquer objeto que possa ter colisão
interface Collidable {
    x: number;
    y: number;
    width: number;
    height: number;
}

export abstract class Personagem {
    public x: number;
    public y: number;
    public width: number;
    public height: number;
    public speed: number = 0;
    public velY: number = 0;
    public gravity: number = 0.6;
    public jumpStrength: number = -14; // Ligeiramente ajustado para a nova escala
    public isJumping: boolean = true;
    private lives: number = 3;
    private invulnerable: boolean = false;
    public image: HTMLImageElement;

    constructor(x: number, y: number, width: number, height: number, imagePath: string) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.image = new Image();
        this.image.src = imagePath;
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        if (this.invulnerable && Math.floor(Date.now() / 100) % 2 === 0) {
            return;
        }
        if (this.image.complete && this.image.naturalHeight !== 0) {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
    }

    public update(platforms: Collidable[]): void {
        this.x += this.speed;

        this.y += this.velY;
        this.velY += this.gravity;
        
        let onPlatform = false;
        for (const platform of platforms) {
            if (this.isCollidingWith(platform)) {
                const playerPrevBottom = (this.y - this.velY) + this.height;

                if (this.velY >= 0 && playerPrevBottom <= platform.y) {
                    this.velY = 0;
                    this.y = platform.y - this.height;
                    this.isJumping = false;
                    onPlatform = true;
                }
                else if (this.velY < 0 && this.y > (platform.y + platform.height - 15)) {
                    this.velY = 1;
                    this.y = platform.y + platform.height;
                }
            }
        }
        
        if (!onPlatform) {
            this.isJumping = true;
        }

        if (this.x < 0) {
            this.x = 0;
        }

        if (this.y > 600) {
            this.takeDamage(true);
        }
    }

    public moveRight(): void { this.speed = 4; } // Velocidade ajustada
    public moveLeft(): void { this.speed = -4; }
    public jump(): void { if (!this.isJumping) { this.velY = this.jumpStrength; this.isJumping = true; } }
    public stop(): void { this.speed = 0; }
    
    public takeDamage(instant: boolean = false): void {
        if (!this.invulnerable) {
            this.lives--;
            if (this.lives < 0) this.lives = 0;

            if (instant) {
                this.x = this.x - 50 < 0 ? 100 : this.x - 50;
                this.y = 300;
                this.velY = 0;
            }

            this.invulnerable = true;
            setTimeout(() => { this.invulnerable = false; }, 1500);
        }
    }

    public getLives(): number { return this.lives; }
    public collectPowerUp(powerUp: PowerUp): string { return powerUp.applyEffect(this); }
    public isCollidingWith(other: Collidable): boolean {
        return (
            this.x < other.x + other.width &&
            this.x + this.width > other.x &&
            this.y < other.y + other.height &&
            this.y + this.height > other.y
        );
    }
}

// CORREÇÃO: Proporções dos personagens ajustadas
export class Mario extends Personagem {
    constructor(x: number, y: number) {
        super(x, y, 35, 50, 'imagens/mario.png');
    }
}
export class Luigi extends Personagem {
    constructor(x: number, y: number) {
        super(x, y, 32, 55, 'imagens/luigi.png');
    }
}
export class Peach extends Personagem {
    constructor(x: number, y: number) {
        super(x, y, 35, 50, 'imagens/peach.png');
    }
}