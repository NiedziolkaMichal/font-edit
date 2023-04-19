import { NotSupportedError } from "../../util/errors";

export enum EncodingPlatformId {
  UNICODE = 0,
  MACINTOSH = 1,
  WINDOWS = 3,
}

/** List taken from https://learn.microsoft.com/en-us/typography/opentype/spec/name */
export const MACINTOSH_LANGUAGE_CODES = ["en", "fr", "de", "it", "nl", "sv", "es", "da", "pt", "no", "he", "ja", "ar", "fi", "el", "is", "mt", "tr", "hr", "zh-Hant", "ur", "hi", "th", "ko", "lt", "pl", "hu", "es", "lv", "se", "fo", "fa", "ru", "zh", "nl-BE", "ga", "sq", "ro", "cz", "sk", "si", "yi", "sr", "mk", "bg", "uk", "be", "uz", "kk", "az-Cyrl", "az-Arab", "hy", "ka", "mo", "ky", "tg", "tk", "mn-CN", "mn", "ps", "ks", "ku", "sd", "bo", "ne", "sa", "mr", "bn", "as", "gu", "pa", "or", "ml", "kn", "ta", "te", "si", "my", "km", "lo", "vi", "id", "tl", "ms", "ms-Arab", "am", "ti", "om", "so", "sw", "rw", "rn", "ny", "mg", "eo", "cy", "eu", "ca", "la", "qu", "gn", "ay", "tt", "ug", "dz", "jv", "su", "gl", "af", "br", "iu", "gd", "gv", "ga", "to", "el-polyton", "kl", "az"];

