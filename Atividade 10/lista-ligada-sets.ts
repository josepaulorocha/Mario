// Define um nó da lista ligada
export class ListNode<T> { // Exportado para acesso ao tipo
    public data: T;
    public next: ListNode<T> | null = null;

    constructor(data: T) {
        this.data = data;
    }
}

// Implementa a Lista Ligada de Sets
export class LinkedListOfSets<T> {
    private head: ListNode<Set<T>> | null = null;

    // Adiciona um novo set (região) ao final da lista
    add(dataSet: Set<T>) {
        const newNode = new ListNode(dataSet);
        if (!this.head) {
            this.head = newNode;
        } else {
            let current = this.head;
            while (current.next) {
                current = current.next;
            }
            current.next = newNode;
        }
    }
    
    // Retorna o nó inicial da lista, para o jogo saber por onde começar
    getHead(): ListNode<Set<T>> | null {
        return this.head;
    }
}