export interface LanguageEntry {
  iso6393?: string;
  iso6391?: string;
  iso6392b?: string;
  iso6392t?: string;
  iso15924?: string;
  bcp47?: string;
  keyman?: string;
  name?: string;
  altNames?: string;
  codeType?: string;
  nativeName?: string;
  macrolanguageOf?: string;
  macrolanguageMembers?: string;
  deprecated?: string;
  deprecatedReason?: string;
  replacedBy?: string;
  glottolog?: string;
  primaryCountry?: string;
  primaryRegion?: string;
  additionalCountries?: string;
}

export type SearchResult = LanguageEntry & {
  score?: number;
};
