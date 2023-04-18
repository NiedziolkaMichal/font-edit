import { FontBuffer } from "../io/buffer";
import { assertEqual, FontCorruptedError, NotSupportedError } from "../util/errors";
import { Version } from "./openType";
import { closestMaxPowerOfTwo } from "../util/math";
import { HeaderData, HeaderTable } from "./otfReader";

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

export function readHeader(buffer: FontBuffer, verify = true): HeaderData {
  const version = buffer.readUInt32();

  assertCorrectVersion(version);
  if (verify) {
    assertCorrectVersion(version);
    assertSupportedVersion(version);
  }

  const tablesCount = buffer.readUInt16();

  const searchRange = buffer.readUInt16();
  const entrySelector = buffer.readUInt16();
  const rangeShift = buffer.readUInt16();

  const tableRecords = readTables(buffer, tablesCount);
  const tables = readAllTableData(buffer, tableRecords, verify);

  const header = {
    version,
    tables
  }

  if(verify) {
    assertEqual("Incorrect `searchRange` value", searchRange, calculateSearchRange(header));
    assertEqual("Incorrect `entrySelector` value", entrySelector, calculateEntrySelector(header));
    assertEqual("Incorrect `rangeShift` value", rangeShift, calculateRangeShift(header));
    assertEqual("Incorrect total size", buffer.pos, buffer.getTotalSize());
  }

  return header;
}

function readTables(buffer: FontBuffer, count: number) {
  return Array.from({length: count}, () => readTable(buffer));
}

function readTable(buffer: FontBuffer): TableRecord {
  const tableTag = buffer.readUInt32();
  const checksum = buffer.readUInt32();
  const offset = buffer.readUInt32();
  const length = buffer.readUInt32();

  return {
    tableTag,
    checksum,
    offset,
    length
  }
}

function readAllTableData(buffer: FontBuffer, tables: TableRecord[], verify: boolean): HeaderTable[] {
  const sortedByOffset = tables.sort((t1, t2) => t1.offset - t2.offset);
  const readTables: HeaderTable[] = [];

  for(const table of sortedByOffset) {
    if(verify && table.offset !== buffer.pos) {
      throw new FontCorruptedError("Invalid table offset");
    }
    const data = buffer.extractBytes(table.length);
    //TODO verify checksum

    const paddingLength = calculatePadding(table.length);
    if(paddingLength) {
      buffer.readBytes(paddingLength)
    }

    readTables.push({
      tableTag: table.tableTag,
      data
    })
  }
  return readTables;
}

function assertCorrectVersion(versionTag: number): asserts versionTag is Version {
  if (!Version[versionTag]) {
    throw new NotSupportedError(`OTF Version ${versionTag}`);
  }
}

function assertSupportedVersion(versionTag: number) {
  if(versionTag !== Version.TTV1) {
    throw new NotSupportedError(`OTF Version ${versionTag}`)
  }
}

function calculatePadding(tableLength: number) {
  if(tableLength % 4 == 0)
    return 0;
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
