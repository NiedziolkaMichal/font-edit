import { FontBuffer } from "../../io/buffer";
import { assertEqual } from "../../util/errors";
import { parseFlags } from "../../io/parseUtil";

const EXPECTED_MAGIC_NUMBER = 0x5f0f3cf5;

export interface HeadTable {
  majorVersion: number;
  minorVersion: number;
  fontRevision: number;
  flags: HeadFlags;
  unitsPerEm: number;
  created: Date;
  modified: Date;
  xMin: number;
  yMin: number;
  xMax: number;
  yMax: number;
  macStyle: MacStyle;
  lowestRecPPEM: number;
  fontDirectionHint: number;
  indexToLocFormat: number;
  glyphDataFormat: number;
}

export interface HeadFlags {
  /** Bit 0: Baseline for font at y=0 */
  baselineAtY0?: boolean;
  /** Bit1: Left sidebearing point at x=0 (relevant only for TrueType rasterizers) */
  leftAtX0?: boolean;
  /** Bit 2: Instructions may depend on point size */
  instructionsDependOnPointSize?: boolean;
  /** Bit 3: Force ppem to integer values for all internal scaler math; may use fractional ppem sizes if this bit is clear. It is strongly recommended that this be set in hinted fonts. */
  forcePpemToInt?: boolean;
  /** Bit 4: Instructions may alter advance width (the advance widths might not scale linearly) */
  instructionsAlterAdvanceWidth?: boolean;
  "5"?: boolean;
  "6"?: boolean;
  "7"?: boolean;
  "8"?: boolean;
  "9"?: boolean;
  "10"?: boolean;
  /** Bit 11: Font data is “lossless” as a result of having been subjected to optimizing transformation and/or compression (such as e.g. compression mechanisms defined by ISO/IEC 14496-18, MicroType Express, WOFF 2.0 or similar) where the original font functionality and features are retained but the binary compatibility between input and output font files is not guaranteed. As a result of the applied transform, the DSIG table may also be invalidated. */
  lossless?: boolean;
  /** Bit 12: Font converted (produce compatible metrics) */
  converted?: boolean;
  /** Bit 13: Font optimized for ClearType™. Note, fonts that rely on embedded bitmaps (EBDT) for rendering should not be considered optimized for ClearType, and therefore should keep this bit cleared */
  clearTypeOptimized?: boolean;
  /** Bit 14: Last Resort font. If set, indicates that the glyphs encoded in the 'cmap' subtables are simply generic symbolic representations of code point ranges and don’t truly represent support for those code points. If unset, indicates that the glyphs encoded in the 'cmap' subtables represent proper support for those code points */
  lastResort?: boolean;
  "15"?: boolean;
}

export const HEAD_FLAG_NAMES: Array<keyof HeadFlags | undefined> = ["baselineAtY0", "leftAtX0", "instructionsDependOnPointSize", "forcePpemToInt", "instructionsAlterAdvanceWidth", "5", "6", "7", "8", "9", "10", "lossless", "converted", "clearTypeOptimized", "lastResort", "15"];

export interface MacStyle {
  /** Bit 0 */
  bold?: boolean;
  /** Bit 1 */
  italic?: boolean;
  /** Bit 2 */
  underline?: boolean;
  /** Bit 3 */
  outline?: boolean;
  /** Bit 4 */
  shadow?: boolean;
  /** Bit 5 */
  condensed?: boolean;
  /** Bit 6 */
  extended?: boolean;
}

export const HEAD_MAC_STYLE_NAMES: Array<keyof MacStyle | undefined> = ["bold", "italic", "underline", "outline", "shadow", "condensed", "extended"];

export function readHeadTable(buffer: FontBuffer): HeadTable {
  const data = read(buffer);
  const { checksumAdjustment, magicNumber, flags, macStyle, ...other } = data;

  //TODO calculate checksum
  assertEqual("Head table magic number", magicNumber, EXPECTED_MAGIC_NUMBER);
  const parsedFlags = parseHeadFlags(flags);
  const parsedMacStyle = parseMacStyles(macStyle);

  return {
    ...other,
    flags: parsedFlags,
    macStyle: parsedMacStyle,
  };
}

function read(buffer: FontBuffer) {
  return {
    majorVersion: buffer.readUInt16(),
    minorVersion: buffer.readUInt16(),
    fontRevision: buffer.readFixed(),
    checksumAdjustment: buffer.readUInt32(),
    magicNumber: buffer.readUInt32(),
    flags: buffer.readUInt16(),
    unitsPerEm: buffer.readUInt16(),
    created: buffer.readLongDateTime(),
    modified: buffer.readLongDateTime(),
    xMin: buffer.readInt16(),
    yMin: buffer.readInt16(),
    xMax: buffer.readInt16(),
    yMax: buffer.readInt16(),
    macStyle: buffer.readUInt16(),
    lowestRecPPEM: buffer.readUInt16(),
    fontDirectionHint: buffer.readInt16(),
    indexToLocFormat: buffer.readInt16(),
    glyphDataFormat: buffer.readInt16(),
  };
}

function parseHeadFlags(flag: number) {
  return parseFlags(flag, HEAD_FLAG_NAMES, 15, "Head Flags");
}

function parseMacStyles(flag: number) {
  return parseFlags(flag, HEAD_MAC_STYLE_NAMES, 15, "Head MacStyle");
}
