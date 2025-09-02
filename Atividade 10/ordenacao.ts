// ordenacao.ts
export function mergeSort<T>(arr: T[], compareFn?: (a: T, b: T) => number): T[] {
  if (arr.length <= 1) {
      return arr;
  }

  const mid = Math.floor(arr.length / 2);
  const left = arr.slice(0, mid);
  const right = arr.slice(mid);

  const sortedLeft = mergeSort(left, compareFn);
  const sortedRight = mergeSort(right, compareFn);

  return merge(sortedLeft, sortedRight, compareFn);
}

function merge<T>(left: T[], right: T[], compareFn?: (a: T, b: T) => number): T[] {
  let result: T[] = [];
  let leftIndex = 0;
  let rightIndex = 0;

  while (leftIndex < left.length && rightIndex < right.length) {
      const comparison = compareFn ? compareFn(left[leftIndex], right[rightIndex]) : 
                                     (left[leftIndex] < right[rightIndex] ? -1 : (left[leftIndex] > right[rightIndex] ? 1 : 0));
      
      if (comparison <= 0) { // Menor ou igual (estável)
          result.push(left[leftIndex]);
          leftIndex++;
      } else {
          result.push(right[rightIndex]);
          rightIndex++;
      }
  }

  return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
}