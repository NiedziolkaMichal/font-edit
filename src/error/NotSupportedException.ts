export class NotSupportedException extends Error {
  constructor(feature: string) {
    super(`${feature} is currently not supported`);
    this.name = "NotSupportedException";
  }
}
