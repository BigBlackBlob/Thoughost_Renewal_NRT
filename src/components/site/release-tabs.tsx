"use client";

import { useMemo, useState } from "react";

import { FadeIn } from "@/components/motion/fade-in";
import { ReleasesGridSection } from "@/components/sections/releases-grid";
import type { Locale, ReleaseGridItem } from "@/types/site";

const filterKeys = ["All", "Album", "EP", "Single", "Compilation", "Collaboration"] as const;

type FilterKey = (typeof filterKeys)[number];

export function ReleaseTabs({
  locale,
  items,
  labels,
}: {
  locale: Locale;
  items: ReleaseGridItem[];
  labels: Record<FilterKey, string>;
}) {
  const [active, setActive] = useState<FilterKey>("All");

  const filteredItems = useMemo(() => {
    if (active === "All") {
      return items;
    }

    return items.filter((item) => item.releaseType === active);
  }, [active, items]);

  return (
    <div className="discography-shell bg-white">
      <div className="site-nav-frame">
        <FadeIn y={10} amount={0.12}>
          <div className="discography-filter-rail">
            {filterKeys.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActive(filter)}
                aria-pressed={filter === active}
                className={`discography-filter-item ${filter === active ? "is-active" : ""}`}
              >
                {labels[filter]}
              </button>
            ))}
          </div>
        </FadeIn>
      </div>
      <ReleasesGridSection locale={locale} items={filteredItems} compactTop />
    </div>
  );
}
