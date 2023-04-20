import { load } from "../src";
import { getCacheFonts, prepareCache } from "./util/cache";

const MIN_EXPECTED_FONTS = 9000;

/**
 * This process can take a long time at first, because 1.5GB of fonts will to be downloaded
 */
beforeAll(async () => {
  await prepareCache();
}, 600 * 1000);

describe("Google Fonts", () => {
  test(
    "Load all",
    async () => {
      const cache = getCacheFonts();

      let count = 0;
      for await (const { path, data } of cache) {
        try {
          load(data.buffer);
          count++;
        } catch (e) {
          throw new Error(`Failed on file ${path}. ${(e as Error).message}`);
        }
      }

      expect(count).toBeGreaterThan(MIN_EXPECTED_FONTS);
    },
    180 * 1000
  );
});
