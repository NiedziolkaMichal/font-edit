import { FontCorruptedError } from "../util/errors";

export function parseFlags<O extends object>(flags: number, names: Array<keyof O | undefined>, length: number, flagName: string): Partial<Record<keyof O, boolean>> {
  const parsed: Partial<Record<keyof O, boolean>> = {};
  for (let i = 0; i <= length; i++) {
    if (flags & (1 << i)) {
      const name = names[i];
      if (!name) {
        throw new FontCorruptedError(`Bit ${i} in ${flagName} is not supported`);
      }
      parsed[name] = true;
    }
  }
  return parsed;
}
