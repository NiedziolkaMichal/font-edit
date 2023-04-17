import * as fs from "fs";

export function readSync(path: string) {
  const buffer = fs.readFileSync(path);
  return buffer.buffer;
}
