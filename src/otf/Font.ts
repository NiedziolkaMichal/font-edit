import { HeaderData } from "./otfReader";
import { TableTag } from "./openType";
import { readNameTable } from "./table/nameTable";
import { FontBuffer } from "../io/buffer";
import { readHeadTable } from "./table/headTable";
import { readMaxpTable } from "./table/maxpTable";
import { readHheaTable } from "./table/hheaTable";
import { readOs2Table } from "./table/os2Table";

export class Font {
  readonly #header;
  #loadedTables: Map<TableTag, unknown>;

  constructor(header: HeaderData) {
    this.#header = header;
    this.#loadedTables = new Map();
  }

  get name() {
    return this.getTable(TableTag.NAME, readNameTable);
  }

  get head() {
    return this.getTable(TableTag.HEAD, readHeadTable);
  }

  get maxp() {
    return this.getTable(TableTag.MAXP, readMaxpTable);
  }

  get hhea() {
    return this.getTable(TableTag.HHEA, readHheaTable);
  }

  get os2() {
    return this.getTable(TableTag.OS2, readOs2Table);
  }

  private getTable<T>(tag: TableTag, reader: (buffer: FontBuffer) => T) {
    if (this.#loadedTables.has(tag)) {
      return this.#loadedTables.get(tag) as T;
    }
    //TODO after loading data, we could release DataView, so eventually ArrayBuffer can be garbage collected
    for (const table of this.#header.tables) {
      if (table.tableTag === tag) {
        const data = reader(table.data);
        this.#loadedTables.set(tag, data);
        return data;
      }
    }
    return undefined;
  }
}
