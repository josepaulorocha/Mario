"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoublyCircularLinkedList = void 0;
// Define o Nó da lista, com ponteiros para o próximo e o anterior.
var CircularListNode = /** @class */ (function () {
    function CircularListNode(data) {
        this.data = data;
        // Em uma lista com um só nó, ele aponta para si mesmo.
        this.next = this;
        this.prev = this;
    }
    return CircularListNode;
}());
// Implementa a Lista Vinculada Circular de Duas Vias.
var DoublyCircularLinkedList = /** @class */ (function () {
    function DoublyCircularLinkedList() {
        this.head = null;
        this.current = null;
    }
    // Adiciona um novo jogador (nó) à lista.
    DoublyCircularLinkedList.prototype.add = function (data) {
        var newNode = new CircularListNode(data);
        if (!this.head) {
            this.head = newNode;
            this.current = this.head;
        }
        else {
            var tail = this.head.prev; // O "anterior" da cabeça é sempre o último nó.
            tail.next = newNode;
            newNode.prev = tail;
            newNode.next = this.head;
            this.head.prev = newNode;
        }
    };
    /**
     * Avança para o próximo turno, movendo o ponteiro 'current'
     * e retornando o personagem da vez.
     */
    DoublyCircularLinkedList.prototype.proximoTurno = function () {
        if (!this.current) {
            return null;
        }
        // Avança o ponteiro para o próximo jogador na lista circular.
        this.current = this.current.next;
        return this.current.data;
    };
    return DoublyCircularLinkedList;
}());
exports.DoublyCircularLinkedList = DoublyCircularLinkedList;
