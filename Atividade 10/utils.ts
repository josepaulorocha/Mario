// Atividade 10/utils.ts

export const Compare = {
    LESS_THAN: -1,
    BIGGER_THAN: 1,
    EQUALS: 0
  };
  
  export function defaultCompare<T>(a: T, b: T): number {
    if (a === b) {
      return Compare.EQUALS;
    }
    return a < b ? Compare.LESS_THAN : Compare.BIGGER_THAN;
  }
  
  export function swap(array: any[], a: number, b: number): void {
    [array[a], array[b]] = [array[b], array[a]];
  }