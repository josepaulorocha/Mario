// Define um nó da lista ligada
export class ListNode {
    constructor(data) {
        this.next = null;
        this.data = data;
    }
}
// Implementa a Lista Ligada de Sets
export class LinkedListOfSets {
    constructor() {
        this.head = null;
    }
    // Adiciona um novo set (região) ao final da lista
    add(dataSet) {
        const newNode = new ListNode(dataSet);
        if (!this.head) {
            this.head = newNode;
        }
        else {
            let current = this.head;
            while (current.next) {
                current = current.next;
            }
            current.next = newNode;
        }
    }
    // Retorna o nó inicial da lista, para o jogo saber por onde começar
    getHead() {
        return this.head;
    }
}
