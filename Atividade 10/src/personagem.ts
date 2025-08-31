import { Pilha } from "./pilha";
import { FilaDupla } from "./fila-dupla";

const VIDA_MAXIMA = 3;

export class Personagem {
    nome: string;
    vidas: number;
    isDerrotado: boolean;
    inventario: Pilha<string>;
    pontuacoesRodadas: number[];
    log: FilaDupla<string>;
    historico: Pilha<string>;

    public x: number;
    public y: number;
    public width: number;
    public height: number;
    public image: HTMLImageElement;

    // AQUI ESTÁ A CORREÇÃO: O CONSTRUTOR AGORA ACEITA 4 ARGUMENTOS
    constructor(nome: string, log: FilaDupla<string>, historico: Pilha<string>, loadedImage: HTMLImageElement) {
        this.nome = nome;
        this.vidas = VIDA_MAXIMA;
        this.isDerrotado = false;
        this.inventario = new Pilha<string>();
        this.pontuacoesRodadas = [];
        this.log = log;
        this.historico = historico;

        this.x = 100;
        this.y = 450;
        this.width = 50;
        this.height = 70;
        this.image = loadedImage; // Usamos a imagem que foi passada
    }

    calcularPontuacaoTotal(): number {
        if (this.pontuacoesRodadas.length === 0) {
            return 0;
        }
        return this.pontuacoesRodadas.reduce((total, score) => total + score, 0);
    }

    coletarPowerUp(powerUp: string) {
        this.inventario.push(powerUp);
        this.pontuacoesRodadas.push(800);
        this.log.addBack(`-> ${this.nome} coletou: ${powerUp} e ganhou 800 pontos!`);
        this.historico.push(`${this.nome} coletou ${powerUp}`);
    }

    consumirItem(item: string): boolean {
        const sucesso = this.inventario.removerItem(item);
        if (sucesso) {
            this.log.addBack(`${this.nome} consumiu ${item} do inventário.`);
            this.historico.push(`${this.nome} consumiu ${item}.`);
        }
        return sucesso;
    }

    desviar(): boolean {
        const chance = Math.random();
        return chance <= 0.4;
    }

    atacarInimigo(desviou: boolean): number {
        let pontos = 400;
        this.log.addBack(`-> ${this.nome} contra-atacou o inimigo! Ganhou 400 pontos.`);
        this.historico.push(`${this.nome} atacou um inimigo.`);
        this.pontuacoesRodadas.push(pontos);
        return pontos;
    }
}