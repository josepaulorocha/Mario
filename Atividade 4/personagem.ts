import { TIPOS_DE_POWERUPS } from "./powerups";

const VIDA_MAXIMA = 3;

export class Personagem {
    constructor(nome: string) {
        this.nome = nome
        this.vidas = VIDA_MAXIMA
        this.inventario = []
    }

    nome: string
    vidas: number
    inventario: string[]

    printPular() {   
        console.log(`${this.nome} pulou!`);
    }

    coletarPowerUp(powerUp: string) { 
        this.inventario.push(powerUp)
        console.log(`${this.nome} coletou: ${powerUp}`)
    }

    desviar(): boolean {
        const chance = Math.random() // gera um número entre 0 e 1
        return chance <= 0.4 // 40% de chance de desviar
    }
}