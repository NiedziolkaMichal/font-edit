import { loadSync } from "../src";
import * as path from "path";
import { readJSON, serializeFont } from "./testUtil";

describe("Serialize", () => {
  test("Roboto-Medium", () => {
    const fontPath = path.resolve(__dirname, "./data/roboto/Roboto-Medium.ttf");
    const jsonPath = path.resolve(__dirname, "./data/roboto/Roboto-Medium.json");

    const font = loadSync(fontPath);

    const output = serializeFont(font);
    const expectedOutput = readJSON(jsonPath);

    expect(output).toMatchObject(expectedOutput);
  });
});
