export function arrayFrom<T>(length: number, map: (index: number) => T) {
  return Array.from({ length }, (_, index) => map(index));
}

export function sort<T>(array: T[], key: keyof T): T[] {
  return array.sort((e1, e2) => +e1[key] - +e2[key]);
}
