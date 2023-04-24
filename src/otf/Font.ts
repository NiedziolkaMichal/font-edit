import { HeaderData } from "./otfReader";
import { TableTag } from "./openType";
import { FontBuffer } from "../io/buffer";
import { readNameTable } from "./table/nameTable";
import { readHeadTable } from "./table/headTable";
import { readMaxpTable } from "./table/maxpTable";
import { readHheaTable } from "./table/hheaTable";
import { readOs2Table } from "./table/os2Table";

const internalsCache = new WeakMap<Font, Internals>();

export class Font {
  constructor(header: HeaderData) {
    createInternals(this, header);
  }

  get name() {
    return getTable(this, TableTag.NAME, readNameTable);
  }

  get head() {
    return getTable(this, TableTag.HEAD, readHeadTable);
  }

  get maxp() {
    return getTable(this, TableTag.MAXP, readMaxpTable);
  }

  get hhea() {
    return getTable(this, TableTag.HHEA, readHheaTable);
  }

  get os2() {
    return getTable(this, TableTag.OS2, readOs2Table);
  }
}

interface Internals {
  _header: HeaderData;
  _loaded: Map<TableTag, unknown>;
}

function createInternals(font: Font, header: HeaderData) {
  internalsCache.set(font, {
    _header: header,
    _loaded: new Map(),
  });
}

function getInternals(font: Font) {
  return internalsCache.get(font)!;
}

function getTable<T>(font: Font, tag: TableTag, reader: (buffer: FontBuffer) => T) {
  const internals = getInternals(font);

  if (internals._loaded.has(tag)) {
    return internals._loaded.get(tag) as T;
  }
  //TODO after loading data, we could release DataView, so eventually ArrayBuffer can be garbage collected
  for (const table of internals._header.tables) {
    if (table.tableTag === tag) {
      const data = reader(table.data);
      internals._loaded.set(tag, data);
      return data;
    }
  }
  return undefined;
}
