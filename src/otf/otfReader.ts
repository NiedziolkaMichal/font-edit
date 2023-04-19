import { FontBuffer } from "../io/buffer";
import { readHeader } from "./sfntHeader";
import { Version } from "./openType";
import { Font } from "./Font";

export interface HeaderData {
  version: Version;
  tables: HeaderTable[];
}

export interface HeaderTable {
  tableTag: number;
  data: FontBuffer;
}

export function readOpenType(buffer: ArrayBufferLike) {
  const fontBuffer = new FontBuffer(buffer);
  const header = readHeader(fontBuffer);

  return new Font(header);
}
