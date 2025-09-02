export class FilaDupla<T> {
    private storage: T[] = [];

    // Adiciona um item no final da fila
    addBack(item: T): void {
        this.storage.push(item);
    }

    // Adiciona um item na frente da fila
    addFront(item: T): void {
        this.storage.unshift(item);
    }

    // Remove e retorna o item da frente
    removeFront(): T | undefined {
        return this.storage.shift();
    }

    // Verifica se a fila está vazia
    isEmpty(): boolean {
        return this.storage.length === 0;
    }

    // Retorna uma cópia do array interno para análise, sem modificar a fila
    toArray(): T[] {
        return [...this.storage];
    }
}