import { readSync } from "./io/fsLoader";
import { readOpenType } from "./otf/otfReader";

export function loadSync(path: string) {
  const content = readSync(path);
  return load(content);
}

export function load(buffer: ArrayBufferLike) {
  return readOpenType(buffer);
}
