import { loadSync } from "../src";
import * as path from "path";

describe("Read headers", () => {
  test("Roboto-Medium", () => {
    const fullPath = path.resolve(__dirname, "./data/roboto/Roboto-Medium.ttf");
    loadSync(fullPath);
  });
});
