class Personagem {
    constructor(nome) {
        this.nome = nome
        this.vidas = VIDA_MAXIMA
    }

    nome : string
    vidas : number

    printPular() {   
        console.log(`${this.nome} pulou!`);
    }
}

class Inimigo {   
    constructor(tipo) {
        this.tipo = tipo
    }

    tipo: string;

    atacar(personagem: Personagem) {
        if(personagem.vidas >= 0) {
            personagem.vidas -= 1
            console.log(`${this.tipo} atacou ${personagem.nome}`)
            console.log(`${personagem.nome} agora tem ${personagem.vidas} vidas`)
        }
    }
}

class PowerUps {
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

const VIDA_MAXIMA = 3

const MARIO = new Personagem("Mario");
const BOWSER = new Inimigo("Bowser")
const POWERUP = new PowerUps()

MARIO.printPular()
BOWSER.atacar(MARIO)
