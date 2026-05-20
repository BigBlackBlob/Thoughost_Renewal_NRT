import Image from "next/image";
import Link from "next/link";

import { FadeIn } from "@/components/motion/fade-in";
import { withBasePathAsset } from "@/lib/base-path";
import { withLocale } from "@/lib/locale";
import type { Locale, ReleaseGridItem } from "@/types/site";

export function ReleasesGridSection({
  locale,
  title,
  moreLabel,
  items,
  compactTop = false,
}: {
  locale: Locale;
  title?: string;
  moreLabel?: string;
  items: ReleaseGridItem[];
  compactTop?: boolean;
}) {
  return (
    <section
      id="releases"
      className="discography-wall bg-white pb-[78px] md:pb-[96px]"
      style={{ paddingTop: compactTop ? "0px" : "var(--releases-section-top)" }}
    >
      <div className="site-nav-frame">
        {title ? (
          <FadeIn y={12} amount={0.12}>
            <h2
              className="text-[#101010]"
              style={{ fontSize: "var(--releases-heading-size)", lineHeight: 1, fontWeight: 700, letterSpacing: "-0.018em" }}
            >
              {title}
            </h2>
          </FadeIn>
        ) : null}
        <div className={title ? "mt-[34px]" : ""}>
          <div className="discography-cover-grid grid justify-between sm:grid-cols-3 lg:grid-cols-5" style={{ columnGap: "var(--release-cover-gap)" }}>
            {items.map((item, index) => (
              <FadeIn key={item.slug} delay={Math.min(index * 0.028, 0.16)} y={14} amount={0.08}>
                <Link
                  href={withLocale(locale, `/releases/${item.slug}`)}
                  className="discography-cover-card group motion-image-group motion-border relative block overflow-hidden border border-transparent bg-neutral-200 hover:border-neutral-400"
                  style={{ width: "var(--release-cover-size)" }}
                >
                  <div className="discography-cover-media relative" style={{ width: "var(--release-cover-size)", height: "var(--release-cover-size)" }}>
                    <Image
                      src={withBasePathAsset(item.coverImage)}
                      alt={item.title}
                      fill
                      loading={index < 5 ? "eager" : "lazy"}
                      fetchPriority={index < 5 ? "high" : undefined}
                      decoding="async"
                      className="discography-cover-image motion-image object-cover group-hover:opacity-97 group-hover:brightness-105"
                      sizes="(max-width: 1024px) 50vw, 20vw"
                    />
                  </div>
                  <div className="discography-cover-caption motion-overlay absolute inset-x-0 bottom-0 p-3">
                    <p className="text-[15px] leading-[1.2] font-semibold tracking-[-0.018em] text-white">{item.title}</p>
                    <p className="mt-1 text-[12px] leading-[1.35] font-medium text-white/78">{item.artistName}</p>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
        {moreLabel ? (
          <FadeIn className="mt-[8px] flex justify-end" delay={0.08}>
            <Link
              href={withLocale(locale, "/releases")}
              className="inline-flex min-h-11 items-center gap-[4px] uppercase text-[#101010] motion-surface hover:text-neutral-500"
              style={{ fontSize: "13px", lineHeight: 1, fontWeight: 700, letterSpacing: "0.025em" }}
            >
              <span>{moreLabel}</span>
              <Image src={withBasePathAsset("/icons/more-arrow.svg")} alt="" aria-hidden width={20} height={12} className="h-[12px] w-[20px]" />
            </Link>
          </FadeIn>
        ) : null}
      </div>
    </section>
  );
}
