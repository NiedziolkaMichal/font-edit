import { assertEqual } from "../../util/errors";

export const enum EncodingPlatformId {
  UNICODE = 0,
  MACINTOSH = 1,
  WINDOWS = 3,
}

const BASE_ENCODING_ID = 1;
const BASE_ENCODING = "utf-16be";

export function decodeString(bytes: BufferSource, platformId: EncodingPlatformId, encodingId: number): string {
  assertEqual("PlatformId", platformId, EncodingPlatformId.WINDOWS);
  assertEqual("EncodingId", encodingId, BASE_ENCODING_ID);
  const decoder = new TextDecoder(BASE_ENCODING);
  return decoder.decode(bytes);
}
