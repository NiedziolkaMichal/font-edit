export function closestMaxPowerOfTwo(max: number) {
  return 1 << (31 - Math.clz32(max));
}
