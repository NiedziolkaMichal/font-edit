export interface GoogleFontMetaData {
  axisRegistry: AxisRegistry[];
  familyMetadataList: FamilyMetadataList[];
  promotedScript: null;
}

export interface AxisRegistry {
  tag: string;
  displayName: string;
  min: number;
  defaultValue: number;
  max: number;
  precision: number;
  description: string;
  fallbackOnly: boolean;
  fallbacks: Fallback[];
  illustrationUrl?: string;
}

export interface Fallback {
  name: string;
  value: number;
  displayName: string;
}

export interface FamilyMetadataList {
  family: string;
  displayName: string | null;
  category: string;
  size: number;
  subsets: string[];
  fonts: Fonts;
  axes: Axis[];
  designers: string[];
  lastModified: string;
  dateAdded: string;
  popularity: number;
  trending: number;
  defaultSort: number;
  androidFragment: string | null;
  isNoto: boolean;
  colorCapabilities: string[];
  primaryScript: string;
  primaryLanguage: string;
}

export type Fonts = {
  /**
   * Keys are for example: 400, 400i, 500, 600, 700, 800, 100, 100i, 200, 200i, 300, 300i, 500i, 600i, 700i, 800i, 900, 900i, 1000, 1, 1000i, 1i
   */
  [key in number | `${number}i`]: FontDetails;
};

export interface FontDetails {
  /** Integer 1 - 10 */
  thickness: number | null;
  /** Integer 1 - 10 */
  slant: number | null;
  /** Integer 1 - 10 */
  width: number | null;
  /** Floating point number 1 - 3 */
  lineHeight: number;
}

export interface Axis {
  tag: string;
  min: number;
  max: number;
  defaultValue: number;
}
