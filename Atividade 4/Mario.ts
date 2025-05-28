const VIDA_MAXIMA = 3

// Array dos tipos de Power Up do jogo
const TIPOS_DE_POWERUPS: string[] = ["Cogumelo", "Flor de fogo", "Estrela", "Pena"];

class Personagem {
    constructor(nome) {
        this.nome = nome
        this.vidas = VIDA_MAXIMA
        this.inventario = []
    }

    nome : string
    vidas : number
    inventario : string[] // Array para armazenar PowerUps no inventario do personagem

    printPular() {   
        console.log(`${this.nome} pulou!`);
    }

    coletarPowerUp(powerUp) { 
        this.inventario.push(powerUp)
        console.log(`${this.nome} coletou: ${powerUp}`)
    }
}

class Inimigo {   
    constructor(tipo) {
        this.tipo = tipo
    }

    tipo: string
    
    atacar(personagem: Personagem) {
        if(personagem.vidas > 0) {
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
        const numero = Math.floor(Math.random() * TIPOS_DE_POWERUPS.length) // Gera um numero aleátorio dentro do tamanho do array de power ups        
        this.tipo = TIPOS_DE_POWERUPS[numero]
        console.log(`Um(a) ${this.tipo} apareceu para você`)
        return this.tipo
    }
}

// Array de inimigos no jogo
const inimigos: Inimigo[] = [
    new Inimigo("Goomba"),
    new Inimigo("Koopa Troopa"),
    new Inimigo("Bowser")
]

// Array de personagens no jogo
const personagens: Personagem[] = [
    new Personagem("Mario"),
    new Personagem("Luigi")
]

const randomArrayInt = Array.from({ length: 10 }, () => Math.floor(Math.random() * 100) + 1);

const powerUp = new PowerUps()
const powerUpGerado = powerUp.gerarPowerUp()

personagens[0].printPular()
personagens[0].coletarPowerUp(powerUpGerado)
inimigos[2].atacar(personagens[0])

