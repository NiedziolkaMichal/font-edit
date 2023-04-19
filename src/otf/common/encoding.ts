import { NotSupportedError } from "../../util/errors";

export enum EncodingPlatformId {
  UNICODE = 0,
  MACINTOSH = 1,
  WINDOWS = 3,
}

const ENCODING_UNICODE = "utf-16be";
const MACINTOSH_ENCODING_IDS = ["x-mac-roman"]; //TODO plenty are missing
const WINDOWS_ENCODING_IDS = ["utf-16be", "utf-16be", "SJIS", "GBK", "big5", "euc-kr", "johab" /* 3x reserved */, , , , "utf-16"];

export function getEncoding(platformId: EncodingPlatformId, encodingId: number) {
  const encoding = () => {
    switch (platformId) {
      case EncodingPlatformId.UNICODE:
        return ENCODING_UNICODE;
      case EncodingPlatformId.MACINTOSH:
        return MACINTOSH_ENCODING_IDS[encodingId];
      case EncodingPlatformId.WINDOWS:
        return WINDOWS_ENCODING_IDS[encodingId];
      default:
        throw new NotSupportedError(`Encoding platform id ${platformId}`);
    }
  };
  const e = encoding();
  if (e) return e;
  throw new NotSupportedError(`Encoding ${encodingId} for platform ${platformId}`);
}

export function decodeString(bytes: BufferSource, platformId: EncodingPlatformId, encodingId: number): string;
export function decodeString(bytes: BufferSource, encoding: string): string;
export function decodeString(bytes: BufferSource, encodingOrPlatformId: string | number, encodingId?: number) {
  const encoding = typeof encodingId === "number" ? getEncoding(encodingOrPlatformId as EncodingPlatformId, encodingId) : (encodingOrPlatformId as string);
  const decoder = new TextDecoder(encoding);
  return decoder.decode(bytes);
}
