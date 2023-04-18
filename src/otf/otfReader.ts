import { FontBuffer } from "../io/buffer";
import { readHeader } from "./sfntHeader";
import { Version } from "./openType";

export interface HeaderData {
  version: Version;
  tables: HeaderTable[];
}

export interface HeaderTable {
  tableTag: number;
  data: FontBuffer;
}

export function readOpenType(buffer: ArrayBufferLike, verify = true) {
  const fontBuffer = new FontBuffer(buffer);
  const header = readHeader(fontBuffer);

  return {
    header,
  };
}
