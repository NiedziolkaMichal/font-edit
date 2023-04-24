import { readSync } from "./io/fsLoader";
import { readOpenType } from "./otf/otfReader";

export function loadSync(path: string) {
  const content = readSync(path).buffer;
  return load(content);
}

export function load(buffer: ArrayBufferLike) {
  return readOpenType(buffer);
}

/**
 * This function returns Macintosh standard glyph names for indices 0-258.
 * Use it to get missing Glyph Names of stringData property from POST table.
 */
export { getStandardGlyphName } from "./otf/common/standardGlyphNames";
