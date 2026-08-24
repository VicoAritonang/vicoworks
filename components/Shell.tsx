'use client';

import { CommandPalette } from './CommandPalette';
import { Terminal } from './Terminal';
import { SystemMonitor } from './SystemMonitor';
import { CustomCursor } from './CustomCursor';
import { Overdrive } from './Overdrive';

/**
 * Site-wide interactive layer. Every child is `position: fixed`, so DOM order
 * does not matter — stacking is set by explicit z-index.
 *
 * It reads its content from `content/` rather than taking props, which is why
 * it can be mounted once in the root layout instead of being hand-wired into
 * each page with a payload built twice.
 */
export function Shell() {
  return (
    <>
      <CustomCursor />
      <SystemMonitor />
      <CommandPalette />
      <Terminal />
      <Overdrive />
    </>
  );
}
