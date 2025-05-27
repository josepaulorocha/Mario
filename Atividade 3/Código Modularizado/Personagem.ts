export class Personagem {
    constructor(nome) {
        this.nome = nome
        this.vidas = VIDA_MAXIMA
    }

    nome : string
    vidas : number

    printPular() {
        console.log(`${this.nome} pulou!`)
    }
}

const VIDA_MAXIMA = 3
