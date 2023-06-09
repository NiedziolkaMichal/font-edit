export enum Version {
  /** TrueTypeCollection */
  TTC = 0x74746366,
  /** TrueType Version 1 */
  TTV1 = 0x00010000,
  /** TrueType Version 2 */
  TTV2 = 0x74727565,
  /** OpenType Font */
  OT = 0x4f54544f,
}

export enum TableTag {
  NAME = 0x6e616d65,
  HEAD = 0x68656164,
  MAXP = 0x6d617870,
  HHEA = 0x68686561,
  OS2 = 0x4f532f32,
  POST = 0x706f7374,
}
