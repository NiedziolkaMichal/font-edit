import { Font } from "../src/otf/Font";
import { readSync } from "../src/io/fsLoader";

export function serializeFont(font: Font) {
  const proto = Object.getPrototypeOf(font);

  const result: Record<string | symbol, unknown> = {
    ...font,
  };
  for (const key of Reflect.ownKeys(proto)) {
    // @ts-ignore
    const value = font[key];
    if (typeof value !== "function") result[key] = value;
  }
  return result;
}

export function readJSON(path: string) {
  return JSON.parse(readSync(path).toString());
}
