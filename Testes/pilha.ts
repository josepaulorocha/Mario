export class Pilha<T> {
    private storage: T[] = [];

    // Adicionado um item ao topo da pilha
    push(item: T): void {
        this.storage.push(item);
    }

    // Remove e retorna o item do topo da pilha
    pop(): T | undefined {
        return this.storage.pop();
    }

    // Retorna o item do topo da pilha sem removê-lo
    peek(): T | undefined {
        return this.storage[this.storage.length - 1];
    }

    // Verifica se a pilha está vazia e retorna um operador booleano
    isEmpty(): boolean {
        return this.storage.length === 0;
    }

    // Retorna uma cópia do array de elementos
    toArray(): T[] {
        return [...this.storage];
    }

    // Remove um item específico da pilha (operação não-padrão, útil para o jogo).
    removerItem(item: T): boolean {
        const index = this.storage.lastIndexOf(item); // Pega o último adicionado.
        if (index !== -1) {
            this.storage.splice(index, 1);
            return true;
        }
        return false;
    }
}