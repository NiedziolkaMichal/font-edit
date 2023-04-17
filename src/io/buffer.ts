export class FontBuffer {
  private dataView;
  private pos: number;

  constructor(arrayBuffer: ArrayBufferLike) {
    this.dataView = new DataView(arrayBuffer);
    this.pos = 0;
  }

  readUInt32() {
    const val = this.dataView.getUint32(this.pos, false);
    this.pos += 4;
    return val;
  }

  readUInt16() {
    const val = this.dataView.getUint16(this.pos, false);
    this.pos += 2;
    return val;
  }
}
