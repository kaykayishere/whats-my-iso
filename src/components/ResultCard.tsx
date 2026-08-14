"use client";

import type { SearchResult } from "@/lib/types";

function CodeBadge({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  if (!value) return null;
  return (
    <div className="flex items-center gap-3">
      <span className="text-[11px] font-medium text-[var(--muted)] uppercase tracking-wider w-24 shrink-0">
        {label}
      </span>
      <code
        className="px-2.5 py-1 rounded-md bg-[var(--accent)] text-[var(--foreground)] text-sm font-mono cursor-pointer hover:bg-[var(--border)] transition border border-[var(--border)]"
        onClick={() => navigator.clipboard?.writeText(value)}
        title="Click to copy"
      >
        {value}
      </code>
    </div>
  );
}

export default function ResultCard({ entry }: { entry: SearchResult }) {
  const isDeprecated = entry.deprecated === "Yes";
  const isMacrolanguage = entry.codeType?.toLowerCase().includes("macro");

  return (
    <article
      className={`rounded-xl border bg-white p-6 shadow-sm transition hover:shadow-md ${
        isDeprecated ? "border-red-200" : "border-[var(--border)]"
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
        <div>
          <h2 className="font-serif text-2xl text-[var(--foreground)]">
            {entry.name || "Unknown"}
          </h2>
          {entry.nativeName && entry.nativeName !== entry.name && (
            <p className="text-[var(--muted)] mt-1 text-base">
              {entry.nativeName}
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {isDeprecated && (
            <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-red-50 text-red-800 border border-red-100">
              Deprecated
            </span>
          )}
          {entry.codeType && (
            <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-[var(--accent)] text-[var(--muted)] border border-[var(--border)]">
              {entry.codeType}
            </span>
          )}
          {isMacrolanguage && (
            <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-amber-50 text-amber-800 border border-amber-100">
              Macrolanguage
            </span>
          )}
        </div>
      </div>

      <div className="space-y-2.5 mb-5">
        <CodeBadge label="ISO 639-3" value={entry.iso6393} />
        <CodeBadge label="ISO 639-1" value={entry.iso6391} />
        <CodeBadge
          label="ISO 639-2"
          value={
            entry.iso6392t || entry.iso6392b
              ? [entry.iso6392t, entry.iso6392b]
                  .filter(Boolean)
                  .filter((v, i, a) => a.indexOf(v) === i)
                  .join(" / ")
              : undefined
          }
        />
        <CodeBadge label="BCP 47" value={entry.bcp47} />
        <CodeBadge label="Keyman/SIL" value={entry.keyman} />
        <CodeBadge label="Glottolog" value={entry.glottolog} />
        <CodeBadge label="Script" value={entry.iso15924} />
      </div>

      {entry.altNames && (
        <div className="mb-4">
          <p className="text-[11px] font-medium text-[var(--muted)] uppercase tracking-wider mb-1.5">
            Alternate names
          </p>
          <p className="text-sm text-[var(--foreground)] leading-relaxed">
            {entry.altNames}
          </p>
        </div>
      )}

      {(entry.macrolanguageOf || entry.macrolanguageMembers) && (
        <div className="mb-4 text-sm">
          {entry.macrolanguageOf && (
            <p>
              <span className="text-[var(--muted)]">Macrolanguage of: </span>
              <code className="font-mono text-[var(--foreground)]">
                {entry.macrolanguageOf}
              </code>
            </p>
          )}
          {entry.macrolanguageMembers && (
            <p className="mt-1">
              <span className="text-[var(--muted)]">Members: </span>
              <span className="font-mono text-sm">
                {entry.macrolanguageMembers}
              </span>
            </p>
          )}
        </div>
      )}

      {isDeprecated && (
        <div className="mt-4 p-4 rounded-lg bg-red-50 border border-red-100 text-sm">
          {entry.deprecatedReason && (
            <p>
              <strong>Reason:</strong> {entry.deprecatedReason}
            </p>
          )}
          {entry.replacedBy && (
            <p className="mt-1">
              <strong>Replaced by:</strong>{" "}
              <code className="font-mono">{entry.replacedBy}</code>
            </p>
          )}
        </div>
      )}

      {(entry.primaryCountry || entry.additionalCountries) && (
        <p className="mt-4 text-xs text-[var(--muted)]">
          {[entry.primaryCountry, entry.additionalCountries]
            .filter(Boolean)
            .join("; ")}
          {entry.primaryRegion ? ` · ${entry.primaryRegion}` : ""}
        </p>
      )}
    </article>
  );
}
