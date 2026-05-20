import Image from "next/image";
import Link from "next/link";

import { FadeIn } from "@/components/motion/fade-in";
import { withBasePathAsset } from "@/lib/base-path";
import { withLocale } from "@/lib/locale";
import type { FooterGroup, Locale, SocialIconLink } from "@/types/site";

export function SiteFooter({
  locale,
  groups,
  socialLinks,
  contactEmail,
  contactLabel,
  followUsLabel,
  quote,
  copyrightText,
  alignToHero = false,
  variant = "default",
}: {
  locale: Locale;
  groups: FooterGroup[];
  socialLinks: SocialIconLink[];
  contactEmail: string;
  contactLabel: string;
  followUsLabel: string;
  quote: string;
  copyrightText: string;
  alignToHero?: boolean;
  variant?: "default" | "release-detail";
}) {
  void alignToHero;
  const primaryGroup = groups[0];
  const secondaryGroup = groups[1];
  const blackHoleLink = secondaryGroup?.links[0];

  if (variant === "release-detail") {
    return (
      <footer id="contact" className="border-t border-[#e8edf1] bg-white text-[var(--page-ink)]">
        <div className="site-nav-frame px-0 pt-[15px] pb-[20px]">
          <FadeIn className="text-[11px] leading-[1.45] text-neutral-400" delay={0.02}>
            <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
              <p>{copyrightText}</p>
              <p className="text-neutral-500/90">{quote}</p>
            </div>
          </FadeIn>
        </div>
      </footer>
    );
  }

  return (
    <footer id="contact" className="bg-[#101010] text-white">
      <div className="site-nav-frame px-0 pt-[46px] pb-[20px]">
        <div className="grid gap-10 md:grid-cols-[minmax(240px,1fr)_minmax(160px,0.55fr)_minmax(260px,0.8fr)]">
          <div>
            <div className="grid gap-x-[72px] gap-y-6 md:grid-cols-[auto_auto]">
              <div className="space-y-[6px]">
                {primaryGroup?.links.map((item) => (
                  <Link
                    key={item.key}
                    href={withLocale(locale, item.href)}
                    className="motion-link flex min-h-11 items-center text-white hover:text-neutral-300"
                    style={{ fontSize: "var(--footer-nav-size)", lineHeight: 1.45, fontWeight: 600, letterSpacing: "-0.01em" }}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
              <div className="space-y-[6px]">
                {blackHoleLink ? (
                  <Link
                    href={withLocale(locale, blackHoleLink.href)}
                  className="motion-link flex min-h-11 items-center text-white hover:text-neutral-300"
                    style={{ fontSize: "var(--footer-nav-size)", lineHeight: 1.45, fontWeight: 600, letterSpacing: "-0.01em" }}
                  >
                    {blackHoleLink.label}
                  </Link>
                ) : null}
              </div>
            </div>
            <Image
              src={withBasePathAsset("/thoughost-logo.svg")}
              alt="Thoughost"
              width={148}
              height={33}
              className="invert"
              style={{ width: "auto", height: "var(--footer-logo-height)", marginTop: "var(--footer-logo-top-gap)" }}
            />
          </div>
          <div className="hidden md:block" />
          <div className="grid self-start gap-8 md:grid-cols-[auto_auto] md:justify-self-end md:gap-x-[44px]">
            <div className="grid grid-cols-[18px_auto] items-start gap-x-2 gap-y-[2px] self-start">
              <Image src={withBasePathAsset("/icons/email.svg")} alt="" width={18} height={18} className="mt-[1px] h-[18px] w-[18px] opacity-90" />
              <span className="text-[var(--footer-muted)]" style={{ fontSize: "var(--footer-nav-size)", lineHeight: 1.45, fontWeight: 600 }}>
                {contactLabel}
              </span>
              <a
                href={`mailto:${contactEmail}`}
                className="motion-link col-start-2 flex min-h-11 items-center text-[var(--footer-muted)] visited:text-[var(--footer-muted)] hover:text-white"
                style={{ color: "var(--footer-muted)", fontSize: "var(--footer-email-size)", lineHeight: 1.2, fontWeight: 500 }}
              >
                {contactEmail}
              </a>
            </div>
            <div className="grid grid-cols-[18px_auto] items-start gap-x-2 gap-y-[4px] self-start">
              <Image src={withBasePathAsset("/icons/followus.svg")} alt="" width={18} height={18} className="mt-[1px] h-[18px] w-[18px] opacity-90" />
              <span className="text-[var(--footer-muted)]" style={{ fontSize: "var(--footer-nav-size)", lineHeight: 1.45, fontWeight: 600 }}>
                {followUsLabel}
              </span>
              <div className="col-start-2 flex min-h-11 items-center gap-[var(--footer-social-gap)]">
                {socialLinks.map((item) => (
                  <Link
                    key={item.platform}
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={item.label}
                    className="motion-surface inline-flex min-h-11 min-w-11 items-center justify-center hover:opacity-88"
                    style={{ backgroundColor: "var(--footer-icon-bg)" }}
                  >
                    <Image
                      src={withBasePathAsset(`/icons/social/${item.iconKey}.svg`)}
                      alt=""
                      width={18}
                      height={18}
                      className="brightness-0"
                      style={{
                        width: item.iconKey === "soundcloud" ? "var(--footer-soundcloud-icon-size)" : "var(--footer-social-icon-size)",
                        height: item.iconKey === "soundcloud" ? "var(--footer-soundcloud-icon-size)" : "var(--footer-social-icon-size)",
                      }}
                    />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
        <FadeIn className="mt-0" delay={0.08}>
          <div
            className="grid gap-3 leading-[1.45] md:grid-cols-[minmax(240px,1fr)_minmax(160px,0.55fr)_minmax(260px,0.8fr)] md:items-center"
            style={{
              marginTop: "var(--footer-logo-bottom-gap)",
              paddingTop: "var(--footer-divider-bottom-gap)",
              color: "#ffffff",
              fontSize: "var(--footer-meta-size)",
            }}
          >
            <p>{copyrightText}</p>
            <div className="hidden md:block" />
            <p className="md:justify-self-end">{quote}</p>
          </div>
        </FadeIn>
      </div>
    </footer>
  );
}
