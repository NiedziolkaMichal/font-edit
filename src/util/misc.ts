export function arrayFrom<T>(length: number, map: (index: number) => T) {
  return Array.from({ length }, (_, index) => map(index));
}

export function sort<T extends Record<K, number | bigint>, K extends keyof T>(array: T[], key: K): T[] {
  return array.sort((e1, e2) => e1[key] - e2[key]);
}
