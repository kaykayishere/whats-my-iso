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

  const ambiguity =
    results.length > 1 &&
    results.filter((r) => r.deprecated !== "Yes").length > 1;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-[var(--border)] bg-[var(--card)]/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[var(--primary)] flex items-center justify-center text-white font-bold text-sm">
              ISO
            </div>
            <div>
              <h1 className="font-semibold text-lg leading-tight">
                What&apos;s My ISO?
              </h1>
              <p className="text-xs text-[var(--muted)]">
                SILICON Public Tool
              </p>
            </div>
          </div>
          <a
            href="https://idli-git-main-silicons-projects-9fd9ab07.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[var(--muted)] hover:text-[var(--primary)] transition"
          >
            IDLI →
          </a>
        </div>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-10">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
            Find the ISO code for any language
          </h2>
          <p className="text-[var(--muted)] max-w-xl mx-auto">
            Search by English name, autonym, ISO 639 code, BCP 47 tag, Keyman
            code, or any alias in the SILICON crosswalk.
          </p>
        </div>

        <SearchBar onSearch={handleSearch} loading={loading} />

        <div className="mt-10">
          {error && (
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 text-center">
              {error}
            </div>
          )}

          {loading && (
            <div className="text-center text-[var(--muted)] py-12">
              Searching…
            </div>
          )}

          {!loading && hasSearched && results.length === 0 && !error && (
            <div className="text-center py-12">
              <p className="text-lg font-medium">No matches found</p>
              <p className="text-[var(--muted)] mt-1">
                Try a different spelling, code, or shorter query.
              </p>
            </div>
          )}

          {!loading && results.length > 0 && (
            <>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-[var(--muted)]">
                  {results.length} result{results.length !== 1 ? "s" : ""} for “
                  {query}”
                </p>
                {ambiguity && (
                  <span className="text-xs px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
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
            <div className="mt-16 grid sm:grid-cols-3 gap-6 text-center text-sm text-[var(--muted)]">
              <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--card)]">
                <p className="font-medium text-[var(--foreground)] mb-1">
                  Names &amp; autonyms
                </p>
                <p>English, native names, alternate spellings</p>
              </div>
              <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--card)]">
                <p className="font-medium text-[var(--foreground)] mb-1">
                  All major codes
                </p>
                <p>ISO 639-1 / 2 / 3, BCP 47, Keyman, Glottolog</p>
              </div>
              <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--card)]">
                <p className="font-medium text-[var(--foreground)] mb-1">
                  Ambiguity aware
                </p>
                <p>Shows multiple candidates when a query is unclear</p>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="border-t border-[var(--border)] py-6 text-center text-xs text-[var(--muted)]">
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
