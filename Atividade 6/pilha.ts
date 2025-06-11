export class Pilha<T> {
    private storage: T[] = [];

    // Adiciona um item ao topo da pilha
    push(item: T): void {
        this.storage.push(item);
    }

    // Remove e retorna o item do topo da pilha
    pop(): T | undefined {
        return this.storage.pop();
    }

    // Retorna o item do topo sem remover
    peek(): T | undefined {
        return this.storage[this.storage.length - 1];
    }

    // Verifica se a pilha está vazia
    isEmpty(): boolean {
        return this.storage.length === 0;
    }
}