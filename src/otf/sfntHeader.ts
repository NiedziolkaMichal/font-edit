import { FontBuffer } from "../io/buffer";
import { NotSupportedException } from "../error/NotSupportedException";

export enum Version {
  /** TrueTypeCollection */
  TTC = 0x74746366,
  /** TrueType Version 1 */
  TTV1 = 0x00010000,
  /** TrueType Version 2 */
  TTV2 = 0x74727565,
  /** OpenType Font */
  OT = 0x4f54544f,
}

export interface Header {
  /** sfntVersion */
  version: Version;
  /** Number of Tables */
  tablesCount: number;
  /** Maximum power of 2 less than or equal to tablesCount, times 16 */
  readonly searchRange: number;
  /** Log2 of the maximum power of 2 less than or equal to tablesCount (log2(searchRange/16), which is equal to floor(log2(tablesCount))) */
  readonly entrySelector: number;
  /** tablesCount times 16, minus searchRange */
  readonly rangeShift: number;
}

export function readHeader(buffer: FontBuffer): Header {
  const version = buffer.readUInt32();

  assertCorrectVersion(version);
  if (!isSupportedVersion(version)) {
    throw new NotSupportedException(`OTF Version ${version}`);
  }

  const tablesCount = buffer.readUInt16();
  //TODO in future it's better to simply move reader position, rather than verifying input
  const searchRange = buffer.readUInt16();
  const entrySelector = buffer.readUInt16();
  const rangeShift = buffer.readUInt16();

  const header = createHeader(version, tablesCount);

  assertInputCorrect("searchRange", searchRange, header.searchRange);
  assertInputCorrect("entrySelector", entrySelector, header.entrySelector);
  assertInputCorrect("rangeShift", rangeShift, header.rangeShift);

  return header;
}

function createHeader(version: Version, tablesCount: number) {
  return {
    version,
    tablesCount,
    get searchRange() {
      return closestMaxPowerOfTwo(this.tablesCount) * 16;
    },
    get entrySelector() {
      return Math.floor(Math.log2(closestMaxPowerOfTwo(this.tablesCount)));
    },
    get rangeShift() {
      return this.tablesCount * 16 - this.searchRange;
    },
  };
}

function assertCorrectVersion(versionTag: number): asserts versionTag is Version {
  if (!Version[versionTag]) throw new NotSupportedException(`OTF Version ${versionTag}`);
}

function assertInputCorrect(name: string, input: number, calculatedVal: number) {
  if (input !== calculatedVal) {
    throw new Error(`Header value ${name} has been incorrectly calculated`);
  }
}

function isSupportedVersion(version: Version) {
  return version === Version.TTV1;
}

function closestMaxPowerOfTwo(max: number) {
  return 1 << (31 - Math.clz32(max));
}
