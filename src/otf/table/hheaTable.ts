import { assertBufferEmpty, FontBuffer, readInt16, readUInt16, readVersion } from "../../io/buffer";
import { assertEqual } from "../../util/errors";

export interface HheaTable {
  /** Typographic ascent—see note below. */
  ascender: number;
  /** Typographic descent—see note below. */
  descender: number;
  /** Typographic line gap. Negative LineGap values are treated as zero in some legacy platform implementations. */
  lineGap: number;
  /** Maximum advance width value in 'hmtx' table. */
  advanceWidthMax: number;
  /** Minimum left sidebearing value in 'hmtx' table for glyphs with contours (empty glyphs should be ignored). */
  minLeftSideBearing: number;
  /** Minimum right sidebearing value; calculated as min(aw - (lsb + xMax - xMin)) for glyphs with contours (empty glyphs should be ignored). */
  minRightSideBearing: number;
  /** Max(lsb + (xMax - xMin)). */
  xMaxExtent: number;
  /** Used to calculate the slope of the cursor (rise/run); 1 for vertical. */
  caretSlopeRise: number;
  /** 0 for vertical. */
  caretSlopeRun: number;
  /** The amount by which a slanted highlight on a glyph needs to be shifted to produce the best appearance. Set to 0 for non-slanted fonts */
  caretOffset: number;
  /** 0 for current format. */
  metricDataFormat: number;
  /** Number of hMetric entries in 'hmtx' table */
  numberOfHMetrics: number;
}

//TODO some of those fields should be calculated dynamically

export function readHheaTable(buffer: FontBuffer): HheaTable {
  const { version, r1, r2, r3, r4, ...data } = read(buffer);
  assertEqual("HHEA version", version, 1);
  assertEqual("HHEA reserved", r1 + r2 + r3 + r4, 0);
  assertBufferEmpty(buffer, "HHEA");
  return data;
}

function read(buffer: FontBuffer) {
  return {
    version: readVersion(buffer),
    ascender: readInt16(buffer),
    descender: readInt16(buffer),
    lineGap: readInt16(buffer),
    advanceWidthMax: readUInt16(buffer),
    minLeftSideBearing: readInt16(buffer),
    minRightSideBearing: readInt16(buffer),
    xMaxExtent: readInt16(buffer),
    caretSlopeRise: readInt16(buffer),
    caretSlopeRun: readInt16(buffer),
    caretOffset: readInt16(buffer),
    r1: readInt16(buffer),
    r2: readInt16(buffer),
    r3: readInt16(buffer),
    r4: readInt16(buffer),
    metricDataFormat: readInt16(buffer),
    numberOfHMetrics: readUInt16(buffer),
  };
}
