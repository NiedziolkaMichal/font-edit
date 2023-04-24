import { assertBufferEmpty, FontBuffer, readInt16, readTag, readUInt16, readUInt32, readUInt8 } from "../../io/buffer";
import { NotSupportedError } from "../../util/errors";

export interface Os2TableV1 {
  version: 1;
  xAvgCharWidth: number;
  usWeightClass: number;
  usWidthClass: number;
  fsType: number;
  ySubscriptXSize: number;
  ySubscriptYSize: number;
  ySubscriptXOffset: number;
  ySubscriptYOffset: number;
  ySuperscriptXSize: number;
  ySuperscriptYSize: number;
  ySuperscriptXOffset: number;
  ySuperscriptYOffset: number;
  yStrikeoutSize: number;
  yStrikeoutPosition: number;
  sFamilyClass: number;
  panose: Panose;
  ulUnicodeRange1: number;
  ulUnicodeRange2: number;
  ulUnicodeRange3: number;
  ulUnicodeRange4: number;
  achVendID: string;
  fsSelection: number;
  usFirstCharIndex: number;
  usLastCharIndex: number;
  sTypoAscender: number;
  sTypoDescender: number;
  sTypoLineGap: number;
  usWinAscent: number;
  usWinDescent: number;
  ulCodePageRange1: number;
  ulCodePageRange2: number;
}

export type Os2TableV4 = Omit<Os2TableV1, "version"> & {
  version: 2 | 3 | 4;
  sxHeight: number;
  sCapHeight: number;
  usDefaultChar: number;
  usBreakChar: number;
  usMaxContext: number;
};

export type Os2TableV5 = Omit<Os2TableV4, "version"> & {
  version: 5; //TODO find version 5 and include it in test cases
  usLowerOpticalPointSize: number;
  usUpperOpticalPointSize: number;
};

export interface Panose {
  familyType: number;
  serifStyle: number;
  weight: number;
  proportion: number;
  contrast: number;
  strokeVariation: number;
  armStyle: number;
  letterform: number;
  midline: number;
  xHeight: number;
}

export function readOs2Table(buffer: FontBuffer): Os2TableV1 | Os2TableV4 | Os2TableV5 {
  const version = readUInt16(buffer);
  if (version <= 0 || version > 5) throw new NotSupportedError(`OS/2 version ${version}`);
  const data = read(buffer, version as 1 | 2 | 3 | 4 | 5);
  assertBufferEmpty(buffer, "OS/2");
  return data;
}

type PartialV4 = Partial<Omit<Os2TableV4, keyof Os2TableV1>> & Omit<Os2TableV1, "version"> & { version: 2 | 3 | 4 };
type PartialV5 = Partial<Omit<Os2TableV5, keyof Os2TableV1>> & Omit<Os2TableV1, "version"> & { version: 5 };

function read(buffer: FontBuffer, version: 1 | 2 | 3 | 4 | 5): Os2TableV1 | Os2TableV4 | Os2TableV5 {
  const data: Os2TableV1 | PartialV4 | PartialV5 = {
    version,
    xAvgCharWidth: readInt16(buffer),
    usWeightClass: readUInt16(buffer),
    usWidthClass: readUInt16(buffer),
    fsType: readUInt16(buffer),
    ySubscriptXSize: readInt16(buffer),
    ySubscriptYSize: readInt16(buffer),
    ySubscriptXOffset: readInt16(buffer),
    ySubscriptYOffset: readInt16(buffer),
    ySuperscriptXSize: readInt16(buffer),
    ySuperscriptYSize: readInt16(buffer),
    ySuperscriptXOffset: readInt16(buffer),
    ySuperscriptYOffset: readInt16(buffer),
    yStrikeoutSize: readInt16(buffer),
    yStrikeoutPosition: readInt16(buffer),
    sFamilyClass: readInt16(buffer),
    panose: readPanose(buffer),
    ulUnicodeRange1: readUInt32(buffer),
    ulUnicodeRange2: readUInt32(buffer),
    ulUnicodeRange3: readUInt32(buffer),
    ulUnicodeRange4: readUInt32(buffer),
    achVendID: readTag(buffer),
    fsSelection: readUInt16(buffer),
    usFirstCharIndex: readUInt16(buffer),
    usLastCharIndex: readUInt16(buffer),
    sTypoAscender: readInt16(buffer),
    sTypoDescender: readInt16(buffer),
    sTypoLineGap: readInt16(buffer),
    usWinAscent: readUInt16(buffer),
    usWinDescent: readUInt16(buffer),
    ulCodePageRange1: readUInt32(buffer),
    ulCodePageRange2: readUInt32(buffer),
  };
  if (data.version >= 2) {
    // Added type assertions everywhere, because TS doesn't narrow down discriminated union type when >= is used
    // Changing it to (data.version === 2 || data.version === 3 || data.version === 4 || data.version === 5) would be inefficient code
    (data as PartialV4).sxHeight = readInt16(buffer);
    (data as PartialV4).sCapHeight = readInt16(buffer);
    (data as PartialV4).usDefaultChar = readUInt16(buffer);
    (data as PartialV4).usBreakChar = readUInt16(buffer);
    (data as PartialV4).usMaxContext = readUInt16(buffer);
  }
  if (data.version === 5) {
    data.usLowerOpticalPointSize = readUInt16(buffer);
    data.usUpperOpticalPointSize = readUInt16(buffer);
  }
  return data as Os2TableV1 | Os2TableV4 | Os2TableV5;
}

function readPanose(buffer: FontBuffer): Panose {
  return {
    familyType: readUInt8(buffer),
    serifStyle: readUInt8(buffer),
    weight: readUInt8(buffer),
    proportion: readUInt8(buffer),
    contrast: readUInt8(buffer),
    strokeVariation: readUInt8(buffer),
    armStyle: readUInt8(buffer),
    letterform: readUInt8(buffer),
    midline: readUInt8(buffer),
    xHeight: readUInt8(buffer),
  };
}
