// Define o Nó da lista, com ponteiros para o próximo e o anterior.
class CircularListNode<T> {
    public data: T;
    public next: CircularListNode<T>;
    public prev: CircularListNode<T>;

    constructor(data: T) {
        this.data = data;
        // Em uma lista com um só nó, ele aponta para si mesmo.
        this.next = this;
        this.prev = this;
    }
}

// Implementa a Lista Vinculada Circular de Duas Vias.
export class DoublyCircularLinkedList<T> {
    private head: CircularListNode<T> | null = null;
    private current: CircularListNode<T> | null = null;

    // Adiciona um novo jogador (nó) à lista.
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

    /**
     * Avança para o próximo turno, movendo o ponteiro 'current'
     * e retornando o personagem da vez.
     */
    proximoTurno(): T | null {
        if (!this.current) {
            return null;
        }
        // Avança o ponteiro para o próximo jogador na lista circular.
        this.current = this.current.next;
        return this.current.data;
    }
}