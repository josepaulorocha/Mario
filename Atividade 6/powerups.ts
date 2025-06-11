export const TIPOS_DE_POWERUPS: string[] = ["Cogumelo", "Flor de fogo", "Estrela", "Pena"];

export class PowerUps {
    constructor() {
        this.tipo = "Desconhecido"
    }
    
    tipo: string

    gerarPowerUp(): string {
        const numero = Math.floor(Math.random() * TIPOS_DE_POWERUPS.length)
        this.tipo = TIPOS_DE_POWERUPS[numero]
        return this.tipo
    }
}