import { arrayFrom } from "../util/misc";
import { FontCorruptedError } from "../util/errors";

/* Difference between UNIX time and number of seconds since 12:00 midnight, January 1, 1904, UTC */
const YEAR_1904_EPOCH = 2082844800;

export class FontBuffer {
  private dataView;
  public pos: number;

  constructor(arrayBuffer: ArrayBufferLike | DataView) {
    this.dataView = arrayBuffer instanceof DataView ? arrayBuffer : new DataView(arrayBuffer);
    this.pos = 0;
  }

  readInt32() {
    const val = this.dataView.getInt32(this.pos);
    this.pos += 4;
    return val;
  }

  readUInt32() {
    const val = this.dataView.getUint32(this.pos);
    this.pos += 4;
    return val;
  }

  readInt16() {
    const val = this.dataView.getInt16(this.pos);
    this.pos += 2;
    return val;
  }

  readUInt16() {
    const val = this.dataView.getUint16(this.pos);
    this.pos += 2;
    return val;
  }

  readInt8() {
    return this.dataView.getInt8(this.pos++);
  }

  readUInt8() {
    return this.dataView.getUint8(this.pos++);
  }

  readBytes(length: number) {
    return arrayFrom(length, () => this.readUInt8());
  }

  extractBytes(length: number) {
    const val = new DataView(this.dataView.buffer, this.dataView.byteOffset + this.pos, length);
    this.pos += length;
    return val;
  }

  readFixed() {
    const decimal = this.readInt16();
    const fraction = this.readUInt16();
    return Math.round((decimal + fraction / 65535) * 1000) / 1000;
  }

  readLongDateTime() {
    const leading = this.readInt32();
    const trailing = this.readUInt32();
    const int64 = (leading << 32) + trailing;

    return new Date((int64 - YEAR_1904_EPOCH) * 1000);
  }

  readVersion() {
    const decimal = this.readInt16();
    const fraction = this.readUInt16();
    return decimal + fraction / 0x1000 / 10;
  }

  getTotalSize() {
    return this.dataView.byteLength;
  }

  assertEmpty(tableName: string) {
    if (this.dataView.byteLength - this.pos !== 0) {
      throw new FontCorruptedError(`Invalid additional data in ${tableName} table`);
    }
  }
}
