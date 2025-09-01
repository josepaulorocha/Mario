import { Personagem } from "./personagem.js";

export abstract class PowerUp {
    public x: number;
    public y: number;
    public width: number = 32;
    public height: number = 32;
    // Removida a propriedade 'image' e a lógica de carregamento de imagem específica

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        // Desenha um placeholder visual para o power-up
        ctx.fillStyle = 'gold';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = 'black';
        ctx.font = '20px SuperMario'; // Pode ser necessário carregar a fonte aqui se não estiver globalmente
        ctx.fillText("?", this.x + this.width / 4, this.y + this.height - this.height / 4);
    }
    
    abstract applyEffect(personagem: Personagem): string;
}

export class Estrela extends PowerUp {
    constructor(x: number, y: number) {
        super(x, y); // Não passa mais caminho de imagem
    }
    applyEffect(personagem: Personagem): string {
        console.log("Estrela aplicada!");
        // Lógica de invencibilidade pode ser adicionada aqui
        return "Estrela";
    }
}

export class Cogumelo extends PowerUp {
    constructor(x: number, y: number) {
        super(x, y); // Não passa mais caminho de imagem
    }
    applyEffect(personagem: Personagem): string {
        console.log("Cogumelo aplicado!");
        // Lógica de crescimento pode ser adicionada aqui
        return "Cogumelo";
    }
}

export class Pena extends PowerUp {
    constructor(x: number, y: number) {
        super(x, y); // Não passa mais caminho de imagem
    }
    applyEffect(personagem: Personagem): string {
        console.log("Pena aplicada!");
        // Lógica de voo pode ser adicionada aqui
        return "Pena";
    }
}