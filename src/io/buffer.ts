import { arrayFrom } from "../util/misc";
import { FontCorruptedError } from "../util/errors";

/* Difference between UNIX time and number of seconds since 12:00 midnight, January 1, 1904, UTC */
const YEAR_1904_EPOCH = 2082844800;

export function readInt32(buffer: FontBuffer) {
  const val = buffer._dataView.getInt32(buffer._pos);
  buffer._pos += 4;
  return val;
}

export function readUInt32(buffer: FontBuffer) {
  const val = buffer._dataView.getUint32(buffer._pos);
  buffer._pos += 4;
  return val;
}

export function readInt16(buffer: FontBuffer) {
  const val = buffer._dataView.getInt16(buffer._pos);
  buffer._pos += 2;
  return val;
}

export function readUInt16(buffer: FontBuffer) {
  const val = buffer._dataView.getUint16(buffer._pos);
  buffer._pos += 2;
  return val;
}

export function readInt8(buffer: FontBuffer) {
  return buffer._dataView.getInt8(buffer._pos++);
}

export function readUInt8(buffer: FontBuffer) {
  return buffer._dataView.getUint8(buffer._pos++);
}

export function readBytes(buffer: FontBuffer, length: number) {
  return arrayFrom(length, () => readUInt8(buffer));
}

export function extractBytes(buffer: FontBuffer, length: number) {
  const val = new DataView(buffer._dataView.buffer, buffer._dataView.byteOffset + buffer._pos, length);
  buffer._pos += length;
  return val;
}

export function readFixed(buffer: FontBuffer) {
  const decimal = readInt16(buffer);
  const fraction = readUInt16(buffer);
  return Math.round((decimal + fraction / 65535) * 1000) / 1000;
}

export function readLongDateTime(buffer: FontBuffer) {
  const leading = readInt32(buffer);
  const trailing = readUInt32(buffer);
  const int64 = (leading << 32) + trailing;

  return new Date((int64 - YEAR_1904_EPOCH) * 1000);
}

export function readVersion(buffer: FontBuffer) {
  const decimal = readInt16(buffer);
  const fraction = readUInt16(buffer);
  return decimal + fraction / 0x1000 / 10;
}

export function readTag(buffer: FontBuffer) {
  return readString(buffer, 4);
}

export function readString(buffer: FontBuffer, amountOfBytes: number) {
  return String.fromCharCode(...readBytes(buffer, amountOfBytes));
}

export function bufferTotalSize(buffer: FontBuffer) {
  return buffer._dataView.byteLength;
}

export function bufferAvailable(buffer: FontBuffer) {
  return bufferTotalSize(buffer) - buffer._pos;
}

export function assertBufferEmpty(buffer: FontBuffer, tableName: string) {
  if (buffer._dataView.byteLength - buffer._pos !== 0) {
    throw new FontCorruptedError(`Invalid additional data in ${tableName} table`);
  }
}

export class FontBuffer {
  _dataView;
  public _pos: number;

  constructor(arrayBuffer: ArrayBufferLike | DataView) {
    this._dataView = arrayBuffer instanceof DataView ? arrayBuffer : new DataView(arrayBuffer);
    this._pos = 0;
  }
}
