export class FilaDupla {
    constructor() {
        this.storage = [];
    }
    // Adiciona um item no final da fila
    addBack(item) {
        this.storage.push(item);
    }
    // Adiciona um item na frente da fila
    addFront(item) {
        this.storage.unshift(item);
    }
    // Remove e retorna o item da frente
    removeFront() {
        return this.storage.shift();
    }
    // Verifica se a fila está vazia
    isEmpty() {
        return this.storage.length === 0;
    }
    // Retorna uma cópia do array interno para análise, sem modificar a fila
    toArray() {
        return [...this.storage];
    }
}
