import { Personagem } from "./personagem";
import { FilaDupla } from "./fila-dupla";

export class Inimigo {
    constructor(tipo: string) {
        this.tipo = tipo;
    }

    tipo: string;

    atacar(personagem: Personagem, log: FilaDupla<string>) {
        const desviou = personagem.desviar();

        if (desviou) {
            log.addBack(`${personagem.nome} desviou do ataque de ${this.tipo}!`);
            personagem.atacarInimigo(true); // Contra-ataca
        } else if (personagem.vidas > 0) {
            personagem.vidas -= 1;
            personagem.pontuacoesRodadas.push(-100);
            log.addBack(`<- ${this.tipo} atacou ${personagem.nome}.`);
            log.addBack(`${personagem.nome} agora tem ${personagem.vidas} vidas.`);
            log.addBack(`${personagem.nome} perdeu 100 pontos.`);
        }
    }
}