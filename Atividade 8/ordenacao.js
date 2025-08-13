"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeSort = mergeSort;
function mergeSort(arr) {
    if (arr.length <= 1) {
        return arr;
    }
    var middle = Math.floor(arr.length / 2);
    var left = mergeSort(arr.slice(0, middle));
    var right = mergeSort(arr.slice(middle));
    return merge(left, right);
}
function merge(left, right) {
    var result = [];
    var i = 0;
    var j = 0;
    while (i < left.length && j < right.length) {
        if (left[i] < right[j]) {
            result.push(left[i]);
            i++;
        }
        else {
            result.push(right[j]);
            j++;
        }
    }
    // Adiciona o restante dos elementos (se houver)
    return result.concat(left.slice(i)).concat(right.slice(j));
}
