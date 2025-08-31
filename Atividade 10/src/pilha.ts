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

    // Retorna uma cópia do array interno para análise, sem modificar a pilha
    toArray(): T[] {
        return [...this.storage];
    }

    /**
     * Remove um item específico da pilha. Não é uma operação de pilha padrão,
     * mas é útil para mecânicas de jogo onde um item específico é consumido.
     * @param item O item a ser removido.
     * @returns Retorna true se o item foi encontrado e removido, false caso contrário.
     */
    removerItem(item: T): boolean {
        const index = this.storage.lastIndexOf(item); // Pega o último adicionado
        if (index !== -1) {
            this.storage.splice(index, 1);
            return true;
        }
        return false;
    }
}