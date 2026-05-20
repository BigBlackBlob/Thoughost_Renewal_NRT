"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Languages } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { localeDisplayNames } from "@/content/site/dictionaries";
import { resolveSystemLocale, stripLocalePrefix } from "@/lib/locale";
import { drawerContent, motionEasing, motionTokens } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { Locale } from "@/types/site";

const localeItems = [
  { key: "system", label: "Follow System" },
  { key: "zh", label: localeDisplayNames.zh },
  { key: "en", label: localeDisplayNames.en },
  { key: "ja", label: localeDisplayNames.ja },
] as const;

export function LocaleSwitcher({
  locale,
  pathname,
  placement = "header",
  open: controlledOpen,
  onOpenChange,
}: {
  locale: Locale;
  pathname: string;
  placement?: "header";
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const router = useRouter();
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const pathWithoutLocale = useMemo(() => stripLocalePrefix(pathname), [pathname]);
  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = onOpenChange ?? setUncontrolledOpen;

  const goSystemLocale = () => {
    const targetLocale = resolveSystemLocale(window.navigator.language);
    router.push(`/${targetLocale}${pathWithoutLocale || ""}`);
    setOpen(false);
  };

  return (
    <div className={cn("relative", placement === "header" && "shrink-0")}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Change language"
        onClick={() => setOpen(!open)}
        className="motion-surface inline-flex items-center justify-center border border-[var(--page-divider)] bg-white/92 text-[var(--page-ink)] hover:border-neutral-400 hover:bg-neutral-50"
        style={{ width: "var(--header-control-size)", height: "var(--header-control-size)" }}
      >
        <motion.span
          animate={{ rotate: open ? 10 : 0, opacity: open ? 0.9 : 1 }}
          transition={{ duration: motionTokens.hover, ease: motionEasing.emphasized }}
          className="inline-flex"
        >
          <Languages size={13} strokeWidth={1.8} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            initial={shouldReduceMotion ? false : "hidden"}
            animate="visible"
            exit="exit"
            variants={drawerContent}
            className="absolute top-full right-0 z-50 mt-2 min-w-[172px] overflow-hidden border border-[var(--page-divider)] bg-white/96 py-1 shadow-[0_14px_30px_rgba(0,0,0,0.08)] backdrop-blur-[10px]"
          >
            {localeItems.map((entry) =>
              entry.key === "system" ? (
                <button
                  key={entry.key}
                  type="button"
                  onClick={goSystemLocale}
                  className="motion-surface flex min-h-11 w-full items-center justify-between px-4 py-3 text-left text-[13px] leading-none font-medium text-[var(--page-ink)] hover:bg-neutral-100"
                >
                  <span>{entry.label}</span>
                  <span className="type-meta text-neutral-500 uppercase">Auto</span>
                </button>
              ) : (
                <Link
                  key={entry.key}
                  href={`/${entry.key}${pathWithoutLocale || ""}`}
                  onClick={() => setOpen(false)}
                  aria-current={entry.key === locale ? "page" : undefined}
                  className={cn(
                    "motion-surface flex min-h-11 items-center justify-between px-4 py-3 text-[13px] leading-none font-medium hover:bg-neutral-100",
                    entry.key === locale ? "bg-neutral-100 text-[var(--page-ink)]" : "text-[var(--page-ink-soft)]",
                  )}
                >
                  <span>{entry.label}</span>
                  {entry.key === locale ? (
                    <span className="type-meta text-[var(--page-ink)] uppercase">Now</span>
                  ) : null}
                </Link>
              ),
            )}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
