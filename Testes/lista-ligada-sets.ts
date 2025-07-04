export class ListNode<T> {
    public data: T;
    public next: ListNode<T> | null = null;

    constructor(data: T) {
        this.data = data;
    }
}

// Implementa uma Lista Ligada de Sets para representar as regiões do mundo.
export class LinkedListOfSets<T> {
    private head: ListNode<Set<T>> | null = null;

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
    
    getHead(): ListNode<Set<T>> | null {
        return this.head;
    }
}