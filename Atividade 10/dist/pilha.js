export class Pilha {
    constructor() {
        this.storage = [];
    }
    // Adiciona um item ao topo da pilha
    push(item) {
        this.storage.push(item);
    }
    // Remove e retorna o item do topo da pilha
    pop() {
        return this.storage.pop();
    }
    // Retorna o item do topo sem remover
    peek() {
        return this.storage[this.storage.length - 1];
    }
    // Verifica se a pilha está vazia
    isEmpty() {
        return this.storage.length === 0;
    }
    // Retorna uma cópia do array interno para análise, sem modificar a pilha
    toArray() {
        return [...this.storage];
    }
    /**
     * Remove um item específico da pilha. Não é uma operação de pilha padrão,
     * mas é útil para mecânicas de jogo onde um item específico é consumido.
     * @param item O item a ser removido.
     * @returns Retorna true se o item foi encontrado e removido, false caso contrário.
     */
    removerItem(item) {
        const index = this.storage.lastIndexOf(item); // Pega o último adicionado
        if (index !== -1) {
            this.storage.splice(index, 1);
            return true;
        }
        return false;
    }
}
