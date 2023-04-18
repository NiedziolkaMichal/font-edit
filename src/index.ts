import { readSync } from "./io/fsLoader";
import { readOpenType } from "./otf/otfReader";

export function loadSync(path: string, verify = true) {
  const content = readSync(path);
  return load(content, verify);
}

export function load(buffer: ArrayBufferLike, verify = true) {
  const font = readOpenType(buffer, verify);
  return font;
}
