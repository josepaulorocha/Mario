import { Pilha } from "./pilha"
import { FilaDupla } from "./fila-dupla"

const VIDA_MAXIMA = 3

export class Personagem {
    constructor(nome: string, log: FilaDupla<string>, historico: Pilha<string>) {
        this.nome = nome
        this.vidas = VIDA_MAXIMA
        this.inventario = new Pilha<string>() // Inventário agora é uma Pilha
        this.pontuacoesRodadas = []
        this.log = log; // Referência para a fila de logs
        this.historico = historico // Referência para a pilha de histórico
    }

    nome: string;
    vidas: number;
    inventario: Pilha<string>
    pontuacoesRodadas: number[];
    log: FilaDupla<string>;
    historico: Pilha<string>;

    printPular() {
        this.log.addBack(`${this.nome} pulou!`);
    }

    coletarPowerUp(powerUp: string) {
        this.inventario.push(powerUp); 
        this.pontuacoesRodadas.push(800);
        this.log.addBack(`-> ${this.nome} coletou: ${powerUp} e ganhou 800 pontos!`);
        this.historico.push(`${this.nome} coletou ${powerUp}`);
    }

    // Método para usar o último power-up coletado
    usarPowerUp(): string | undefined {
        const powerUpUsado = this.inventario.pop();
        if (powerUpUsado) {
            this.log.addBack(`${this.nome} usou ${powerUpUsado}!`);
            this.historico.push(`${this.nome} usou ${powerUpUsado}`);
        } else {
            this.log.addBack(`${this.nome} não tem power-ups para usar.`);
        }
        return powerUpUsado;
    }

    desviar(): boolean {
        const chance = Math.random();
        return chance <= 0.4;
    }

    atacarInimigo(desviou: boolean): number {
        let pontos: number;

        if (!desviou) {
            pontos = -100;
            this.log.addBack(`<- ${this.nome} falhou ao desviar e foi atingido! Perdeu 100 pontos.`);
        } else {
            pontos = 400;
            this.log.addBack(`-> ${this.nome} atacou o inimigo! Ganhou 400 pontos.`);
            this.historico.push(`${this.nome} atacou um inimigo.`);
        }

        this.pontuacoesRodadas.push(pontos);
        return pontos;
    }
}