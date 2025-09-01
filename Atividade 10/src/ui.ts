import { Pilha } from './pilha.js';
import { FilaDupla } from './fila-dupla.js';

export class UI {
    private scoreElement: HTMLElement;
    private livesElement: HTMLElement;
    private currentPlayerElement: HTMLElement;
    private inventoryList: HTMLElement;
    private eventLog: HTMLElement;

    private inventory: Pilha<string>;
    private eventQueue: FilaDupla<string>;

    constructor() {
        this.scoreElement = document.getElementById('player-score') as HTMLElement;
        this.livesElement = document.getElementById('player-lives') as HTMLElement;
        this.currentPlayerElement = document.getElementById('current-player') as HTMLElement;
        this.inventoryList = document.getElementById('inventory-list') as HTMLElement;
        this.eventLog = document.getElementById('log-messages') as HTMLElement;

        this.inventory = new Pilha<string>();
        this.eventQueue = new FilaDupla<string>();
    }

    public updateScore(score: number): void {
        this.scoreElement.textContent = score.toString();
    }

    public updateLives(lives: number): void {
        this.livesElement.textContent = lives.toString();
    }

    public setCurrentPlayer(playerName: string): void {
        this.currentPlayerElement.textContent = playerName;
    }

    public addToInventory(item: string): void {
        this.inventory.push(item);
        this.updateInventoryDisplay();
        this.addEvent(`Coletou ${item}!`);
    }

    private updateInventoryDisplay(): void {
        this.inventoryList.innerHTML = '';
        const items = this.inventory.toArray().reverse();

        if (items.length === 0) {
            this.inventoryList.innerHTML = '<li>(Vazio)</li>';
            return;
        }
        
        items.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            this.inventoryList.appendChild(li);
        });
    }

    public addEvent(event: string): void {
        if (this.eventQueue.size() >= 5) {
            this.eventQueue.removeFront();
        }
        this.eventQueue.addBack(event);
        this.updateEventLog();
    }

    private updateEventLog(): void {
        this.eventLog.innerHTML = '';
        const tempFila = new FilaDupla<string>();
        while(!this.eventQueue.isEmpty()){
            const message = this.eventQueue.removeFront()!;
            const p = document.createElement('p');
            p.textContent = message;
            this.eventLog.appendChild(p);
            tempFila.addBack(message);
        }
        this.eventQueue = tempFila;
        this.eventLog.scrollTop = this.eventLog.scrollHeight;
    }
}