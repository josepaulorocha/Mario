import { Pilha } from "./pilha";

export class UI {
    private currentPlayerEl: HTMLElement;
    private livesEl: HTMLElement;
    private scoreEl: HTMLElement;
    private inventoryListEl: HTMLElement;
    private logMessagesEl: HTMLElement;

    constructor() {
        this.currentPlayerEl = document.getElementById('current-player')!;
        this.livesEl = document.getElementById('player-lives')!;
        this.scoreEl = document.getElementById('player-score')!;
        this.inventoryListEl = document.getElementById('inventory-list')!;
        this.logMessagesEl = document.getElementById('log-messages')!;
    }

    public updatePlayerStats(nome: string, vidas: number, pontuacao: number) {
        this.currentPlayerEl.textContent = nome;
        this.livesEl.textContent = vidas.toString();
        this.scoreEl.textContent = pontuacao.toString();
    }

    public updateInventory(inventario: Pilha<string>) {
        this.inventoryListEl.innerHTML = '';
        const items = inventario.toArray();

        if (items.length === 0) {
            this.inventoryListEl.innerHTML = '<li>(Vazio)</li>';
            return;
        }

        items.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            this.inventoryListEl.appendChild(li);
        });
    }

    public addLogMessage(message: string) {
        const p = document.createElement('p');
        p.textContent = message;
        this.logMessagesEl.appendChild(p);
        this.logMessagesEl.scrollTop = this.logMessagesEl.scrollHeight;
    }
}