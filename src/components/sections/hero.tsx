"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";

import { withBasePathAsset } from "@/lib/base-path";
import { withLocale } from "@/lib/locale";
import { motionEasing, motionTokens } from "@/lib/motion";
import type { HeroSlide, Locale } from "@/types/site";

const AUTOPLAY_MS = 7000;
const DESKTOP_TRANSITION_MS = 704;
const DESKTOP_CHAINED_TRANSITION_MS = 564;
const DESKTOP_CONTENT_DELAY_MS = 104;
const DESKTOP_CHAINED_CONTENT_DELAY_MS = 56;
const DESKTOP_STAGE_VEIL_MS = 396;

type HeroDirection = -1 | 1;
type PendingTransition = {
  index: number;
  direction: HeroDirection | null;
};

const HERO_TRACK_LEFT = "0px";
const HERO_TRACK_SIDE_WIDTH = "var(--hero-side-width)";
const HERO_TRACK_CENTER_WIDTH = "var(--hero-center-max)";
const HERO_TRACK_CENTER_LEFT = "calc(var(--hero-side-width) + var(--hero-pane-gap))";
const HERO_TRACK_RIGHT_LEFT = "calc(var(--hero-side-width) + var(--hero-pane-gap) + var(--hero-center-max) + var(--hero-pane-gap))";
const HERO_TRACK_OUTGOING_LEFT = "calc((var(--hero-side-width) + var(--hero-pane-gap)) * -1)";
const HERO_TRACK_INCOMING_RIGHT =
  "calc(var(--hero-side-width) + var(--hero-pane-gap) + var(--hero-center-max) + var(--hero-pane-gap) + var(--hero-side-width) + var(--hero-pane-gap))";

const desktopCenterContentStyle: CSSProperties = {
  paddingTop: "var(--hero-center-pad-top)",
  paddingRight: "var(--hero-center-pad-right)",
  paddingBottom: "var(--hero-center-pad-bottom)",
  paddingLeft: "var(--hero-center-pad-left)",
};

const mobileContentStyle: CSSProperties = {
  paddingTop: "var(--hero-mobile-content-pad-top)",
  paddingRight: "var(--hero-mobile-content-pad-x)",
  paddingBottom: "var(--hero-mobile-content-pad-bottom)",
  paddingLeft: "var(--hero-mobile-content-pad-x)",
};

function getWrappedIndex(index: number, length: number) {
  return ((index % length) + length) % length;
}

function getDirection(fromIndex: number, targetIndex: number, length: number): HeroDirection {
  if (targetIndex === fromIndex) {
    return 1;
  }

  const forwardDistance = (targetIndex - fromIndex + length) % length;
  const backwardDistance = (fromIndex - targetIndex + length) % length;

  return forwardDistance <= backwardDistance ? 1 : -1;
}

function getSlideImagePositions(slide: HeroSlide) {
  return {
    left: slide.desktopImagePosition?.left ?? "center center",
    main: slide.desktopImagePosition?.main ?? "center center",
    right: slide.desktopImagePosition?.right ?? "center center",
    mobile: slide.mobileImagePosition ?? slide.desktopImagePosition?.main ?? "center center",
  };
}

function getCleanTitle(title: string) {
  return title.replace(/\n/g, " ");
}

function getHeroCtaLabel(label: string) {
  if (!label) {
    return label;
  }

  const trimmedLabel = label.trim();

  return trimmedLabel.charAt(0).toUpperCase() + trimmedLabel.slice(1).toLowerCase();
}

type DesktopPaneDefinition = {
  key: string;
  slideIndex: number;
  fromEmphasis: "side" | "center";
  toEmphasis: "side" | "center";
  fromSide?: "left" | "right";
  toSide?: "left" | "right";
  framePosition: "previous" | "active" | "next" | "outgoing";
  fromLeft?: string;
  fromWidth?: string;
  toLeft: string;
  toWidth: string;
  zIndex: number;
};

