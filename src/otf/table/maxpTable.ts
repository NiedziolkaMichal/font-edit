import { FontBuffer } from "../../io/buffer";
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
  const version = buffer.readVersion();
  if (version === 0.5) {
    return {
      version: 0.5,
      numGlyphs: buffer.readUInt16(),
    };
  } else if (version === 1) {
    return readV1(buffer);
  } else {
    throw new FontCorruptedError(`Invalid MAXP version ${version}`);
  }
}

function readV1(buffer: FontBuffer) {
  return {
    version: 1,
    numGlyphs: buffer.readUInt16(),
    maxPoints: buffer.readUInt16(),
    maxContours: buffer.readUInt16(),
    maxCompositePoints: buffer.readUInt16(),
    maxCompositeContours: buffer.readUInt16(),
    maxZones: buffer.readUInt16(),
    maxTwilightPoints: buffer.readUInt16(),
    maxStorage: buffer.readUInt16(),
    maxFunctionDefs: buffer.readUInt16(),
    maxInstructionDefs: buffer.readUInt16(),
    maxStackElements: buffer.readUInt16(),
    maxSizeOfInstructions: buffer.readUInt16(),
    maxComponentElements: buffer.readUInt16(),
    maxComponentDepth: buffer.readUInt16(),
  } as const;
}
