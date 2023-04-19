import { HeaderData } from "./otfReader";
import { TableTag } from "./openType";
import { readNameTable } from "./table/nameTable";
import { FontBuffer } from "../io/buffer";

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

  private getTable<T>(tag: TableTag, reader: (buffer: FontBuffer) => T) {
    if (this.#loadedTables.has(tag)) {
      return this.#loadedTables.get(tag) as T;
    }

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
