"use client";

import { useState, useRef, useEffect } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  loading?: boolean;
  initialQuery?: string;
}

export default function SearchBar({
  onSearch,
  loading = false,
  initialQuery = "",
}: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl">
      <div className="relative flex items-center">
        <svg
          className="absolute left-4 w-5 h-5 text-[var(--muted)]"
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
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Language name, autonym, ISO code, or alias…"
          className="w-full pl-12 pr-32 py-4 text-base rounded-xl border border-[var(--border)] bg-white text-[var(--foreground)] placeholder:text-[var(--muted)] shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 focus:border-[var(--primary)] transition"
          autoComplete="off"
          spellCheck={false}
        />
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="absolute right-2 px-5 py-2.5 rounded-lg bg-[var(--primary)] text-white text-sm font-medium hover:bg-[var(--primary-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {loading ? "…" : "Search"}
        </button>
      </div>
      <p className="mt-3 text-sm text-[var(--muted)]">
        Try “Chinese”, “cmn”, “日本語”, “zho”, or any code / name
      </p>
    </form>
  );
}
