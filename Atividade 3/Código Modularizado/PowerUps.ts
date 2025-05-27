export class PowerUps {
    constructor() {
        this.tipo = "Desconhecido"
    }
    
    tipo : string

    gerarPowerUp() {
        const numero = Math.floor(Math.random() * 3) // 0, 1 ou 2
        
        if(numero === 0) {
            this.tipo = "Cogumelo"

        } else if(numero === 1) {
            this.tipo = "Flor de fogo"

        } else {
            this.tipo = "Estrela"
        }
        
        console.log(`$você ganhou um Power Up: ${this.tipo}`)
    }
}