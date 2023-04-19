import * as fs from "fs";

export function readSync(path: string) {
  return fs.readFileSync(path);
}
