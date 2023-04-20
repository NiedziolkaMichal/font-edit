import * as path from "path";
import * as fs from "fs";
import { finished } from "stream/promises";
import { readdir } from "fs/promises";
import type * as streamWeb from "node:stream/web";
import { Readable } from "node:stream";
import { fetchFamilyNames, fetchFontFamily } from "../../src/google/downloadGoogleFonts";
import decompress from "decompress";

const cachePath = path.resolve(__dirname, "../cache/");
const FONT_EXTENSIONS = ["ttf", "otf"];
const SKIP_EXTENSIONS = ["txt"];

export async function prepareCache() {
  const cachedFamilies = await getListOfCachedFamilies();
  const allFamilyNames = await fetchFamilyNames();

  for (const familyName of allFamilyNames) {
    if (!cachedFamilies.includes(familyName)) {
      //TODO compare signature, because file might be corrupted
      await downloadFamilyToFile(familyName);
    }
  }
}

export interface CacheFont {
  path: string;
  data: Buffer;
}

export async function* getCacheFonts(): AsyncGenerator<CacheFont, void, undefined> {
  const paths = await getCacheFilePaths();
  for (const path of paths) {
    const file = await decompress(path);
    const fonts = file.filter((f) => isFont(f.path));

    yield* fonts.map((f) => ({
      path: f.path,
      data: f.data,
    }));
  }
}

export async function getCacheFilePaths() {
  const files = await readdir(cachePath);
  return files.map((f) => path.resolve(cachePath, f));
}

async function getListOfCachedFamilies() {
  const files = await readdir(cachePath);
  return files.map((f) => f.slice(0, f.lastIndexOf(".")));
}

async function downloadFamilyToFile(name: string) {
  const body = await fetchFontFamily(name);
  if (!body) {
    throw new Error(`Failed fetching font family ${name}`);
  }
  await saveFile(cachePath, name, body);
}

async function saveFile(directory: string, familyName: string, body: streamWeb.ReadableStream<Uint8Array>) {
  const fullPath = path.resolve(directory, familyName + ".zip"); //TODO figure out the extension based on the header
  const fileStream = fs.createWriteStream(fullPath, { flags: "wx" });
  return finished(Readable.fromWeb(body).pipe(fileStream));
}

function isFont(path: string) {
  if (FONT_EXTENSIONS.some((e) => path.endsWith(`.${e}`))) {
    return true;
  }
  if (SKIP_EXTENSIONS.some((e) => path.endsWith(`.${e}`))) {
    return false;
  }
  throw new Error(`Unrecognized Font extension ${path}`);
}

declare global {
  /* See https://stackoverflow.com/questions/73308289 */
  interface Response {
    readonly body: streamWeb.ReadableStream<Uint8Array> | null;
  }
}
