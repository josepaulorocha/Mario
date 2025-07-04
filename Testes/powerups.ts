export const TIPOS_DE_POWERUPS: string[] = ["Cogumelo", "Flor de fogo", "Estrela", "Pena"];

export class PowerUps {
    constructor() {
        this.tipo = "Desconhecido"
    }
    
    tipo: string

    gerarPowerUp(itensDisponiveis: string[]): string {
        // Se a lista da região estiver vazia, usa a lista global como fallback.
        const listaDeSorteio = itensDisponiveis.length > 0 ? itensDisponiveis : TIPOS_DE_POWERUPS;
        
        const numero = Math.floor(Math.random() * listaDeSorteio.length);
        this.tipo = listaDeSorteio[numero];
        return this.tipo;
    }
}