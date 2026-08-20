"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { suggestLanguages } from "@/lib/search";
import type { SearchResult } from "@/lib/types";

interface SearchBarProps {
  onSearch: (query: string) => void;
  onSelectSuggestion?: (entry: SearchResult) => void;
  loading?: boolean;
  initialQuery?: string;
}

export default function SearchBar({
  onSearch,
  onSelectSuggestion,
  loading = false,
  initialQuery = "",
}: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [suggestLoading, setSuggestLoading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const fetchSuggestions = useCallback(async (q: string) => {
    if (!q.trim() || q.trim().length < 1) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    setSuggestLoading(true);
    try {
      const results = await suggestLanguages(q, 8);
      setSuggestions(results);
      setShowSuggestions(results.length > 0);
      setHighlightIndex(-1);
    } catch {
      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setSuggestLoading(false);
    }
  }, []);

  const handleChange = (value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchSuggestions(value);
    }, 180);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    onSearch(query.trim());
  };

  const handleSelect = (entry: SearchResult) => {
    const label = entry.name || entry.iso6393 || entry.bcp47 || "";
    setQuery(label);
    setShowSuggestions(false);
    if (onSelectSuggestion) {
      onSelectSuggestion(entry);
    } else {
      onSearch(label);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) {
      if (e.key === "Enter") return; // let form submit
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((i) => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
    } else if (e.key === "Enter" && highlightIndex >= 0) {
      e.preventDefault();
      handleSelect(suggestions[highlightIndex]);
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      setHighlightIndex(-1);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl relative">
      <div className="relative flex items-center">
        <svg
          className="absolute left-4 w-5 h-5 text-[var(--muted)] z-10"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.8}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (suggestions.length > 0) setShowSuggestions(true);
          }}
          placeholder="Language name, autonym, ISO code, or alias…"
          className="w-full pl-12 pr-32 py-4 text-base rounded-xl border border-[var(--border)] bg-white text-[var(--foreground)] placeholder:text-[var(--muted)] shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 focus:border-[var(--primary)] transition"
          autoComplete="off"
          spellCheck={false}
        />
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="absolute right-2 px-5 py-2.5 rounded-lg bg-[var(--primary)] text-white text-sm font-medium hover:bg-[var(--primary-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition z-10"
        >
          {loading ? "…" : "Search"}
        </button>
      </div>

      {/* Typeahead dropdown */}
      {showSuggestions && (
        <div
          ref={dropdownRef}
          className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-[var(--border)] rounded-xl shadow-lg z-50 overflow-hidden max-h-80 overflow-y-auto"
        >
          {suggestLoading && (
            <div className="px-4 py-3 text-sm text-[var(--muted)]">
              Searching…
            </div>
          )}
          {!suggestLoading &&
            suggestions.map((entry, i) => {
              const code =
                entry.iso6393 || entry.bcp47 || entry.iso6391 || "";
              const isHighlighted = i === highlightIndex;
              return (
                <button
                  key={`${entry.iso6393 || entry.name}-${i}`}
                  type="button"
                  onClick={() => handleSelect(entry)}
                  onMouseEnter={() => setHighlightIndex(i)}
                  className={`w-full text-left px-4 py-3 flex items-center justify-between gap-3 transition ${
                    isHighlighted
                      ? "bg-[var(--accent)]"
                      : "hover:bg-[var(--accent)]"
                  }`}
                >
                  <div className="min-w-0">
                    <div className="font-medium text-[var(--foreground)] truncate">
                      {entry.name || "Unknown"}
                    </div>
                    {entry.nativeName && entry.nativeName !== entry.name && (
                      <div className="text-xs text-[var(--muted)] truncate">
                        {entry.nativeName}
                      </div>
                    )}
                  </div>
                  {code && (
                    <code className="text-xs font-mono text-[var(--muted)] shrink-0 px-2 py-0.5 rounded bg-[var(--accent)] border border-[var(--border)]">
                      {code}
                    </code>
                  )}
                </button>
              );
            })}
        </div>
      )}

      <p className="mt-3 text-sm text-[var(--muted)]">
        Try “Chinese”, “cmn”, “日本語”, “zho”, or any code / name
      </p>
    </form>
  );
}
