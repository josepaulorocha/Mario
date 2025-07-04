// Nó da lista, com ponteiro para o próximo e o anterior.
class CircularListNode<T> {
    public data: T;
    public next: CircularListNode<T>;
    public prev: CircularListNode<T>;

    constructor(data: T) {
        this.data = data;
        // Um nó sozinho aponta para si mesmo.
        this.next = this;
        this.prev = this;
    }
}

// Lista Circular Duplamente Ligada para gerenciar os turnos dos jogadores.
export class DoublyCircularLinkedList<T> {
    private head: CircularListNode<T> | null = null;
    private current: CircularListNode<T> | null = null;

    add(data: T) {
        const newNode = new CircularListNode(data);
        if (!this.head) {
            this.head = newNode;
            this.current = this.head;
        } else {
            const tail = this.head.prev; // O "anterior" da cabeça é sempre o último nó.
            tail.next = newNode;
            newNode.prev = tail;
            newNode.next = this.head;
            this.head.prev = newNode;
        }
    }

    // Avança para o próximo turno e retorna o jogador da vez.
    proximoTurno(): T | null {
        if (!this.current) {
            return null;
        }
        this.current = this.current.next;
        return this.current.data;
    }
}