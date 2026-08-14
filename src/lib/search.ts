import Fuse from "fuse.js";
import type { LanguageEntry, SearchResult } from "./types";

let fuseInstance: Fuse<LanguageEntry> | null = null;
let allData: LanguageEntry[] = [];

export async function loadData(): Promise<LanguageEntry[]> {
  if (allData.length > 0) return allData;
  const res = await fetch("/data/crosswalk.json");
  if (!res.ok) throw new Error("Failed to load language data");
  allData = await res.json();
  return allData;
}

function buildFuse(data: LanguageEntry[]) {
  return new Fuse(data, {
    keys: [
      { name: "name", weight: 0.35 },
      { name: "nativeName", weight: 0.25 },
      { name: "altNames", weight: 0.2 },
      { name: "iso6393", weight: 0.15 },
      { name: "iso6391", weight: 0.15 },
      { name: "iso6392b", weight: 0.1 },
      { name: "iso6392t", weight: 0.1 },
      { name: "bcp47", weight: 0.1 },
      { name: "keyman", weight: 0.08 },
      { name: "glottolog", weight: 0.05 },
    ],
    threshold: 0.35,
    includeScore: true,
    ignoreLocation: true,
    minMatchCharLength: 1,
    useExtendedSearch: false,
  });
}

export async function searchLanguages(query: string, limit = 30): Promise<SearchResult[]> {
  const q = query.trim();
  if (!q) return [];

  const data = await loadData();
  if (!fuseInstance) {
    fuseInstance = buildFuse(data);
  }

  // Exact code match first (case-insensitive)
  const lower = q.toLowerCase();
  const exactMatches: SearchResult[] = [];
  const seen = new Set<string>();

  for (const entry of data) {
    const codes = [
      entry.iso6393,
      entry.iso6391,
      entry.iso6392b,
      entry.iso6392t,
      entry.bcp47,
      entry.keyman,
      entry.glottolog,
    ]
      .filter(Boolean)
      .map((c) => c!.toLowerCase());

    if (codes.includes(lower)) {
      const key = entry.iso6393 || entry.bcp47 || entry.name || "";
      if (!seen.has(key)) {
        seen.add(key);
        exactMatches.push({ ...entry, score: 0 });
      }
    }
  }

  // Fuzzy search
  const fuzzy = fuseInstance.search(q, { limit: limit + exactMatches.length });
  const fuzzyResults: SearchResult[] = [];

  for (const r of fuzzy) {
    const key = r.item.iso6393 || r.item.bcp47 || r.item.name || "";
    if (!seen.has(key)) {
      seen.add(key);
      fuzzyResults.push({ ...r.item, score: r.score });
    }
  }

  // Prefer non-deprecated, then exact, then by score
  const combined = [...exactMatches, ...fuzzyResults];
  combined.sort((a, b) => {
    const aDep = a.deprecated === "Yes" ? 1 : 0;
    const bDep = b.deprecated === "Yes" ? 1 : 0;
    if (aDep !== bDep) return aDep - bDep;
    return (a.score ?? 1) - (b.score ?? 1);
  });

  return combined.slice(0, limit);
}
