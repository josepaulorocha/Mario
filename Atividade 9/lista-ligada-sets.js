"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinkedListOfSets = exports.ListNode = void 0;
// Define um nó da lista ligada
var ListNode = /** @class */ (function () {
    function ListNode(data) {
        this.next = null;
        this.data = data;
    }
    return ListNode;
}());
exports.ListNode = ListNode;
// Implementa a Lista Ligada de Sets
var LinkedListOfSets = /** @class */ (function () {
    function LinkedListOfSets() {
        this.head = null;
    }
    // Adiciona um novo set (região) ao final da lista
    LinkedListOfSets.prototype.add = function (dataSet) {
        var newNode = new ListNode(dataSet);
        if (!this.head) {
            this.head = newNode;
        }
        else {
            var current = this.head;
            while (current.next) {
                current = current.next;
            }
            current.next = newNode;
        }
    };
    // Retorna o nó inicial da lista, para o jogo saber por onde começar
    LinkedListOfSets.prototype.getHead = function () {
        return this.head;
    };
    return LinkedListOfSets;
}());
exports.LinkedListOfSets = LinkedListOfSets;
