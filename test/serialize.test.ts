import { loadSync } from "../src";
import * as path from "path";
import { readJSON, serializeFont } from "./util/serialize";

const FONTS = [
  {
    name: "Abyssinica SIL",
    fontPath: "AbyssinicaSIL/AbyssinicaSIL-Regular.ttf",
    jsonPath: "AbyssinicaSIL/AbyssinicaSIL-Regular.json",
  },
  {
    name: "Noto Sans HK",
    fontPath: "NotoSansHK/NotoSansHK-Thin.otf",
    jsonPath: "NotoSansHK/NotoSansHK-Thin.json",
  },
  {
    name: "Roboto-Medium",
    fontPath: "roboto/Roboto-Medium.ttf",
    jsonPath: "roboto/Roboto-Medium.json",
  },
];

describe("Serialize", () => {
  test.each(FONTS)(`$name`, ({ fontPath, jsonPath }) => {
    const fontFullPath = path.resolve(__dirname, "data", fontPath);
    const jsonFullPath = path.resolve(__dirname, "data", jsonPath);

    const font = loadSync(fontFullPath);

    const output = serializeFont(font);
    const expectedOutput = readJSON(jsonFullPath);

    expect(output).toMatchObject(expectedOutput);
  });
});
