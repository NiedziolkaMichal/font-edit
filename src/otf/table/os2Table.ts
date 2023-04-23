import { FontBuffer } from "../../io/buffer";
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
  version: 5;
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
  const version = buffer.readUInt16();
  if (version <= 0 || version > 5) throw new NotSupportedError(`OS/2 version ${version}`);
  const data = read(buffer, version as 1 | 2 | 3 | 4 | 5);
  buffer.assertEmpty("OS/2");
  return data;
}

type PartialV4 = Partial<Omit<Os2TableV4, keyof Os2TableV1>> & Omit<Os2TableV1, "version"> & { version: 2 | 3 | 4 };
type PartialV5 = Partial<Omit<Os2TableV5, keyof Os2TableV1>> & Omit<Os2TableV1, "version"> & { version: 5 };

function read(buffer: FontBuffer, version: 1 | 2 | 3 | 4 | 5): Os2TableV1 | Os2TableV4 | Os2TableV5 {
  const data: Os2TableV1 | PartialV4 | PartialV5 = {
    version,
    xAvgCharWidth: buffer.readInt16(),
    usWeightClass: buffer.readUInt16(),
    usWidthClass: buffer.readUInt16(),
    fsType: buffer.readUInt16(),
    ySubscriptXSize: buffer.readInt16(),
    ySubscriptYSize: buffer.readInt16(),
    ySubscriptXOffset: buffer.readInt16(),
    ySubscriptYOffset: buffer.readInt16(),
    ySuperscriptXSize: buffer.readInt16(),
    ySuperscriptYSize: buffer.readInt16(),
    ySuperscriptXOffset: buffer.readInt16(),
    ySuperscriptYOffset: buffer.readInt16(),
    yStrikeoutSize: buffer.readInt16(),
    yStrikeoutPosition: buffer.readInt16(),
    sFamilyClass: buffer.readInt16(),
    panose: readPanose(buffer),
    ulUnicodeRange1: buffer.readUInt32(),
    ulUnicodeRange2: buffer.readUInt32(),
    ulUnicodeRange3: buffer.readUInt32(),
    ulUnicodeRange4: buffer.readUInt32(),
    achVendID: buffer.readTag(),
    fsSelection: buffer.readUInt16(),
    usFirstCharIndex: buffer.readUInt16(),
    usLastCharIndex: buffer.readUInt16(),
    sTypoAscender: buffer.readInt16(),
    sTypoDescender: buffer.readInt16(),
    sTypoLineGap: buffer.readInt16(),
    usWinAscent: buffer.readUInt16(),
    usWinDescent: buffer.readUInt16(),
    ulCodePageRange1: buffer.readUInt32(),
    ulCodePageRange2: buffer.readUInt32(),
  };
  if (data.version >= 2) {
    // Added type assertions everywhere, because TS doesn't narrow down discriminated union type when >= is used
    // Changing it to (data.version === 2 || data.version === 3 || data.version === 4 || data.version === 5) would be inefficient code
    (data as PartialV4).sxHeight = buffer.readInt16();
    (data as PartialV4).sCapHeight = buffer.readInt16();
    (data as PartialV4).usDefaultChar = buffer.readUInt16();
    (data as PartialV4).usBreakChar = buffer.readUInt16();
    (data as PartialV4).usMaxContext = buffer.readUInt16();
  }
  if (data.version === 5) {
    data.usLowerOpticalPointSize = buffer.readUInt16();
    data.usUpperOpticalPointSize = buffer.readUInt16();
  }
  return data as Os2TableV1 | Os2TableV4 | Os2TableV5;
}

function readPanose(buffer: FontBuffer): Panose {
  return {
    familyType: buffer.readUInt8(),
    serifStyle: buffer.readUInt8(),
    weight: buffer.readUInt8(),
    proportion: buffer.readUInt8(),
    contrast: buffer.readUInt8(),
    strokeVariation: buffer.readUInt8(),
    armStyle: buffer.readUInt8(),
    letterform: buffer.readUInt8(),
    midline: buffer.readUInt8(),
    xHeight: buffer.readUInt8(),
  };
}
