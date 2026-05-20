"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { LocaleSwitcher } from "@/components/site/locale-switcher";
import { SiteLogo } from "@/components/site/logo";
import { SocialLinks } from "@/components/site/social-links";
import { isSiteHomePath, withLocale } from "@/lib/locale";
import { drawerContent, motionEasing, motionTokens } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { Locale, NavItem, SocialIconLink } from "@/types/site";

export function SiteHeader({
  locale,
  pathname,
  navigation,
  socialLinks,
}: {
  locale: Locale;
  pathname: string;
  navigation: NavItem[];
  socialLinks: SocialIconLink[];
}) {
  const [open, setOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const isHomeRoute = isSiteHomePath(pathname, locale);

  return (
    <header
      className={cn(
        "site-header z-50",
        isHomeRoute ? "bg-white backdrop-blur-0" : "bg-white/96 backdrop-blur-[10px] border-b border-[var(--page-divider)]",
      )}
    >
      <div className="site-header-frame">
        <div
          className="site-header-inner flex min-h-[var(--header-height)] items-center justify-between gap-8 md:px-0"
        >
          <SiteLogo locale={locale} />
          <div className="flex items-center" style={{ gap: "var(--header-cluster-gap)" }}>
            <nav className="hidden items-center lg:flex" style={{ gap: "var(--header-nav-gap)" }}>
              {navigation.map((item) => {
                const isExternal = /^https?:\/\//.test(item.href);
                const href = isExternal ? item.href : withLocale(locale, item.href);
                const active = isExternal ? false : pathname === href || (item.href !== "/" && pathname?.startsWith(href));

                return (
                  <Link
                    key={item.key}
                    href={href}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noreferrer" : undefined}
                    style={item.key === "project" ? { color: "#f04034" } : undefined}
                    className={cn(
                      "type-nav site-header-nav-link group relative inline-flex h-[var(--header-control-size)] items-center text-[var(--page-ink)] uppercase motion-link hover:text-neutral-500",
                      item.key === "project" && "text-[#f04034] hover:text-[#f04034]",
                      active && "text-[#ce3f36]",
                    )}
                  >
                    <span className="relative inline-flex items-center">
                      {item.label}
                      <span
                        className={cn(
                          "motion-surface absolute top-[calc(100%+1px)] left-0 h-px origin-left bg-current",
                          active ? "w-full scale-x-100 opacity-100" : "w-full scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100",
                        )}
                      />
                    </span>
                  </Link>
                );
              })}
            </nav>
            <div className="hidden w-px bg-[var(--page-divider)] lg:block" style={{ height: "var(--header-divider-height)" }} />
            <div className="hidden lg:block">
              <SocialLinks links={socialLinks} />
            </div>
            <LocaleSwitcher
              locale={locale}
              pathname={pathname}
              placement="header"
              open={languageOpen}
              onOpenChange={(nextOpen) => {
                setLanguageOpen(nextOpen);
                if (nextOpen) {
                  setOpen(false);
                }
              }}
            />
            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => {
                setOpen((value) => {
                  const nextOpen = !value;
                  if (nextOpen) {
                    setLanguageOpen(false);
                  }

                  return nextOpen;
                });
              }}
              className="flex items-center justify-center border border-[var(--page-divider)] bg-white/92 motion-surface hover:border-neutral-400 hover:bg-neutral-50 lg:hidden"
              style={{ width: "var(--header-control-size)", height: "var(--header-control-size)" }}
            >
              <motion.span
                key={open ? "open" : "closed"}
                initial={shouldReduceMotion ? false : { opacity: 0, rotate: open ? -18 : 18 }}
                animate={{ opacity: 1, rotate: 0 }}
                transition={{ duration: motionTokens.hover, ease: motionEasing.emphasized }}
                className="inline-flex"
              >
                {open ? <X size={18} /> : <Menu size={18} />}
              </motion.span>
            </button>
          </div>
        </div>
      </div>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={drawerContent}
            className="overflow-hidden border-t border-[var(--page-divider)] bg-white/96 backdrop-blur-[10px] lg:hidden"
          >
            <motion.nav
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: shouldReduceMotion ? 0 : 0.04,
                    delayChildren: shouldReduceMotion ? 0 : 0.02,
                  },
                },
              }}
              className="mx-auto flex max-w-[var(--content-max)] flex-col py-4"
              style={{ paddingInline: "var(--mobile-header-pad-x)" }}
            >
              {navigation.map((item) => {
                const isExternal = /^https?:\/\//.test(item.href);
                const href = isExternal ? item.href : withLocale(locale, item.href);
                const active = isExternal ? false : pathname === href || (item.href !== "/" && pathname?.startsWith(href));

                return (
                  <motion.div
                    key={item.key}
                    variants={{
                      hidden: { opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 8 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        transition: { duration: motionTokens.enterFast, ease: motionEasing.emphasized },
                      },
                    }}
                  >
                    <Link
                      href={href}
                      target={isExternal ? "_blank" : undefined}
                      rel={isExternal ? "noreferrer" : undefined}
                      onClick={() => {
                        setOpen(false);
                        setLanguageOpen(false);
                      }}
                      style={item.key === "project" ? { color: "#f04034" } : undefined}
                      className={cn(
                        "block border-b border-neutral-100 py-4 text-[12px] leading-none font-semibold tracking-[0.05em] text-[var(--page-ink)] uppercase motion-link hover:text-neutral-500",
                        item.key === "project" && "text-[#f04034]",
                        active && "text-[#ce3f36]",
                      )}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                );
              })}
              <div className="pt-4">
                <SocialLinks links={socialLinks} />
              </div>
            </motion.nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
