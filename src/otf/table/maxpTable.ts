import { assertBufferEmpty, FontBuffer, readUInt16, readVersion } from "../../io/buffer";
import { FontCorruptedError } from "../../util/errors";

export interface MaxpTableV05 {
  version: 0.5;
  /** The number of glyphs in the font. */
  numGlyphs: number;
}
export interface MaxpTableV1 {
  version: 1;
  /** The number of glyphs in the font. */
  numGlyphs: number;
  /** Maximum points in a non-composite glyph. */
  maxPoints: number;
  /** Maximum contours in a non-composite glyph. */
  maxContours: number;
  /** Maximum points in a composite glyph. */
  maxCompositePoints: number;
  /** Maximum contours in a composite glyph. */
  maxCompositeContours: number;
  /** 1 if instructions do not use the twilight zone (Z0), or 2 if instructions do use Z0; should be set to 2 in most cases. */
  maxZones: number;
  /** Maximum points used in Z0. */
  maxTwilightPoints: number;
  /** Number of Storage Area locations. */
  maxStorage: number;
  /** Number of FDEFs, equal to the highest function number + 1. */
  maxFunctionDefs: number;
  /** Number of IDEFs. */
  maxInstructionDefs: number;
  /** Maximum stack depth across Font Program ('fpgm' table), CVT Program ('prep' table) and all glyph instructions (in the 'glyf' table). */
  maxStackElements: number;
  /** Maximum byte count for glyph instructions. */
  maxSizeOfInstructions: number;
  /** Maximum number of components referenced at “top level” for any composite glyph. */
  maxComponentElements: number;
  /** Maximum levels of recursion; 1 for simple components. */
  maxComponentDepth: number;
}

export function readMaxpTable(buffer: FontBuffer): MaxpTableV1 | MaxpTableV05 {
  const version = readVersion(buffer);
  let data: MaxpTableV1 | MaxpTableV05 | undefined = undefined;
  if (version === 0.5) {
    data = {
      version: 0.5,
      numGlyphs: readUInt16(buffer),
    };
  } else if (version === 1) {
    data = readV1(buffer);
  } else {
    throw new FontCorruptedError(`Invalid MAXP version ${version}`);
  }
  assertBufferEmpty(buffer, "MAXP");
  return data;
}

function readV1(buffer: FontBuffer) {
  return {
    version: 1,
    numGlyphs: readUInt16(buffer),
    maxPoints: readUInt16(buffer),
    maxContours: readUInt16(buffer),
    maxCompositePoints: readUInt16(buffer),
    maxCompositeContours: readUInt16(buffer),
    maxZones: readUInt16(buffer),
    maxTwilightPoints: readUInt16(buffer),
    maxStorage: readUInt16(buffer),
    maxFunctionDefs: readUInt16(buffer),
    maxInstructionDefs: readUInt16(buffer),
    maxStackElements: readUInt16(buffer),
    maxSizeOfInstructions: readUInt16(buffer),
    maxComponentElements: readUInt16(buffer),
    maxComponentDepth: readUInt16(buffer),
  } as const;
}
