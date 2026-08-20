"use client";

import { useState, useCallback } from "react";
import SearchBar from "@/components/SearchBar";
import ResultCard from "@/components/ResultCard";
import { searchLanguages } from "@/lib/search";
import type { SearchResult } from "@/lib/types";

export default function HomePage() {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSearch = useCallback(async (q: string) => {
    setQuery(q);
    if (!q) {
      setResults([]);
      setHasSearched(false);
      return;
    }
    setLoading(true);
    setError(null);
    setHasSearched(true);
    try {
      const data = await searchLanguages(q, 40);
      setResults(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load language data. Please refresh and try again.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // When user clicks a suggestion, show that entry prominently + related matches
  const handleSelectSuggestion = useCallback(
    async (entry: SearchResult) => {
      const label = entry.name || entry.iso6393 || entry.bcp47 || "";
      setQuery(label);
      setLoading(true);
      setError(null);
      setHasSearched(true);
      try {
        // Prefer the selected entry first, then similar results
        const data = await searchLanguages(label, 40);
        const key = entry.iso6393 || entry.bcp47 || entry.name || "";
        const others = data.filter(
          (d) => (d.iso6393 || d.bcp47 || d.name) !== key
        );
        setResults([entry, ...others]);
      } catch (err) {
        console.error(err);
        setResults([entry]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const ambiguity =
    results.length > 1 &&
    results.filter((r) => r.deprecated !== "Yes").length > 1;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-[var(--background)]">
        <div className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl tracking-tight text-[var(--foreground)]">
              What&apos;s My ISO?
            </h1>
            <p className="text-[11px] tracking-[0.15em] uppercase text-[var(--muted)] mt-1">
              SILICON Public Tool · Language Code Lookup
            </p>
          </div>
          <a
            href="https://idli-git-main-silicons-projects-9fd9ab07.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm px-4 py-2 rounded-full border border-[var(--border)] bg-white text-[var(--foreground)] hover:bg-[var(--accent)] transition"
          >
            IDLI →
          </a>
        </div>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-12">
        <div className="mb-12">
          <h2 className="font-serif text-3xl sm:text-4xl text-[var(--foreground)] mb-3">
            Find the ISO code for any language
          </h2>
          <p className="text-[var(--muted)] max-w-2xl text-base leading-relaxed">
            Search by English name, autonym, ISO 639 code, BCP 47 tag, Keyman
            code, or any alias in the SILICON crosswalk.
          </p>
        </div>

        <SearchBar
          onSearch={handleSearch}
          onSelectSuggestion={handleSelectSuggestion}
          loading={loading}
        />

        <div className="mt-12">
          {error && (
            <div className="p-4 rounded-xl bg-red-50 text-red-800 text-center border border-red-100">
              {error}
            </div>
          )}

          {loading && (
            <div className="text-center text-[var(--muted)] py-16">
              Searching…
            </div>
          )}

          {!loading && hasSearched && results.length === 0 && !error && (
            <div className="text-center py-16">
              <p className="font-serif text-xl text-[var(--foreground)]">
                No matches found
              </p>
              <p className="text-[var(--muted)] mt-2">
                Try a different spelling, code, or shorter query.
              </p>
            </div>
          )}

          {!loading && results.length > 0 && (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <p className="text-sm text-[var(--muted)]">
                  {results.length} result{results.length !== 1 ? "s" : ""} for “
                  {query}”
                </p>
                {ambiguity && (
                  <span className="text-xs px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-100">
                    Multiple possible matches — check carefully
                  </span>
                )}
              </div>

              <div className="grid gap-4">
                {results.map((entry, i) => (
                  <ResultCard
                    key={`${entry.iso6393 || entry.bcp47 || entry.name}-${i}`}
                    entry={entry}
                  />
                ))}
              </div>
            </>
          )}

          {!hasSearched && !loading && (
            <div className="mt-16 grid sm:grid-cols-3 gap-5">
              <div className="p-6 rounded-xl bg-white border border-[var(--border)]">
                <p className="font-serif text-lg text-[var(--foreground)] mb-2">
                  Names &amp; autonyms
                </p>
                <p className="text-sm text-[var(--muted)] leading-relaxed">
                  English, native names, alternate spellings
                </p>
              </div>
              <div className="p-6 rounded-xl bg-white border border-[var(--border)]">
                <p className="font-serif text-lg text-[var(--foreground)] mb-2">
                  All major codes
                </p>
                <p className="text-sm text-[var(--muted)] leading-relaxed">
                  ISO 639-1 / 2 / 3, BCP 47, Keyman, Glottolog
                </p>
              </div>
              <div className="p-6 rounded-xl bg-white border border-[var(--border)]">
                <p className="font-serif text-lg text-[var(--foreground)] mb-2">
                  Ambiguity aware
                </p>
                <p className="text-sm text-[var(--muted)] leading-relaxed">
                  Shows multiple candidates when a query is unclear
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="border-t border-[var(--border)] py-8 text-center text-xs text-[var(--muted)]">
        <p>
          Data from SILICON ISO Crosswalk · Built as a public tool for the IDLI
          project
        </p>
        <p className="mt-1">
          Codes are clickable to copy · Not affiliated with ISO itself
        </p>
      </footer>
    </div>
  );
}
