import { GoogleFontMetaData } from "./googleFontMetaDataTypes";

const FONT_DOWNLOAD_URL = (family: string) => `https://fonts.google.com/download?family=${encodeURIComponent(family)}`;

export async function fetchMetaData() {
  const metadataResponse = await fetch("https://fonts.google.com/metadata/fonts");
  return (await metadataResponse.json()) as GoogleFontMetaData;
}

export async function fetchFamilyNames() {
  const metadata = await fetchMetaData();
  return getFamilyNames(metadata);
}

function getFamilyNames(metadata: GoogleFontMetaData) {
  const families = metadata.familyMetadataList.map((f) => f.family);
  if (families.length !== new Set(families).size) {
    throw new Error("Google Font family names are not unique");
  }
  return families;
}

export async function fetchFontFamily(familyName: string) {
  const response = await fetch(FONT_DOWNLOAD_URL(familyName));
  return response.body;
}
