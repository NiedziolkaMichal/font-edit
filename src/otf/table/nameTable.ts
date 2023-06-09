import { assertBufferEmpty, extractBytes, FontBuffer, readUInt16 } from "../../io/buffer";
import { FontCorruptedError, NotSupportedError } from "../../util/errors";
import { arrayFrom, sort } from "../../util/misc";
import { decodeString } from "../common/encoding";
import { getDefaultLanguageTag, getLanguageTag } from "../common/language";

type AllowedTableVersions = 0;

export interface NameTable extends NameRecords {
  tableVersion: AllowedTableVersions;
  language: string;
  nonStandard: Record<number, string>;
}

//TODO docs

const NAME_RECORD_NAMES = ["copyrightNotice", "familyName", "subfamilyName", "uniqueFontIdentifier", "fullFontName", "version", "postScriptName", "trademark", "manufacturerName", "designer", "description", "urlVendor", "urlDesigner", "licenseDescription", "licenseInfo", "reserved", "topographicFamilyName", "typographicSubfamilyName", "compatibleFull", "sampleText", "postscriptCid", "wwsFamilyName", "wwsSubfamilyName", "lightBackgroundPalette", "darkBackgroundPalette", "variationsPostscriptNamePrefix"] as const;
type NameRecordKey = (typeof NAME_RECORD_NAMES)[number];

export type NameRecords = {
  [key in (typeof NAME_RECORD_NAMES)[number]]?: string;
};

export function readNameTable(buffer: FontBuffer): NameTable {
  const version = readUInt16(buffer);
  if (version !== 0) {
    throw new NotSupportedError(`Name Version ${version}`);
    //TODO version 1
  }
  const count = readUInt16(buffer);
  const storageOffset = readUInt16(buffer);
  const nameRecords = arrayFrom(count, () => readNameRecord(buffer));

  //TODO data in between current position and storageOffset
  buffer._pos = storageOffset;

  const data = decodeToNameTable(buffer, version, nameRecords);
  assertBufferEmpty(buffer, "NAME");
  return data;
}

function decodeToNameTable(buffer: FontBuffer, version: AllowedTableVersions, nameRecords: ReturnType<typeof readNameRecord>[]) {
  const decodedRecords = decodeNameRecords(buffer, nameRecords);

  const languages = [...new Set(decodedRecords.map((r) => r.language))];
  const language = languages[0] ?? getDefaultLanguageTag();
  if (languages.length > 1) {
    throw new NotSupportedError("More than one language in name table");
  }

  const nameTable: NameTable = {
    tableVersion: version,
    language,
    nonStandard: {},
  };
  decodedRecords.forEach(({ name, value }) => typeof name !== "number" && (nameTable[name] = value));
  decodedRecords.forEach(({ name, value }) => typeof name === "number" && (nameTable.nonStandard[name] = value));
  return nameTable;
}

interface DecodedRecord {
  name: NameRecordKey | number;
  value: string;
  language: string;
}

function decodeNameRecords(buffer: FontBuffer, nameRecords: ReturnType<typeof readNameRecord>[]) {
  const initialPosition = buffer._pos;
  const decodedRecords: DecodedRecord[] = [];

  let previousLength = 0;
  for (const nameRecord of sort(nameRecords, "stringOffset")) {
    const expectedOffset = initialPosition + nameRecord.stringOffset;
    if (expectedOffset === buffer._pos - previousLength) {
      // Sometimes names are reused, so buffer.pos will be the same as in the last iteration
      buffer._pos -= previousLength;
    } else if (expectedOffset !== buffer._pos) {
      throw new FontCorruptedError("Invalid name table offset");
    }
    previousLength = nameRecord.length;

    const name = getRecordName(nameRecord.nameId);

    const data = extractBytes(buffer, nameRecord.length);
    const value = decodeString(data, nameRecord.platformId, nameRecord.encodingId);

    const language = getLanguageTag(nameRecord.platformId, nameRecord.languageId);
    decodedRecords.push({
      name: name ?? nameRecord.nameId,
      value,
      language,
    });
  }
  return decodedRecords;
}

function getRecordName(nameId: number): NameRecordKey | undefined {
  if (NAME_RECORD_NAMES[nameId]) return NAME_RECORD_NAMES[nameId];
  return undefined;
}

function readNameRecord(buffer: FontBuffer) {
  return {
    platformId: readUInt16(buffer),
    encodingId: readUInt16(buffer),
    languageId: readUInt16(buffer),
    nameId: readUInt16(buffer),
    length: readUInt16(buffer),
    stringOffset: readUInt16(buffer),
  };
}
