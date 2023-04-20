import { FontBuffer } from "../../io/buffer";
import { assertEqual, FontCorruptedError, NotSupportedError } from "../../util/errors";
import { arrayFrom, sort } from "../../util/misc";
import { decodeString } from "../common/encoding";
import { getDefaultLanguageTag, getLanguageTag } from "../common/language";

export interface NameTable extends NameRecords {
  tableVersion: 0;
  recordsPerLanguage: Record<string, NameRecords>;
}

//TODO docs

const NAME_RECORD_NAMES = ["copyrightNotice", "familyName", "subfamilyName", "uniqueFontIdentifier", "fullFontName", "version", "postScriptName", "trademark", "manufacturerName", "designer", "description", "urlVendor", "urlDesigner", "licenseDescription", "licenseInfo", "reserved", "topographicFamilyName", "typographicSubfamilyName", "compatibleFull", "sampleText", "postscriptCid", "wwsFamilyName", "wwsSubfamilyName", "lightBackgroundPalette", "darkBackgroundPalette", "variationsPostscriptNamePrefix"] as const;

export type NameRecords = {
  [key in (typeof NAME_RECORD_NAMES)[number]]?: string;
};

export function readNameTable(buffer: FontBuffer): NameTable {
  const version = buffer.readUInt16();
  if (version !== 0) {
    throw new NotSupportedError(`Name Version ${version}`);
    //TODO version 1
  }
  const count = buffer.readUInt16();
  const storageOffset = buffer.readUInt16();
  const nameRecords = arrayFrom(count, () => readNameRecord(buffer));

  //TODO data in between current position and storageOffset
  buffer.pos = storageOffset;

  const nameTable: NameTable = {
    tableVersion: version,
    recordsPerLanguage: {}, //TODO single source of truth
  };

  let previousLength = 0;
  for (const nameRecord of sort(nameRecords, "stringOffset")) {
    const expectedOffset = storageOffset + nameRecord.stringOffset;
    if (expectedOffset === buffer.pos - previousLength) {
      // Sometimes names are reused, so buffer.pos will be the same as in the last iteration
      buffer.pos -= previousLength;
    } else if (expectedOffset !== buffer.pos) {
      throw new FontCorruptedError("Invalid name table offset");
    }
    previousLength = nameRecord.length;

    const name = getRecordName(nameRecord.nameId);

    const data = buffer.extractBytes(nameRecord.length);
    const decoded = decodeString(data, nameRecord.platformId, nameRecord.encodingId);

    const language = getLanguageTag(nameRecord.platformId, nameRecord.languageId);
    const defaultLanguage = getDefaultLanguageTag(nameRecord.platformId);

    if (!nameTable[name] || language === defaultLanguage) {
      nameTable[name] = decoded;
    }
    if (!nameTable.recordsPerLanguage[language]) {
      nameTable.recordsPerLanguage[language] = {};
    }
    nameTable.recordsPerLanguage[language][name] = decoded;
  }

  assertEqual("Leftover data in name table", buffer.pos, buffer.getTotalSize());

  return nameTable;
}

function getRecordName(nameId: number) {
  if (NAME_RECORD_NAMES[nameId]) return NAME_RECORD_NAMES[nameId];
  throw new NotSupportedError(`Name Id ${nameId}`);
}

function readNameRecord(buffer: FontBuffer) {
  const platformId = buffer.readUInt16();
  const encodingId = buffer.readUInt16();
  const languageId = buffer.readUInt16();
  const nameId = buffer.readUInt16();
  const length = buffer.readUInt16();
  const stringOffset = buffer.readUInt16();

  return {
    platformId,
    encodingId,
    languageId,
    nameId,
    length,
    stringOffset,
  };
}
