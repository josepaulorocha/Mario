// Atividade 10/lista-circular.ts (CORRIGIDO)
class Node {
    constructor(data) {
        this.data = data;
        this.next = null;
        this.prev = null;
    }
}
export class DoublyCircularLinkedList {
    constructor() {
        this.head = null;
        this.tail = null;
        this.current = null;
    }
    add(data) {
        const newNode = new Node(data);
        if (!this.head) {
            this.head = newNode;
            this.tail = newNode;
            newNode.next = newNode;
            newNode.prev = newNode;
            this.current = newNode;
        }
        else {
            if (this.tail) {
                newNode.prev = this.tail;
                newNode.next = this.head;
                this.tail.next = newNode;
                this.head.prev = newNode;
                this.tail = newNode;
            }
        }
    }
    proximoTurno() {
        if (!this.current) {
            return null;
        }
        this.current = this.current.next;
        return this.current ? this.current.data : null;
    }
    peekProximoTurno() {
        if (!this.current || !this.current.next) {
            return null;
        }
        return this.current.next.data;
    }
    resetToHead() {
        this.current = this.head;
    }
    // --- NOVO MÉTODO PARA CORRIGIR O BUG DE ROTAÇÃO ---
    /**
     * Procura por um nó com o dado especificado e define como o 'current'.
     * @param data O dado do nó a ser encontrado (ex: "Luigi").
     * @returns True se o nó foi encontrado e definido, false caso contrário.
     */
    setCurrentByData(data) {
        if (!this.head) {
            return false;
        }
        let searchNode = this.head;
        do {
            if (searchNode.data === data) {
                this.current = searchNode;
                return true;
            }
            searchNode = searchNode.next;
        } while (searchNode !== this.head);
        return false;
    }
}
