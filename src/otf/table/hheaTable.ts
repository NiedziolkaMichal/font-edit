import { FontBuffer } from "../../io/buffer";
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
  buffer.assertEmpty("HHEA");
  return data;
}

function read(buffer: FontBuffer) {
  return {
    version: buffer.readVersion(),
    ascender: buffer.readInt16(),
    descender: buffer.readInt16(),
    lineGap: buffer.readInt16(),
    advanceWidthMax: buffer.readUInt16(),
    minLeftSideBearing: buffer.readInt16(),
    minRightSideBearing: buffer.readInt16(),
    xMaxExtent: buffer.readInt16(),
    caretSlopeRise: buffer.readInt16(),
    caretSlopeRun: buffer.readInt16(),
    caretOffset: buffer.readInt16(),
    r1: buffer.readInt16(),
    r2: buffer.readInt16(),
    r3: buffer.readInt16(),
    r4: buffer.readInt16(),
    metricDataFormat: buffer.readInt16(),
    numberOfHMetrics: buffer.readUInt16(),
  };
}
