import Image from "next/image";
import Link from "next/link";

import { FadeIn } from "@/components/motion/fade-in";
import { StaggerGroup, StaggerItem } from "@/components/motion/stagger-group";
import { withBasePathAsset } from "@/lib/base-path";
import { withLocale } from "@/lib/locale";
import type { Locale, NewsCardItem } from "@/types/site";

export function NewsSection({
  locale,
  title,
  moreLabel,
  moreHref = "/news",
  items,
}: {
  locale: Locale;
  title: string;
  moreLabel: string;
  moreHref?: string;
  items: NewsCardItem[];
}) {
  return (
    <section id="news" className="bg-white" style={{ paddingTop: "var(--news-section-top)", paddingBottom: "72px" }}>
      <div className="site-nav-frame">
        <FadeIn y={12} amount={0.12}>
          <h2
            className="text-[#101010]"
            style={{ margin: 0, fontSize: "var(--news-heading-size)", lineHeight: "var(--news-heading-line)", fontWeight: 700, letterSpacing: "-0.018em" }}
          >
            {title}
          </h2>
        </FadeIn>
        <div style={{ marginTop: "var(--news-list-gap-top)" }}>
          <StaggerGroup
            className="grid gap-y-0 md:grid-cols-2 md:gap-x-[84px]"
            density="tight"
            amount={0.06}
          >
            {items.map((item) => (
              <StaggerItem key={item.slug}>
                <Link
                  href={item.isExternal ? item.href : withLocale(locale, item.href)}
                  target={item.isExternal ? "_blank" : undefined}
                  rel={item.isExternal ? "noreferrer" : undefined}
                  className="group grid items-center border-b border-neutral-300 motion-surface hover:border-neutral-500"
                  style={{
                    gridTemplateColumns: "var(--news-item-date-width) minmax(0,1fr)",
                    columnGap: "var(--news-item-gap-x)",
                    paddingBlock: "var(--news-item-pad-y)",
                  }}
                >
                  <span
                    className="inline-flex items-center justify-center bg-[var(--page-ink)] px-[6px] font-medium leading-none tracking-[0.015em] text-white motion-surface group-hover:bg-[#1c1c1c]"
                    style={{ width: "var(--news-item-date-width)", height: "var(--news-item-date-height)", fontSize: "var(--news-item-date-size)" }}
                  >
                    {item.dateLabel}
                  </span>
                  <span className="flex items-center justify-between gap-4 overflow-hidden">
                    <span
                      className="truncate font-semibold tracking-[-0.015em] text-[var(--page-ink)] motion-surface group-hover:text-[#202020]"
                      style={{ fontSize: "var(--news-item-title-size)", lineHeight: 1.25 }}
                    >
                      {item.title}
                    </span>
                    <span className="motion-surface text-[12px] text-neutral-300 opacity-0 group-hover:opacity-100">
                      →
                    </span>
                  </span>
                </Link>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
        <FadeIn className="flex justify-end" delay={0.08} style={{ marginTop: "18px" }}>
          <Link
            href={withLocale(locale, moreHref)}
            className="inline-flex min-h-11 items-center gap-[4px] uppercase text-[var(--page-ink)] motion-surface hover:text-neutral-500"
            style={{ fontSize: "13px", lineHeight: 1, fontWeight: 700, letterSpacing: "0.025em" }}
          >
            <span>{moreLabel}</span>
            <Image src={withBasePathAsset("/icons/more-arrow.svg")} alt="" aria-hidden width={20} height={12} className="h-[12px] w-[20px]" />
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}