function getDesktopPaneDefinitions(activeIndex: number, targetIndex: number | null, direction: HeroDirection, length: number): DesktopPaneDefinition[] {
  const previous = getWrappedIndex(activeIndex - 1, length);
  const previousOuter = getWrappedIndex(activeIndex - 2, length);
  const next = getWrappedIndex(activeIndex + 1, length);
  const nextOuter = getWrappedIndex(activeIndex + 2, length);

  if (targetIndex === null) {
    return [
      {
        key: `previous-${previous}`,
        slideIndex: previous,
        fromEmphasis: "side",
        toEmphasis: "side",
        fromSide: "left",
        toSide: "left",
        framePosition: "previous",
        toLeft: HERO_TRACK_LEFT,
        toWidth: HERO_TRACK_SIDE_WIDTH,
        zIndex: 2,
      },
      {
        key: `active-${activeIndex}`,
        slideIndex: activeIndex,
        fromEmphasis: "center",
        toEmphasis: "center",
        framePosition: "active",
        toLeft: HERO_TRACK_CENTER_LEFT,
        toWidth: HERO_TRACK_CENTER_WIDTH,
        zIndex: 4,
      },
      {
        key: `next-${next}`,
        slideIndex: next,
        fromEmphasis: "side",
        toEmphasis: "side",
        fromSide: "right",
        toSide: "right",
        framePosition: "next",
        toLeft: HERO_TRACK_RIGHT_LEFT,
        toWidth: HERO_TRACK_SIDE_WIDTH,
        zIndex: 2,
      },
    ];
  }

  if (direction === 1) {
    return [
      {
        key: `outgoing-left-${previous}`,
        slideIndex: previous,
        fromEmphasis: "side",
        toEmphasis: "side",
        fromSide: "left",
        toSide: "left",
        framePosition: "outgoing",
        fromLeft: HERO_TRACK_LEFT,
        fromWidth: HERO_TRACK_SIDE_WIDTH,
        toLeft: HERO_TRACK_OUTGOING_LEFT,
        toWidth: HERO_TRACK_SIDE_WIDTH,
        zIndex: 1,
      },
      {
        key: `shift-left-${activeIndex}`,
        slideIndex: activeIndex,
        fromEmphasis: "center",
        toEmphasis: "side",
        toSide: "left",
        framePosition: "previous",
        fromLeft: HERO_TRACK_CENTER_LEFT,
        fromWidth: HERO_TRACK_CENTER_WIDTH,
        toLeft: HERO_TRACK_LEFT,
        toWidth: HERO_TRACK_SIDE_WIDTH,
        zIndex: 2,
      },
      {
        key: `expand-center-${targetIndex}`,
        slideIndex: targetIndex,
        fromEmphasis: "side",
        toEmphasis: "center",
        fromSide: "right",
        framePosition: "active",
        fromLeft: HERO_TRACK_RIGHT_LEFT,
        fromWidth: HERO_TRACK_SIDE_WIDTH,
        toLeft: HERO_TRACK_CENTER_LEFT,
        toWidth: HERO_TRACK_CENTER_WIDTH,
        zIndex: 5,
      },
      {
        key: `incoming-right-${nextOuter}`,
        slideIndex: nextOuter,
        fromEmphasis: "side",
        toEmphasis: "side",
        fromSide: "right",
        toSide: "right",
        framePosition: "next",
        fromLeft: HERO_TRACK_INCOMING_RIGHT,
        fromWidth: HERO_TRACK_SIDE_WIDTH,
        toLeft: HERO_TRACK_RIGHT_LEFT,
        toWidth: HERO_TRACK_SIDE_WIDTH,
        zIndex: 1,
      },
    ];
  }

  return [
    {
      key: `incoming-left-${previousOuter}`,
      slideIndex: previousOuter,
      fromEmphasis: "side",
      toEmphasis: "side",
      fromSide: "left",
      toSide: "left",
      framePosition: "previous",
      fromLeft: HERO_TRACK_OUTGOING_LEFT,
      fromWidth: HERO_TRACK_SIDE_WIDTH,
      toLeft: HERO_TRACK_LEFT,
      toWidth: HERO_TRACK_SIDE_WIDTH,
      zIndex: 1,
    },
    {
      key: `expand-center-${targetIndex}`,
      slideIndex: targetIndex,
      fromEmphasis: "side",
      toEmphasis: "center",
      fromSide: "left",
      framePosition: "active",
      fromLeft: HERO_TRACK_LEFT,
      fromWidth: HERO_TRACK_SIDE_WIDTH,
      toLeft: HERO_TRACK_CENTER_LEFT,
      toWidth: HERO_TRACK_CENTER_WIDTH,
      zIndex: 5,
    },
    {
      key: `shift-right-${activeIndex}`,
      slideIndex: activeIndex,
      fromEmphasis: "center",
      toEmphasis: "side",
      toSide: "right",
      framePosition: "next",
      fromLeft: HERO_TRACK_CENTER_LEFT,
      fromWidth: HERO_TRACK_CENTER_WIDTH,
      toLeft: HERO_TRACK_RIGHT_LEFT,
      toWidth: HERO_TRACK_SIDE_WIDTH,
      zIndex: 2,
    },
    {
      key: `outgoing-right-${next}`,
      slideIndex: next,
      fromEmphasis: "side",
      toEmphasis: "side",
      fromSide: "right",
      toSide: "right",
      framePosition: "outgoing",
      fromLeft: HERO_TRACK_RIGHT_LEFT,
      fromWidth: HERO_TRACK_SIDE_WIDTH,
      toLeft: HERO_TRACK_INCOMING_RIGHT,
      toWidth: HERO_TRACK_SIDE_WIDTH,
      zIndex: 1,
    },
  ];
}

function HeroHeadline({
  slide,
  includeSubtitle,
  mode = "desktop",
}: {
  slide: HeroSlide;
  includeSubtitle: boolean;
  mode?: "desktop" | "mobile";
}) {
  const titleLines = slide.title.split("\n");
  const isMobile = mode === "mobile";

  return (
    <div className={isMobile ? "max-w-[calc(100%-32px)]" : "max-w-[440px]"}>
      <h1
        className="font-display inline-flex flex-col items-start gap-0 tracking-[-0.08em] text-white uppercase font-semibold"
        style={{
          fontSize: isMobile ? "var(--hero-mobile-title-size)" : "var(--hero-title-size)",
          lineHeight: isMobile ? "var(--hero-mobile-title-line)" : "var(--hero-title-line-height)",
        }}
      >
        {titleLines.map((line) => (
          <span key={`${slide.slug}-${line}`} className="inline-flex bg-black px-[2px] py-0">
            {line}
          </span>
        ))}
      </h1>
      {includeSubtitle && slide.subtitle ? (
        <p className="mt-4 hidden max-w-[430px] leading-[1.7] font-normal text-white/86 lg:block" style={{ fontSize: "var(--hero-subtitle-size)" }}>
          {slide.subtitle}
        </p>
      ) : null}
    </div>
  );
}

