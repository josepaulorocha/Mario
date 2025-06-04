import { TIPOS_DE_POWERUPS } from "./powerups";

const VIDA_MAXIMA = 3;

export class Personagem {
    constructor(nome: string) {
        this.nome = nome
        this.vidas = VIDA_MAXIMA
        this.inventario = []
        this.pontuacoesRodadas = []
    }

    nome: string
    vidas: number
    inventario: string[]
    pontuacoesRodadas : number[]

    printPular() {   
        console.log(`${this.nome} pulou!`);
    }

    coletarPowerUp(powerUp: string) { 
        this.inventario.push(powerUp)
        this.pontuacoesRodadas.push(800)
        console.log(`${this.nome} coletou: ${powerUp} e ganhou 800 pontos!`)
    }

    desviar(): boolean {
        const chance = Math.random() // gera um número entre 0 e 1
        return chance <= 0.4 // 40% de chance de desviar
    }

    atacarInimigo(): number {
        let pontos: number;
    
        if (!this.desviar()) {
            pontos = -100;
            console.log(`${this.nome} falhou ao desviar e foi atingido! Perdeu 100 pontos.`);
        } else {
            pontos = 400;
            console.log(`${this.nome} atacou o inimigo! Ganhou 400 pontos.`);
        }
    
        this.pontuacoesRodadas.push(pontos);
        return pontos;
    }
    
}

    
