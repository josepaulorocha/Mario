import { Personagem } from "./Personagem";

export class Inimigo {   
    constructor(tipo) {
        this.tipo = tipo
    }

    tipo : string

    atacar(personagem: Personagem) {
        if(personagem.vidas >= 0) {
            personagem.vidas -= 1
            console.log(`${this.tipo} atacou ${personagem.nome}`)
            console.log(`${personagem.nome} agora tem ${personagem.vidas} vidas`)
        }
    }
}