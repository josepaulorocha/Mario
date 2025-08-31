import { Personagem } from "./personagem";
import { FilaDupla } from "./fila-dupla";
import { Pilha } from "./pilha";

export class Inimigo {
    tipo: string;
    public x: number;
    public y: number;
    public width: number;
    public height: number;
    public speed: number;

    constructor(tipo: string) {
        this.tipo = tipo;
        this.x = 850;
        this.y = 470; 
        this.width = 40;
        this.height = 50;
        this.speed = Math.random() * 2 + 1;
    }

    atacar(personagem: Personagem, log: FilaDupla<string>, historico: Pilha<string>) {
        const desviou = personagem.desviar();

        if (desviou) {
            log.addBack(`${personagem.nome} desviou do ataque de ${this.tipo}!`);
            personagem.atacarInimigo(true);
        } else if (personagem.vidas > 0) {
            personagem.vidas -= 1;
            personagem.pontuacoesRodadas.push(-100);
            log.addBack(`<- ${this.tipo} atacou ${personagem.nome}.`);
            log.addBack(`${personagem.nome} agora tem ${personagem.vidas} vidas.`);
            historico.push(`${personagem.nome} perdeu 1 vida contra ${this.tipo}.`);
        }
    }

    move() {
        this.x -= this.speed;
    }
}