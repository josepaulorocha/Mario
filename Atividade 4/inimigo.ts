import { Personagem } from "./personagem";

export class Inimigo {   
    constructor(tipo: string) {
        this.tipo = tipo
    }

    tipo: string
    
    atacar(personagem: Personagem) {
        if (personagem.desviar()) {
            console.log(`${personagem.nome} desviou do ataque de ${this.tipo}!`)
        } else if (personagem.vidas > 0) {
            personagem.vidas -= 1
            console.log(`${this.tipo} atacou ${personagem.nome}`)
            console.log(`${personagem.nome} agora tem ${personagem.vidas} vidas`)
        }
    }
}