/** List taken from https://learn.microsoft.com/en-us/openspecs/office_standards/ms-oe376/6c085406-a698-4e12-9d4d-c3b0ee3dbc4a */
export const WINDOWS_LANGUAGE_CODES: Record<number, string> = {
  /** Arabic - Saudi Arabia */
  1025: "ar-SA",
  /** Bulgarian */
  1026: "bg-BG",
  /** Catalan */
  1027: "ca-ES",
  /** Chinese - Taiwan */
  1028: "zh-TW",
  /** Czech */
  1029: "cs-CZ",
  /** Danish */
  1030: "da-DK",
  /** German - Germany */
  1031: "de-DE",
  /** Greek */
  1032: "el-GR",
  /** English - United States */
  1033: "en-US",
  /** Spanish - Spain (Traditional Sort) */
  1034: "es-ES",
  /** Finnish */
  1035: "fi-FI",
  /** French - France */
  1036: "fr-FR",
  /** Hebrew */
  1037: "he-IL",
  /** Hungarian */
  1038: "hu-HU",
  /** Icelandic */
  1039: "is-IS",
  /** Italian - Italy */
  1040: "it-IT",
  /** Japanese */
  1041: "ja-JP",
  /** Korean */
  1042: "ko-KR",
  /** Dutch - Netherlands */
  1043: "nl-NL",
  /** Norwegian (Bokmål) */
  1044: "nb-NO",
  /** Polish */
  1045: "pl-PL",
  /** Portuguese - Brazil */
  1046: "pt-BR",
  /** Rhaeto-Romanic */
  1047: "rm-CH",
  /** Romanian */
  1048: "ro-RO",
  /** Russian */
  1049: "ru-RU",
  /** Croatian */
  1050: "hr-HR",
  /** Slovak */
  1051: "sk-SK",
  /** Albanian - Albania */
  1052: "sq-AL",
  /** Swedish */
  1053: "sv-SE",
  /** Thai */
  1054: "th-TH",
  /** Turkish */
  1055: "tr-TR",
  /** Urdu - Pakistan */
  1056: "ur-PK",
  /** Indonesian */
  1057: "id-ID",
  /** Ukrainian */
  1058: "uk-UA",
  /** Belarusian */
  1059: "be-BY",
  /** Slovenian */
  1060: "sl-SI",
  /** Estonian */
  1061: "et-EE",
  /** Latvian */
  1062: "lv-LV",
  /** Lithuanian */
  1063: "lt-LT",
  /** Tajik */
  1064: "tg-Cyrl-TJ",
  /** Persian */
  1065: "fa-IR",
  /** Vietnamese */
  1066: "vi-VN",
  /** Armenian - Armenia */
  1067: "hy-AM",
  /** Azeri (Latin) */
  1068: "az-Latn-AZ",
  /** Basque */
  1069: "eu-ES",
  /** Sorbian */
  1070: "wen-DE",
  /** F.Y.R.O. Macedonian */
  1071: "mk-MK",
  /** Sutu */
  1072: "st-ZA",
  /** Tsonga */
  1073: "ts-ZA",
  /** Tswana */
  1074: "tn-ZA",
  /** Venda */
  1075: "ven-ZA",
  /** Xhosa */
  1076: "xh-ZA",
  /** Zulu */
  1077: "zu-ZA",
  /** Afrikaans - South Africa */
  1078: "af-ZA",
  /** Georgian */
  1079: "ka-GE",
  /** Faroese */
  1080: "fo-FO",
  /** Hindi */
  1081: "hi-IN",
  /** Maltese */
  1082: "mt-MT",
  /** Sami */
  1083: "se-NO",
  /** Gaelic (Scotland) */
  1084: "gd-GB",
  /** Yiddish */
  1085: "yi",
  /** Malay - Malaysia */
  1086: "ms-MY",
  /** Kazakh */
  1087: "kk-KZ",
  /** Kyrgyz (Cyrillic) */
  1088: "ky-KG",
  /** Swahili */
  1089: "sw-KE",
  /** Turkmen */
  1090: "tk-TM",
  /** Uzbek (Latin) */
  1091: "uz-Latn-UZ",
  /** Tatar */
  1092: "tt-RU",
  /** Bengali (India) */
  1093: "bn-IN",
  /** Punjabi */
  1094: "pa-IN",
  /** Gujarati */
  1095: "gu-IN",
  /** Oriya */
  1096: "or-IN",
  /** Tamil */
  1097: "ta-IN",
  /** Telugu */
  1098: "te-IN",
  /** Kannada */
  1099: "kn-IN",
  /** Malayalam */
  1100: "ml-IN",
  /** Assamese */
  1101: "as-IN",
  /** Marathi */
  1102: "mr-IN",
  /** Sanskrit */
  1103: "sa-IN",
  /** Mongolian (Cyrillic) */
  1104: "mn-MN",
  /** Tibetan - People's Republic of China */
  1105: "bo-CN",
  /** Welsh */
  1106: "cy-GB",
  /** Khmer */
  1107: "km-KH",
  /** Lao */
  1108: "lo-LA",
  /** Burmese */
  1109: "my-MM",
  /** Galician */
  1110: "gl-ES",
  /** Konkani */
  1111: "kok-IN",
  /** Manipuri */
  1112: "mni",
  /** Sindhi - India */
  1113: "sd-IN",
  /** Syriac */
  1114: "syr-SY",
  /** Sinhalese - Sri Lanka */
  1115: "si-LK",
  /** Cherokee - United States */
  1116: "chr-US",
  /** Inuktitut */
  1117: "iu-Cans-CA",
  /** Amharic - Ethiopia */
  1118: "am-ET",
  /** Tamazight (Arabic) */
  1119: "tmz",
  /** Kashmiri (Arabic) */
  1120: "ks-Arab-IN",
  /** Nepali */
  1121: "ne-NP",
  /** Frisian - Netherlands */
  1122: "fy-NL",
  /** Pashto */
  1123: "ps-AF",
  /** Filipino */
  1124: "fil-PH",
  /** Divehi */
  1125: "dv-MV",
  /** Edo */
  1126: "bin-NG",
  /** Fulfulde - Nigeria */
  1127: "fuv-NG",
  /** Hausa - Nigeria */
  1128: "ha-Latn-NG",
  /** Ibibio - Nigeria */
  1129: "ibb-NG",
  /** Yoruba */
  1130: "yo-NG",
  /** Quecha - Bolivia */
  1131: "quz-BO",
  /** Sepedi */
  1132: "nso-ZA",
  /** Igbo - Nigeria */
  1136: "ig-NG",
  /** Kanuri - Nigeria */
  1137: "kr-NG",
  /** Oromo */
  1138: "gaz-ET",
  /** Tigrigna - Ethiopia */
  1139: "ti-ER",
  /** Guarani - Paraguay */
  1140: "gn-PY",
  /** Hawaiian - United States */
  1141: "haw-US",
  /** Latin */
  1142: "la",
  /** Somali */
  1143: "so-SO",
  /** Yi */
  1144: "ii-CN",
  /** Papiamentu */
  1145: "pap-AN",
  /** Uighur - China */
  1152: "ug-Arab-CN",
  /** Maori - New Zealand */
  1153: "mi-NZ",
  /** Arabic - Iraq */
  2049: "ar-IQ",
  /** Chinese - People's Republic of China */
  2052: "zh-CN",
  /** German - Switzerland */
  2055: "de-CH",
  /** English - United Kingdom */
  2057: "en-GB",
  /** Spanish - Mexico */
  2058: "es-MX",
  /** French - Belgium */
  2060: "fr-BE",
  /** Italian - Switzerland */
  2064: "it-CH",
  /** Dutch - Belgium */
  2067: "nl-BE",
  /** Norwegian (Nynorsk) */
  2068: "nn-NO",
  /** Portuguese - Portugal */
  2070: "pt-PT",
  /** Romanian - Moldava */
  2072: "ro-MD",
  /** Russian - Moldava */
  2073: "ru-MD",
  /** Serbian (Latin) */
  2074: "sr-Latn-CS",
  /** Swedish - Finland */
  2077: "sv-FI",
  /** Urdu - India */
  2080: "ur-IN",
  /** Azeri (Cyrillic) */
  2092: "az-Cyrl-AZ",
  /** Gaelic (Ireland) */
  2108: "ga-IE",
  /** Malay - Brunei Darussalam */
  2110: "ms-BN",
  /** Uzbek (Cyrillic) */
  2115: "uz-Cyrl-UZ",
  /** Bengali (Bangladesh) */
  2117: "bn-BD",
  /** Punjabi (Pakistan) */
  2118: "pa-PK",
  /** Mongolian (Mongolian) */
  2128: "mn-Mong-CN",
  /** Tibetan - Bhutan */
  2129: "bo-BT",
  /** Sindhi - Pakistan */
  2137: "sd-PK",
  /** Tamazight (Latin) */
  2143: "tzm-Latn-DZ",
  /** Kashmiri (Devanagari) */
  2144: "ks-Deva-IN",
  /** Nepali - India */
  2145: "ne-IN",
  /** Quecha - Ecuador */
  2155: "quz-EC",
  /** Tigrigna - Eritrea */
  2163: "ti-ET",
  /** Arabic - Egypt */
  3073: "ar-EG",
  /** Chinese - Hong Kong SAR */
  3076: "zh-HK",
  /** German - Austria */
  3079: "de-AT",
  /** English - Australia */
  3081: "en-AU",
  /** Spanish - Spain (Modern Sort) */
  3082: "es-ES",
  /** French - Canada */
  3084: "fr-CA",
  /** Serbian (Cyrillic) */
  3098: "sr-Cyrl-CS",
  /** Quecha - Peru */
  3179: "quz-PE",
  /** Arabic - Libya */
  4097: "ar-LY",
  /** Chinese - Singapore */
  4100: "zh-SG",
  /** German - Luxembourg */
  4103: "de-LU",
  /** English - Canada */
  4105: "en-CA",
  /** Spanish - Guatemala */
  4106: "es-GT",
  /** French - Switzerland */
  4108: "fr-CH",
  /** Croatian (Bosnia/Herzegovina) */
  4122: "hr-BA",
  /** Arabic - Algeria */
  5121: "ar-DZ",
  /** Chinese - Macao SAR */
  5124: "zh-MO",
  /** German - Liechtenstein */
  5127: "de-LI",
  /** English - New Zealand */
  5129: "en-NZ",
  /** Spanish - Costa Rica */
  5130: "es-CR",
  /** French - Luxembourg */
  5132: "fr-LU",
  /** Bosnian (Bosnia/Herzegovina) */
  5146: "bs-Latn-BA",
  /** Arabic - Morocco */
  6145: "ar-MO",
  /** English - Ireland */
  6153: "en-IE",
  /** Spanish - Panama */
  6154: "es-PA",
  /** French - Monaco */
  6156: "fr-MC",
  /** Arabic - Tunisia */
  7169: "ar-TN",
  /** English - South Africa */
  7177: "en-ZA",
  /** Spanish - Dominican Republic */
  7178: "es-DO",
  /** French - West Indies */
  7180: "fr-029",
  /** Arabic - Oman */
  8193: "ar-OM",
  /** English - Jamaica */
  8201: "en-JM",
  /** Spanish - Venezuela */
  8202: "es-VE",
  /** French - Reunion */
  8204: "fr-RE",
  /** Arabic - Yemen */
  9217: "ar-YE",
  /** English - Caribbean */
  9225: "en-029",
  /** Spanish - Colombia */
  9226: "es-CO",
  /** French - Democratic Rep. of Congo */
  9228: "fr-CG",
  /** Arabic - Syria */
  10241: "ar-SY",
  /** English - Belize */
  10249: "en-BZ",
  /** Spanish - Peru */
  10250: "es-PE",
  /** French - Senegal */
  10252: "fr-SN",
  /** Arabic - Jordan */
  11265: "ar-JO",
  /** English - Trinidad */
  11273: "en-TT",
  /** Spanish - Argentina */
  11274: "es-AR",
  /** French - Cameroon */
  11276: "fr-CM",
  /** Arabic - Lebanon */
  12289: "ar-LB",
  /** English - Zimbabwe */
  12297: "en-ZW",
  /** Spanish - Ecuador */
  12298: "es-EC",
  /** French - Cote d'Ivoire */
  12300: "fr-CI",
  /** Arabic - Kuwait */
  13313: "ar-KW",
  /** English - Philippines */
  13321: "en-PH",
  /** Spanish - Chile */
  13322: "es-CL",
  /** French - Mali */
  13324: "fr-ML",
  /** Arabic - U.A.E. */
  14337: "ar-AE",
  /** English - Indonesia */
  14345: "en-ID",
  /** Spanish - Uruguay */
  14346: "es-UY",
  /** French - Morocco */
  14348: "fr-MA",
  /** Arabic - Bahrain */
  15361: "ar-BH",
  /** English - Hong Kong SAR */
  15369: "en-HK",
  /** Spanish - Paraguay */
  15370: "es-PY",
  /** French - Haiti */
  15372: "fr-HT",
  /** Arabic - Qatar */
  16385: "ar-QA",
  /** English - India */
  16393: "en-IN",
  /** Spanish - Bolivia */
  16394: "es-BO",
  /** English - Malaysia */
  17417: "en-MY",
  /** Spanish - El Salvador */
  17418: "es-SV",
  /** English - Singapore */
  18441: "en-SG",
  /** Spanish - Honduras */
  18442: "es-HN",
  /** Spanish - Nicaragua */
  19466: "es-NI",
  /** Spanish - Puerto Rico */
  20490: "es-PR",
  /** Spanish - United States */
  21514: "es-US",
  /** Spanish - Latin America */
  58378: "es-419",
  /** French - North Africa */
  58380: "fr-015",
};

export function getDefaultLanguageTag(platformId: EncodingPlatformId) {
  switch (platformId) {
    case EncodingPlatformId.UNICODE:
      return ""; // There are no platform-specific language IDs defined for the Unicode platform.
    case EncodingPlatformId.MACINTOSH:
      return "en";
    case EncodingPlatformId.WINDOWS:
      return "en-US";
    default:
      throw new NotSupportedError(`Language platform id ${platformId}`);
  }
}

export function getLanguageTag(platformId: EncodingPlatformId, languageId: number) {
  const language = () => {
    switch (platformId) {
      case EncodingPlatformId.UNICODE:
        return ""; // There are no platform-specific language IDs defined for the Unicode platform.
      case EncodingPlatformId.MACINTOSH:
        return MACINTOSH_LANGUAGE_CODES[languageId];
      case EncodingPlatformId.WINDOWS:
        return WINDOWS_LANGUAGE_CODES[languageId];
      default:
        throw new NotSupportedError(`Language platform id ${platformId}`);
    }
  };
  const l = language();
  if (l !== undefined) return l;
  throw new NotSupportedError(`Language ${languageId} for platform ${platformId}`);
}
