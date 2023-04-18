export class NotSupportedError extends Error {
  constructor(feature: string) {
    super(`${feature} is currently not supported`);
    this.name = "NotSupportedError";
  }
}

export class FontCorruptedError extends Error {
  constructor(message: string) {
    super(`Font seems to be corrupted! ${message}`);
    this.name = "FontCorruptedError";
  }
}

export function assertEqual(message: string, input: number, calculatedVal: number) {
  if (input !== calculatedVal) {
    throw new FontCorruptedError(message);
  }
}
