import { arrayFrom } from "../util/misc";

export class FontBuffer {
  private dataView;
  public pos: number;

  constructor(arrayBuffer: ArrayBufferLike | DataView) {
    this.dataView = arrayBuffer instanceof DataView ? arrayBuffer : new DataView(arrayBuffer);
    this.pos = 0;
  }

  readUInt32() {
    const val = this.dataView.getUint32(this.pos);
    this.pos += 4;
    return val;
  }

  readUInt16() {
    const val = this.dataView.getUint16(this.pos);
    this.pos += 2;
    return val;
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

  getTotalSize() {
    return this.dataView.byteLength;
  }
}
