import { bufferAvailable, FontBuffer, readFixed, readInt16, readString, readUInt16, readUInt32, readUInt8, readVersion } from "../../io/buffer";
import { arrayFrom } from "../../util/misc";
import { NotSupportedError } from "../../util/errors";

interface PostTable {
  version: 1 | 3;
  italicAngle: number;
  underlinePosition: number;
  underlineThickness: number;
  isFixedPitch: number;
  minMemType42: number;
  maxMemType42: number;
  minMemType1: number;
  maxMemType1: number;
}

type PostTableV2 = Omit<PostTable, "version"> & {
  version: 2;
  /**
   * Name of each glyph. In case value is a number, name can be retrieved by usage of getStandardGlyphName.
   * Name can be empty string.
   */
  stringData: (string | number)[];
};

export function readPostTable(buffer: FontBuffer): PostTable | PostTableV2 {
  const header: Omit<PostTable, "version"> & { version: number } = readHeader(buffer);
  const version = header.version;
  if (version === 2) {
    const stringData = readV2StringData(buffer);
    return {
      ...header,
      version,
      stringData,
    };
  } else if (version !== 1 && version !== 3) {
    //TODO version 2.5
    throw new NotSupportedError(`Post version ${version}`);
  }
  return header as PostTable; // Type assertion is used, because header.version is not recognized to be 1 | 3
}

function readHeader(buffer: FontBuffer) {
  return {
    version: readVersion(buffer),
    italicAngle: readFixed(buffer),
    underlinePosition: readInt16(buffer),
    underlineThickness: readInt16(buffer),
    isFixedPitch: readUInt32(buffer),
    minMemType42: readUInt32(buffer),
    maxMemType42: readUInt32(buffer),
    minMemType1: readUInt32(buffer),
    maxMemType1: readUInt32(buffer),
  };
}

function readV2StringData(buffer: FontBuffer) {
  const numGlyphs = readUInt16(buffer); //TODO this should be the same value as in maxp table
  const glyphNameIndex = arrayFrom(numGlyphs, () => readUInt16(buffer));
  return arrayFrom(numGlyphs, (index) => {
    const nameIndex = glyphNameIndex[index];
    if (nameIndex < 258 || nameIndex > 65535) {
      return nameIndex;
    }
    // Caudex-Regular.ttf seems to have a corrupted list of names
    if (bufferAvailable(buffer) < 1) {
      return "";
    }
    const length = readUInt8(buffer);
    return readString(buffer, length);
  });
}
