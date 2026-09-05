import type { PropsWithChildren } from 'react';
import { MotionConfig } from 'motion/react';

/** Play approved site effects consistently, independently of OS motion preferences. */
export function MotionProvider({ children }: PropsWithChildren) {
  return <MotionConfig reducedMotion="never">{children}</MotionConfig>;
}