function HeroFooter({ slide, mode = "desktop" }: { slide: HeroSlide; mode?: "desktop" | "mobile" }) {
  if (mode === "mobile") {
    return (
      <div className="flex items-end justify-between gap-3">
        <span
          className="relative inline-flex shrink-0 bg-black text-white"
          style={{
            width: "var(--hero-mobile-cta-width)",
            height: "var(--hero-mobile-cta-height)",
          }}
        >
          <span
            className="font-display pointer-events-none absolute whitespace-nowrap font-semibold tracking-[-0.03em]"
            style={{
              left: "-0.02em",
              bottom: "-0.02em",
              fontFamily: "var(--site-font-display)",
              fontSize: "var(--hero-mobile-cta-size)",
              lineHeight: "0.82",
            }}
          >
            {getHeroCtaLabel(slide.ctaLabel)}
          </span>
        </span>
        <div className="max-w-[40vw] text-right">
          <p className="text-[10px] leading-none font-medium tracking-[0.08em] text-white/62 uppercase">Thoughost</p>
          <p className="mt-1 text-[11px] leading-[1.28] font-medium text-white/74">{getCleanTitle(slide.title)}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-end justify-between gap-4">
      <span
        className="relative inline-flex bg-black text-white"
        style={{
          width: "var(--hero-cta-box-width)",
          height: "var(--hero-cta-box-height)",
        }}
      >
        <span
          className="font-display pointer-events-none absolute whitespace-nowrap font-semibold tracking-[-0.045em]"
          style={{
            left: "-0.035em",
            bottom: "-0.06em",
            fontFamily: "var(--site-font-display)",
            fontSize: "var(--hero-cta-size)",
            lineHeight: "0.78",
          }}
        >
          {getHeroCtaLabel(slide.ctaLabel)}
        </span>
      </span>
      <div className="hidden text-right md:block">
        <p className="text-[11px] leading-none font-medium tracking-[0.06em] text-white/72 uppercase">Thoughost</p>
        <p className="mt-1.5 text-[12px] leading-[1.5] font-normal text-white/78">{getCleanTitle(slide.title)}</p>
      </div>
    </div>
  );
}

function HeroProgressBar({
  active,
  progress,
}: {
  active: boolean;
  progress: number;
}) {
  const clampedProgress = Math.max(0, Math.min(progress, 1));

  return (
    <span
      className="hero-progress-track hero-indicator-track relative block h-[var(--hero-dot-height)] w-[var(--hero-dot-width)] overflow-hidden"
      data-progress-active={active ? "true" : "false"}
    >
      <span
        className="hero-progress-fill hero-indicator-fill absolute inset-y-0 left-0 bg-white"
        aria-hidden="true"
        style={{
          width: "100%",
          opacity: active ? 1 : 0,
          transform: `scaleX(${active ? clampedProgress : 0})`,
          transformOrigin: "left center",
          transition: active ? "none" : "opacity 180ms linear, transform 180ms linear",
        }}
      />
      {active ? <span className="hero-progress-sheen absolute inset-y-0 left-0 w-[52%]" aria-hidden="true" /> : null}
    </span>
  );
}

function getDesktopAssetSource(slide: HeroSlide, emphasis: "side" | "center", side?: "left" | "right") {
  if (emphasis === "center") {
    return {
      src: slide.mainImage,
      position: getSlideImagePositions(slide).main,
    };
  }

  const positions = getSlideImagePositions(slide);

  return {
    src: side === "left" ? slide.leftImage : slide.rightImage,
    position: side === "left" ? positions.left : positions.right,
  };
}

function HeroSideChip({
  slide,
  side,
}: {
  slide: HeroSlide;
  side: "left" | "right";
}) {
  const alignmentClass = side === "left" ? "items-start text-left" : "items-end text-right";

  return (
    <div className={`hero-pane-content absolute inset-x-0 bottom-0 z-10 flex p-4 ${alignmentClass}`} data-pane-content="side">
      <span className="hero-pane-chip">{getCleanTitle(slide.title)}</span>
    </div>
  );
}

function AnimatedDesktopPane({
  slide,
  locale,
  fromEmphasis,
  toEmphasis,
  fromSide,
  toSide,
  direction,
  transitionMode,
}: {
  slide: HeroSlide;
  locale: Locale;
  fromEmphasis: "side" | "center";
  toEmphasis: "side" | "center";
  fromSide?: "left" | "right";
  toSide?: "left" | "right";
  direction: HeroDirection;
  transitionMode: "normal" | "chained";
}) {
  const fromAsset = getDesktopAssetSource(slide, fromEmphasis, fromSide);
  const toAsset = getDesktopAssetSource(slide, toEmphasis, toSide);
  const isPromoting = fromEmphasis === "side" && toEmphasis === "center";
  const isDemoting = fromEmphasis === "center" && toEmphasis === "side";
  const sideForChip = toSide ?? fromSide ?? "left";
  const isChained = transitionMode === "chained";
  const assetFadeDuration = isChained ? 0.26 : 0.34;
  const assetRevealDuration = isChained ? 0.34 : 0.44;
  const assetRevealDelay = fromAsset.src === toAsset.src ? 0 : isChained ? 0.02 : 0.06;
  const centerLayerDuration = isChained ? 0.22 : 0.28;
  const centerLayerDelay = toEmphasis === "center" ? (isChained ? 0.06 : 0.12) : 0;
  const centerContentDuration = isChained ? 0.28 : 0.34;
  const centerContentDelay = toEmphasis === "center" ? (isChained ? 0.08 : 0.16) : 0;
  const sideLayerDuration = isChained ? 0.16 : 0.2;
  const sideChipDuration = isChained ? 0.18 : 0.22;
  const centerEntryOffset = fromSide === "left" ? -8 : fromSide === "right" ? 8 : direction === 1 ? 6 : -6;
  const centerExitOffset = toSide === "left" ? -6 : toSide === "right" ? 6 : direction === 1 ? -4 : 4;
  const sideTravelOffset = sideForChip === "left" ? -4 : 4;

  return (
    <div
      className={`hero-pane hero-pane-animated relative h-full overflow-hidden bg-black ${
        toEmphasis === "center" ? "hero-pane-center" : "hero-pane-side"
      }`}
      data-pane-emphasis={toEmphasis}
      data-pane-from-emphasis={fromEmphasis}
      data-pane-to-emphasis={toEmphasis}
    >
      <motion.div
        className="hero-pane-asset-layer absolute inset-0"
        data-asset-role="from"
        initial={{ opacity: 1 }}
        animate={{ opacity: fromAsset.src === toAsset.src ? 1 : isDemoting ? 0 : 0 }}
        transition={{ duration: assetFadeDuration, ease: motionEasing.soft }}
      >
        <Image
          src={withBasePathAsset(fromAsset.src)}
          alt=""
          fill
          loading="eager"
          sizes="(max-width: 1023px) 100vw, 60vw"
          className="hero-pane-image object-cover"
          style={{ objectPosition: fromAsset.position }}
        />
      </motion.div>

      <motion.div
        className="hero-pane-asset-layer absolute inset-0"
        data-asset-role="to"
        initial={{ opacity: fromAsset.src === toAsset.src ? 1 : isPromoting ? 0 : 1 }}
        animate={{ opacity: 1 }}
        transition={{ duration: assetRevealDuration, delay: assetRevealDelay, ease: motionEasing.soft }}
      >
        <Image
          src={withBasePathAsset(toAsset.src)}
          alt={toEmphasis === "center" ? slide.title : ""}
          fill
          loading="eager"
          fetchPriority={toEmphasis === "center" ? "high" : undefined}
          sizes={toEmphasis === "center" ? "(max-width: 1023px) 100vw, 60vw" : "20vw"}
          className="hero-pane-image object-cover"
          style={{ objectPosition: toAsset.position }}
        />
      </motion.div>

      <motion.div
        className="absolute inset-0"
        initial={{ opacity: fromEmphasis === "center" ? 1 : 0 }}
        animate={{ opacity: toEmphasis === "center" ? 1 : 0 }}
        transition={{ duration: centerLayerDuration, delay: centerLayerDelay, ease: motionEasing.soft }}
      >
        <div className="hero-pane-overlay absolute inset-0" data-pane-tone="center" />
        <motion.div
          className="hero-pane-content absolute inset-x-0 top-0 z-10 flex h-full flex-col justify-between p-4 sm:p-5 md:p-6 lg:p-8"
          data-pane-content="center"
          style={desktopCenterContentStyle}
          initial={{
            opacity: fromEmphasis === "center" ? 1 : 0,
            x: fromEmphasis === "center" ? 0 : centerEntryOffset,
            y: fromEmphasis === "center" ? 0 : 10,
          }}
          animate={{
            opacity: toEmphasis === "center" ? 1 : 0,
            x: toEmphasis === "center" ? 0 : centerExitOffset,
            y: toEmphasis === "center" ? 0 : 8,
          }}
          transition={{ duration: centerContentDuration, delay: centerContentDelay, ease: motionEasing.soft }}
        >
          <motion.div
            initial={{
              opacity: fromEmphasis === "center" ? 1 : 0,
              x: fromEmphasis === "center" ? 0 : -44,
              clipPath: fromEmphasis === "center" ? "inset(0% 0% 0% 0%)" : "inset(0% 100% 0% 0%)",
              filter: fromEmphasis === "center" ? "blur(0px)" : "blur(4px)",
            }}
            animate={{
              opacity: toEmphasis === "center" ? 1 : 0,
              x: toEmphasis === "center" ? 0 : 18,
              clipPath: toEmphasis === "center" ? "inset(0% 0% 0% 0%)" : "inset(0% 0% 0% 0%)",
              filter: toEmphasis === "center" ? "blur(0px)" : "blur(2px)",
            }}
            transition={{
              duration: transitionMode === "chained" ? 0.46 : 0.56,
              delay: fromEmphasis === "center" ? 0 : centerContentDelay / 1000,
              ease: motionEasing.emphasized,
            }}
            style={{ willChange: "transform, opacity, clip-path, filter" }}
          >
            <HeroHeadline slide={slide} includeSubtitle />
          </motion.div>
          <motion.div
            initial={{
              opacity: fromEmphasis === "center" ? 1 : 0,
              x: fromEmphasis === "center" ? 0 : -20,
              y: fromEmphasis === "center" ? 0 : 8,
            }}
            animate={{
              opacity: toEmphasis === "center" ? 1 : 0,
              x: toEmphasis === "center" ? 0 : 16,
              y: toEmphasis === "center" ? 0 : 6,
            }}
            transition={{
              duration: transitionMode === "chained" ? 0.4 : 0.5,
              delay: fromEmphasis === "center" ? 0.04 : (centerContentDelay / 1000) + 0.08,
              ease: motionEasing.soft,
            }}
          >
            <HeroFooter slide={slide} />
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute inset-0"
        initial={{ opacity: fromEmphasis === "side" ? 1 : 0 }}
        animate={{ opacity: toEmphasis === "side" ? 1 : 0 }}
        transition={{ duration: sideLayerDuration, ease: motionEasing.soft }}
      >
        <div className="hero-pane-overlay absolute inset-0" data-pane-tone="side" />
        <motion.div
          initial={{
            opacity: fromEmphasis === "side" ? 0.8 : toEmphasis === "side" ? 0.64 : 0,
            x: fromEmphasis === "side" ? 0 : sideTravelOffset,
            y: fromEmphasis === "side" ? 4 : 5,
          }}
          animate={{
            opacity: toEmphasis === "side" ? 0.8 : 0,
            x: toEmphasis === "side" ? 0 : sideTravelOffset * 0.5,
            y: toEmphasis === "side" ? 4 : 5,
          }}
          transition={{ duration: sideChipDuration, ease: motionEasing.soft }}
        >
          <HeroSideChip slide={slide} side={sideForChip} />
        </motion.div>
      </motion.div>

      {toEmphasis === "center" ? (
        <Link href={withLocale(locale, slide.ctaHref)} aria-label={slide.title} className="absolute inset-0 z-20" tabIndex={-1} />
      ) : null}
    </div>
  );
}

function HeroDesktopPane({
  slide,
  locale,
  emphasis,
  side,
  interactive,
  onClick,
}: {
  slide: HeroSlide;
  locale: Locale;
  emphasis: "side" | "center";
  side?: "left" | "right";
  interactive: boolean;
  onClick?: () => void;
}) {
  const positions = getSlideImagePositions(slide);
  const isCenter = emphasis === "center";
  const imageSrc = isCenter ? slide.mainImage : side === "left" ? slide.leftImage : slide.rightImage;
  const imagePosition = isCenter ? positions.main : side === "left" ? positions.left : positions.right;
  const alignmentClass = side === "left" ? "items-start text-left" : "items-end text-right";

  const content = (
    <>
      <Image
        src={withBasePathAsset(imageSrc)}
        alt={isCenter ? slide.title : ""}
        fill
        loading="eager"
        fetchPriority={isCenter ? "high" : undefined}
        sizes={isCenter ? "(max-width: 1023px) 100vw, 60vw" : "20vw"}
        className="hero-pane-image object-cover"
        style={{ objectPosition: imagePosition }}
      />
      <div className="hero-pane-overlay absolute inset-0" data-pane-tone={emphasis} />
      {isCenter ? (
        <div
          className="hero-pane-content absolute inset-x-0 top-0 z-10 flex h-full flex-col justify-between p-4 sm:p-5 md:p-6 lg:p-8"
          data-pane-content="center"
          style={desktopCenterContentStyle}
        >
          <HeroHeadline slide={slide} includeSubtitle />
          <HeroFooter slide={slide} />
        </div>
      ) : (
        <div className={`hero-pane-content absolute inset-x-0 bottom-0 z-10 flex p-4 ${alignmentClass}`} data-pane-content="side">
          <span className="hero-pane-chip">{getCleanTitle(slide.title)}</span>
        </div>
      )}
    </>
  );

  if (isCenter) {
    if (!interactive) {
      return (
        <div aria-hidden="true" className="hero-pane hero-pane-center relative overflow-hidden bg-black" data-pane-emphasis="center">
          {content}
        </div>
      );
    }

    return (
      <Link
        href={withLocale(locale, slide.ctaHref)}
        aria-label={slide.title}
        className="hero-pane hero-pane-center hero-pane-hit relative overflow-hidden bg-black"
        data-pane-emphasis="center"
      >
        {content}
      </Link>
    );
  }

  if (!interactive) {
    return (
      <div aria-hidden="true" className="hero-pane hero-pane-side relative overflow-hidden bg-black" data-pane-emphasis="side">
        {content}
      </div>
    );
  }

  return (
    <button
      type="button"
      aria-label={`Show ${getCleanTitle(slide.title)}`}
      onClick={onClick}
      className="hero-pane hero-pane-side hero-pane-hit relative overflow-hidden bg-black"
      data-pane-emphasis="side"
    >
      {content}
    </button>
  );
}

function DesktopHeroFrame({
  slides,
  activeIndex,
  locale,
  interactive,
  onPrevious,
  onNext,
}: {
  slides: HeroSlide[];
  activeIndex: number;
  locale: Locale;
  interactive: boolean;
  onPrevious: () => void;
  onNext: () => void;
}) {
  const previousIndex = getWrappedIndex(activeIndex - 1, slides.length);
  const nextIndex = getWrappedIndex(activeIndex + 1, slides.length);

  return (
    <div className="site-hero-frame h-full min-h-[var(--hero-height-desktop)] min-w-full">
      <HeroDesktopPane
        slide={slides[previousIndex]}
        locale={locale}
        emphasis="side"
        side="left"
        interactive={interactive}
        onClick={onPrevious}
      />
      <HeroDesktopPane
        slide={slides[activeIndex]}
        locale={locale}
        emphasis="center"
        interactive={interactive}
      />
      <HeroDesktopPane
        slide={slides[nextIndex]}
        locale={locale}
        emphasis="side"
        side="right"
        interactive={interactive}
        onClick={onNext}
      />
    </div>
  );
}

function DesktopHeroTrack({
  slides,
  activeIndex,
  staticActiveIndex,
  targetIndex,
  direction,
  overlayPhase,
  transitionDurationMs,
  transitionMode,
  locale,
  interactive,
  onPrevious,
  onNext,
}: {
  slides: HeroSlide[];
  activeIndex: number;
  staticActiveIndex: number;
  targetIndex: number | null;
  direction: HeroDirection;
  overlayPhase: "idle" | "setup" | "running";
  transitionDurationMs: number;
  transitionMode: "normal" | "chained";
  locale: Locale;
  interactive: boolean;
  onPrevious: () => void;
  onNext: () => void;
}) {
  const panes = useMemo(
    () => getDesktopPaneDefinitions(activeIndex, targetIndex, direction, slides.length),
    [activeIndex, direction, slides.length, targetIndex],
  );

  return (
    <div data-testid="hero-desktop-stage" className="hero-track-viewport relative hidden min-h-[var(--hero-height-desktop)] overflow-hidden lg:block">
      <div className={`hero-static-layer ${targetIndex !== null ? "is-hidden" : ""}`}>
        <DesktopHeroFrame
          slides={slides}
          activeIndex={staticActiveIndex}
          locale={locale}
          interactive={interactive}
          onPrevious={onPrevious}
          onNext={onNext}
        />
      </div>

      {targetIndex !== null ? (
        <div
          className="hero-track hero-track-overlay"
          data-track-state={direction === 1 ? "next" : "prev"}
          data-overlay-phase={overlayPhase}
          data-transition-mode={transitionMode}
          style={{
            "--hero-track-duration": `${transitionDurationMs}ms`,
            "--hero-stage-veil-duration": `${DESKTOP_STAGE_VEIL_MS}ms`,
            "--hero-content-delay": `${transitionMode === "chained" ? DESKTOP_CHAINED_CONTENT_DELAY_MS : DESKTOP_CONTENT_DELAY_MS}ms`,
          } as CSSProperties}
        >
          {panes.map((pane) => (
            <div
              key={pane.key}
              data-hero-pane-motion="true"
              className="hero-track-pane"
              data-frame-position={pane.framePosition}
              data-pane-emphasis={pane.toEmphasis}
              style={
                {
                  left: overlayPhase === "running" ? pane.toLeft : pane.fromLeft,
                  width: overlayPhase === "running" ? pane.toWidth : pane.fromWidth,
                  zIndex: pane.zIndex,
                  "--pane-from-left": pane.fromLeft,
                  "--pane-from-width": pane.fromWidth,
                  "--pane-to-left": pane.toLeft,
                  "--pane-to-width": pane.toWidth,
                } as CSSProperties
              }
            >
              <div className="hero-track-frame-shell">
                <div className="hero-stage-veil absolute inset-0 z-10" />
                <AnimatedDesktopPane
                  slide={slides[pane.slideIndex]}
                  locale={locale}
                  fromEmphasis={pane.fromEmphasis}
                  toEmphasis={pane.toEmphasis}
                  fromSide={pane.fromSide}
                  toSide={pane.toSide}
                  direction={direction}
                  transitionMode={transitionMode}
                />
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function MobileHeroSlide({
  slide,
  locale,
  priority,
  direction,
  reducedMotion,
}: {
  slide: HeroSlide;
  locale: Locale;
  priority: boolean;
  direction: HeroDirection;
  reducedMotion: boolean;
}) {
  const positions = getSlideImagePositions(slide);
  const motionDistance = reducedMotion ? 0 : direction === 1 ? 26 : -26;
  const veilStart = reducedMotion ? 0 : direction === 1 ? 0.2 : 0.16;

  return (
    <Link href={withLocale(locale, slide.ctaHref)} aria-label={slide.title} className="relative block h-full w-full">
      <motion.div
        className="absolute inset-0"
        initial={reducedMotion ? false : { x: motionDistance, scale: 1.035, filter: "blur(4px)", opacity: 0.84 }}
        animate={{ x: 0, scale: 1, filter: "blur(0px)", opacity: 1 }}
        exit={reducedMotion ? undefined : { x: motionDistance * -0.72, scale: 1.014, filter: "blur(3px)", opacity: 0.78 }}
        transition={{ duration: reducedMotion ? motionTokens.tap : 0.72, ease: motionEasing.emphasized }}
      >
        <Image
          src={withBasePathAsset(slide.mainImage)}
          alt={slide.title}
          fill
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : undefined}
          sizes="100vw"
          className="hero-pane-image object-cover"
          style={{ objectPosition: positions.mobile }}
        />
      </motion.div>
      <motion.div
        className="hero-mobile-veil absolute inset-0 z-[1]"
        initial={reducedMotion ? false : { opacity: veilStart }}
        animate={{ opacity: 0 }}
        exit={reducedMotion ? undefined : { opacity: 0.08 }}
        transition={{ duration: reducedMotion ? motionTokens.tap : 0.34, ease: motionEasing.soft }}
      />
      <div className="hero-pane-overlay absolute inset-0 z-[2]" data-pane-tone="center" />
      <motion.div
        className="hero-pane-content absolute inset-x-0 top-0 z-10 flex h-full flex-col justify-between"
        data-pane-content="center"
        style={mobileContentStyle}
        initial={reducedMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={reducedMotion ? undefined : { opacity: 0, y: 8 }}
        transition={{
          duration: reducedMotion ? motionTokens.tap : 0.42,
          delay: reducedMotion ? 0 : 0.06,
          ease: motionEasing.emphasized,
        }}
      >
        <HeroHeadline slide={slide} includeSubtitle={false} mode="mobile" />
        <HeroFooter slide={slide} mode="mobile" />
      </motion.div>
      <div className="hero-mobile-bottom-fade absolute inset-x-0 bottom-0 z-[3]" aria-hidden="true" />
      <div className="hero-mobile-top-fade absolute inset-x-0 top-0 z-[3]" aria-hidden="true" />
      <div className="hero-mobile-edge absolute inset-y-0 left-0 z-[3]" aria-hidden="true" />
      <div className="hero-mobile-edge absolute inset-y-0 right-0 z-[3]" aria-hidden="true" />
    </Link>
  );
}

function HeroIndicators({
  slides,
  activeIndex,
  progressValue,
  isAnimating,
  onSelect,
}: {
  slides: HeroSlide[];
  activeIndex: number;
  progressValue: number;
  isAnimating: boolean;
  onSelect: (slideIndex: number) => void;
}) {
  return (
    <div className="hero-indicators absolute inset-x-0 bottom-0 z-20 flex justify-center px-4 sm:px-5 md:px-6 lg:pb-3">
      <div className="flex items-center">
        {slides.map((slide, slideIndex) => {
          const isActive = slideIndex === activeIndex;

          return (
            <button
              key={slide.slug}
              type="button"
              aria-label={`Go to slide ${slideIndex + 1}`}
              aria-current={isActive ? "true" : undefined}
              onClick={() => onSelect(slideIndex)}
              disabled={isAnimating}
              className="hero-indicator-button group flex items-center justify-center disabled:cursor-default"
            >
              <HeroProgressBar active={isActive} progress={isActive ? progressValue : 0} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function HeroSection({
  locale,
  slides,
  introComplete = true,
}: {
  locale: Locale;
  slides: HeroSlide[];
  introComplete?: boolean;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<HeroDirection>(1);
  const [targetIndex, setTargetIndex] = useState<number | null>(null);
  const [overlayPhase, setOverlayPhase] = useState<"idle" | "setup" | "running">("idle");
  const [transitionMode, setTransitionMode] = useState<"normal" | "chained">("normal");
  const [isPaused, setIsPaused] = useState(false);
  const [progressValue, setProgressValue] = useState(0);
  const shouldReduceMotion = Boolean(useReducedMotion());
  const safeSlides = Array.isArray(slides) ? slides.slice(0, 5) : [];
  const progressFrame = useRef<number | null>(null);
  const progressStartAt = useRef<number | null>(null);
  const progressValueRef = useRef(0);
  const lastFrameAt = useRef<number | null>(null);
  const finalizeTimer = useRef<number | null>(null);
  const hasSettledRef = useRef(true);
  const overlayFrame = useRef<number | null>(null);
  const targetIndexRef = useRef<number | null>(null);
  const pendingTransitionRef = useRef<PendingTransition | null>(null);
  const chainedTransitionRef = useRef(false);
  const chainTimerRef = useRef<number | null>(null);
  const startTransitionRef = useRef<(fromIndex: number, requestedIndex: number, forcedDirection?: HeroDirection | null) => void>(() => {});

  const isAnimating = targetIndex !== null;
  const transitionDurationMs = shouldReduceMotion ? 20 : transitionMode === "chained" ? DESKTOP_CHAINED_TRANSITION_MS : DESKTOP_TRANSITION_MS;

  const resetProgressState = useCallback(() => {
    progressValueRef.current = 0;
    progressStartAt.current = null;
    lastFrameAt.current = null;
    setProgressValue(0);
  }, []);

  const clearFinalizeTimer = useCallback(() => {
    if (finalizeTimer.current !== null) {
      window.clearTimeout(finalizeTimer.current);
      finalizeTimer.current = null;
    }
  }, []);

  const clearOverlayFrame = useCallback(() => {
    if (overlayFrame.current !== null) {
      window.cancelAnimationFrame(overlayFrame.current);
      overlayFrame.current = null;
    }
  }, []);

  const clearChainTimer = useCallback(() => {
    if (chainTimerRef.current !== null) {
      window.clearTimeout(chainTimerRef.current);
      chainTimerRef.current = null;
    }
  }, []);

  const finalizeTransition = useCallback(() => {
    if (hasSettledRef.current) {
      return;
    }

    hasSettledRef.current = true;
    const resolvedIndex = targetIndexRef.current;
    const pendingTransition = pendingTransitionRef.current;
    targetIndexRef.current = null;

    clearFinalizeTimer();
    clearOverlayFrame();
    clearChainTimer();

    if (resolvedIndex === null) {
      chainedTransitionRef.current = false;
      setTransitionMode("normal");
      setTargetIndex(null);
      setOverlayPhase("idle");
      return;
    }

    if (pendingTransition !== null && pendingTransition.index !== resolvedIndex) {
      pendingTransitionRef.current = null;
      chainedTransitionRef.current = true;
      setTransitionMode("chained");
      setActiveIndex(resolvedIndex);
      setTargetIndex(null);
      setOverlayPhase("idle");

      chainTimerRef.current = window.setTimeout(() => {
        chainTimerRef.current = null;
        startTransitionRef.current(resolvedIndex, pendingTransition.index, pendingTransition.direction);
      }, 0);

      return;
    }

    chainedTransitionRef.current = false;
    setTransitionMode("normal");
    setTargetIndex(null);
    setActiveIndex(resolvedIndex);
    setOverlayPhase("idle");
  }, [clearChainTimer, clearFinalizeTimer, clearOverlayFrame]);

  const startTransition = useCallback(
    (fromIndex: number, requestedIndex: number, forcedDirection?: HeroDirection | null) => {
      const nextIndex = getWrappedIndex(requestedIndex, safeSlides.length);

      if (nextIndex === fromIndex) {
        pendingTransitionRef.current = null;
        return;
      }

      const nextDirection = forcedDirection ?? getDirection(fromIndex, nextIndex, safeSlides.length);
      const distance = forcedDirection === 1
        ? nextIndex >= fromIndex
          ? nextIndex - fromIndex
          : nextIndex + safeSlides.length - fromIndex
        : forcedDirection === -1
          ? fromIndex >= nextIndex
            ? fromIndex - nextIndex
            : fromIndex + safeSlides.length - nextIndex
          : nextDirection === 1
            ? (nextIndex - fromIndex + safeSlides.length) % safeSlides.length
            : (fromIndex - nextIndex + safeSlides.length) % safeSlides.length;
      const steppedTarget = distance > 1 ? getWrappedIndex(fromIndex + nextDirection, safeSlides.length) : nextIndex;

      pendingTransitionRef.current = steppedTarget === nextIndex ? null : { index: nextIndex, direction: nextDirection };
      hasSettledRef.current = false;
      setTransitionMode(chainedTransitionRef.current ? "chained" : "normal");
      setDirection(nextDirection);
      targetIndexRef.current = steppedTarget;
      setTargetIndex(steppedTarget);
      setOverlayPhase(shouldReduceMotion ? "running" : "setup");
      resetProgressState();
      clearFinalizeTimer();

      finalizeTimer.current = window.setTimeout(
        () => {
          finalizeTransition();
        },
        shouldReduceMotion ? transitionDurationMs + 16 : transitionDurationMs + 8,
      );
    },
    [clearFinalizeTimer, finalizeTransition, resetProgressState, safeSlides.length, shouldReduceMotion, transitionDurationMs],
  );

  useEffect(() => {
    startTransitionRef.current = startTransition;
  }, [startTransition]);

  const requestTransition = useCallback(
    (requestedIndex: number, directionHint?: HeroDirection | null) => {
      if (safeSlides.length <= 1) {
        return;
      }

      const nextIndex = getWrappedIndex(requestedIndex, safeSlides.length);

      if (nextIndex === activeIndex && !isAnimating) {
        pendingTransitionRef.current = null;
        return;
      }

      if (isAnimating) {
        pendingTransitionRef.current = { index: nextIndex, direction: directionHint ?? null };
        return;
      }

      startTransition(activeIndex, nextIndex, directionHint);
    },
    [activeIndex, isAnimating, safeSlides.length, startTransition],
  );

  useEffect(() => {
    if (targetIndex === null || overlayPhase !== "setup" || shouldReduceMotion) {
      return;
    }

    clearOverlayFrame();
    overlayFrame.current = window.requestAnimationFrame(() => {
      setOverlayPhase("running");
      overlayFrame.current = null;
    });

    return () => {
      clearOverlayFrame();
    };
  }, [clearOverlayFrame, overlayPhase, shouldReduceMotion, targetIndex]);

  useEffect(() => {
    return () => {
      if (progressFrame.current !== null) {
        window.cancelAnimationFrame(progressFrame.current);
      }

      clearFinalizeTimer();
      clearOverlayFrame();
      clearChainTimer();
    };
  }, [clearChainTimer, clearFinalizeTimer, clearOverlayFrame]);

  useEffect(() => {
    if (safeSlides.length <= 1 || shouldReduceMotion || !introComplete || isPaused || isAnimating) {
      if (progressFrame.current !== null) {
        window.cancelAnimationFrame(progressFrame.current);
        progressFrame.current = null;
      }

      return;
    }

    const step = (timestamp: number) => {
      if (progressStartAt.current === null) {
        progressStartAt.current = timestamp - progressValueRef.current * AUTOPLAY_MS;
      }

      if (lastFrameAt.current !== null && timestamp - lastFrameAt.current < 14) {
        progressFrame.current = window.requestAnimationFrame(step);
        return;
      }

      lastFrameAt.current = timestamp;
      const elapsed = timestamp - progressStartAt.current;
      const nextProgress = Math.min(elapsed / AUTOPLAY_MS, 1);

      progressValueRef.current = nextProgress;
      setProgressValue(nextProgress);

      if (nextProgress >= 1) {
        requestTransition(activeIndex + 1);
        return;
      }

      progressFrame.current = window.requestAnimationFrame(step);
    };

    progressFrame.current = window.requestAnimationFrame(step);

    return () => {
      if (progressFrame.current !== null) {
        window.cancelAnimationFrame(progressFrame.current);
        progressFrame.current = null;
      }

      lastFrameAt.current = null;
    };
  }, [activeIndex, introComplete, isAnimating, isPaused, requestTransition, safeSlides.length, shouldReduceMotion]);

  if (!safeSlides.length) {
    return null;
  }

  const mobileVariants = {
    enter: (entryDirection: HeroDirection) => ({
      opacity: shouldReduceMotion ? 1 : 0,
      x: shouldReduceMotion ? "0%" : entryDirection === 1 ? "6.5%" : "-6.5%",
      scale: shouldReduceMotion ? 1 : 1.015,
      filter: "blur(0px)",
    }),
    center: {
      opacity: 1,
      x: "0%",
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: shouldReduceMotion ? motionTokens.tap : 0.62,
        ease: motionEasing.emphasized,
      },
    },
    exit: (entryDirection: HeroDirection) => ({
      opacity: shouldReduceMotion ? 1 : 0,
      x: shouldReduceMotion ? "0%" : entryDirection === 1 ? "-5.5%" : "5.5%",
      scale: shouldReduceMotion ? 1 : 1.01,
      filter: "blur(0px)",
      transition: {
        duration: shouldReduceMotion ? motionTokens.tap : 0.54,
        ease: motionEasing.emphasized,
      },
    }),
  };

  return (
    <section className="relative left-1/2 -mt-px w-screen -translate-x-1/2 overflow-hidden bg-black">
      <div
        className="w-screen bg-black"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="relative min-h-[var(--hero-mobile-height)] overflow-hidden md:min-h-[var(--hero-height-tablet)] lg:min-h-[var(--hero-height-desktop)]">
          <DesktopHeroTrack
            slides={safeSlides}
            activeIndex={activeIndex}
            staticActiveIndex={targetIndex ?? activeIndex}
            targetIndex={targetIndex}
            direction={direction}
            overlayPhase={overlayPhase}
            transitionDurationMs={transitionDurationMs}
            transitionMode={transitionMode}
            locale={locale}
            interactive={!isAnimating}
            onPrevious={() => requestTransition(activeIndex - 1, -1)}
            onNext={() => requestTransition(activeIndex + 1, 1)}
          />

          <div className="relative min-h-[var(--hero-mobile-height)] lg:hidden">
            <AnimatePresence initial={false} custom={direction} mode="sync">
              <motion.div
                key={safeSlides[activeIndex].slug}
                custom={direction}
                variants={mobileVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute inset-0"
              >
                <motion.div
                  className="hero-stage-veil absolute inset-0 z-10"
                  initial={{ opacity: shouldReduceMotion ? 0 : 0.08 }}
                  animate={{ opacity: 0 }}
                  transition={{ duration: shouldReduceMotion ? motionTokens.tap : 0.26, ease: motionEasing.soft }}
                />
                <MobileHeroSlide
                  slide={safeSlides[activeIndex]}
                  locale={locale}
                  priority
                  direction={direction}
                  reducedMotion={shouldReduceMotion}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          <HeroIndicators
            slides={safeSlides}
            activeIndex={activeIndex}
            progressValue={progressValue}
            isAnimating={isAnimating}
            onSelect={(slideIndex) => {
              const nextDirection = slideIndex === activeIndex ? null : slideIndex > activeIndex ? 1 : -1;
              requestTransition(slideIndex, nextDirection);
            }}
          />
        </div>
      </div>
    </section>
  );
}
