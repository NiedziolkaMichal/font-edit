import { loadSync } from "../src";
import * as path from "path";
import { Version } from "../src/otf/sfntHeader";

describe("Read headers", () => {
  test("Roboto-Medium", () => {
    const fullPath = path.resolve(__dirname, "./data/roboto/Roboto-Medium.ttf");
    const file = loadSync(fullPath);

    expect(file.header.version).toBe(Version.TTV1);
    expect(file.header.tablesCount).toBe(18);
    expect(file.header.searchRange).toBe(256);
    expect(file.header.entrySelector).toBe(4);
    expect(file.header.rangeShift).toBe(32);
  });
});
