import { FontBuffer } from "../io/buffer";
import { readHeader } from "./sfntHeader";

export function readOpenType(buffer: ArrayBufferLike) {
  const fontBuffer = new FontBuffer(buffer);
  const header = readHeader(fontBuffer);

  return {
    header,
  };
}
