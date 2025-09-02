// Atividade 10/inimigo.ts (CORRIGIDO)
import { Personagem } from "./personagem.js";
import { FilaDupla } from "./fila-dupla.js";
import { Pilha } from "./pilha.js";

export class Inimigo {
    constructor(tipo: string) {
        this.tipo = tipo;
    }

    tipo: string;

    atacar(personagem: Personagem, log: FilaDupla<string>, historico: Pilha<string>) {
        // A colisão com o inimigo sempre causa dano, a menos que seja na cabeça.
        // A lógica de desvio foi removida daqui para simplificar e corrigir o bug de pontos.
        // A verificação de "pular na cabeça" já é feita em web-main.ts.

        if (personagem.vidas > 0) {
            // Usa o método já existente em Personagem para centralizar a lógica de perder vida
            personagem.perderVida(); 
            
            // Adiciona logs específicos do ataque
            log.addBack(`<- ${this.tipo} atacou ${personagem.nome}.`);
            log.addBack(`${personagem.nome} agora tem ${personagem.vidas} vidas.`);
            
            // Registra o evento no histórico de ações
            historico.push(`${personagem.nome} perdeu 1 vida contra ${this.tipo}.`);
        }
    }
}