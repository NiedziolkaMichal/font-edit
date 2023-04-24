import { bufferTotalSize, extractBytes, FontBuffer, readBytes, readUInt16, readUInt32 } from "../io/buffer";
import { assertEqual, FontCorruptedError, NotSupportedError } from "../util/errors";
import { Version } from "./openType";
import { closestMaxPowerOfTwo } from "../util/math";
import { HeaderData, HeaderTable } from "./otfReader";
import { arrayFrom, sort } from "../util/misc";

interface TableRecord {
  /** Table identifier */
  tableTag: number;
  /** Checksum for this table */
  checksum: number;
  /** Offset from beginning of font file */
  offset: number;
  /** Length of this table */
  length: number;
}

export function readHeader(buffer: FontBuffer): HeaderData {
  const version = readUInt32(buffer);

  assertCorrectVersion(version);
  assertSupportedVersion(version);

  const tablesCount = readUInt16(buffer);

  const searchRange = readUInt16(buffer);
  const entrySelector = readUInt16(buffer);
  const rangeShift = readUInt16(buffer);

  const tableRecords = readTables(buffer, tablesCount);
  const tables = readAllTableData(buffer, tableRecords);

  const header = {
    version,
    tables,
  };

  assertEqual("Incorrect `searchRange` value", searchRange, calculateSearchRange(header));
  assertEqual("Incorrect `entrySelector` value", entrySelector, calculateEntrySelector(header));
  assertEqual("Incorrect `rangeShift` value", rangeShift, calculateRangeShift(header));
  assertEqual("Incorrect total size", buffer._pos, bufferTotalSize(buffer));

  return header;
}

function readTables(buffer: FontBuffer, count: number) {
  return arrayFrom(count, () => readTable(buffer));
}

function readTable(buffer: FontBuffer): TableRecord {
  const tableTag = readUInt32(buffer);
  const checksum = readUInt32(buffer);
  const offset = readUInt32(buffer);
  const length = readUInt32(buffer);

  return {
    tableTag,
    checksum,
    offset,
    length,
  };
}

function readAllTableData(buffer: FontBuffer, tables: TableRecord[]): HeaderTable[] {
  const readTables: HeaderTable[] = [];

  for (const table of sort(tables, "offset")) {
    if (table.offset !== buffer._pos) {
      throw new FontCorruptedError("Invalid table offset");
    }
    const data = new FontBuffer(extractBytes(buffer, table.length));
    //TODO verify checksum

    const paddingLength = calculatePadding(table.length);
    if (paddingLength) {
      readBytes(buffer, paddingLength);
    }

    readTables.push({
      tableTag: table.tableTag,
      data,
    });
  }
  return readTables;
}

function assertCorrectVersion(versionTag: number): asserts versionTag is Version {
  if (!Version[versionTag]) {
    throw new NotSupportedError(`OTF Version ${versionTag}`);
  }
}

function assertSupportedVersion(versionTag: number) {
  if (versionTag !== Version.TTV1 && versionTag !== Version.OT) {
    //TODO other versions
    throw new NotSupportedError(`OTF Version ${versionTag}`);
  }
}

function calculatePadding(tableLength: number) {
  if (tableLength % 4 == 0) return 0;
  return 4 - (tableLength % 4);
}

function calculateSearchRange(header: HeaderData) {
  return closestMaxPowerOfTwo(header.tables.length) * 16;
}

function calculateEntrySelector(header: HeaderData) {
  return Math.floor(Math.log2(closestMaxPowerOfTwo(header.tables.length)));
}

function calculateRangeShift(header: HeaderData) {
  return header.tables.length * 16 - calculateSearchRange(header);
}
