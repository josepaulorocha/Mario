// Atividade 10/personagem.ts (CORRIGIDO)
import { Pilha } from "./pilha.js"
import { FilaDupla } from "./fila-dupla.js"

const VIDA_MAXIMA = 3

export class Personagem {
    constructor(nome: string, log: FilaDupla<string>, historico: Pilha<string>) {
        this.nome = nome
        this.vidas = VIDA_MAXIMA
        this.isDerrotado = false; // Personagem começa ativo.
        this.inventario = new Pilha<string>()
        this.pontuacoesRodadas = []
        this.log = log;
        this.historico = historico
    }

    nome: string;
    vidas: number;
    isDerrotado: boolean;
    inventario: Pilha<string>
    pontuacoesRodadas: number[];
    log: FilaDupla<string>;
    historico: Pilha<string>;

    perderVida(): void {
        if (this.vidas > 0) {
            this.vidas -= 1;
            this.pontuacoesRodadas.push(-100); // Penalidade por perder vida
            // CORREÇÃO: Usando addBack para manter a ordem cronológica
            this.log.addBack(`[DANO]: ${this.nome} perdeu uma vida! Vidas restantes: ${this.vidas}`);
            this.historico.push(`${this.nome} perdeu uma vida.`);
        }
        if (this.vidas <= 0) {
            this.isDerrotado = true;
        }
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