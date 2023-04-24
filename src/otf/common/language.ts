import { assertEqual } from "../../util/errors";
import { EncodingPlatformId } from "./encoding";

const LANGUAGE_ID_ENGLISH = 1033;
const LANGUAGE_TAG_ENGLISH = "en-US";

export function getDefaultLanguageTag() {
  return LANGUAGE_TAG_ENGLISH;
}

export function getLanguageTag(platformId: EncodingPlatformId, languageId: number) {
  assertEqual("PlatformId", platformId, EncodingPlatformId.WINDOWS);
  assertEqual("LanguageId", languageId, LANGUAGE_ID_ENGLISH);
  return LANGUAGE_TAG_ENGLISH;
}
