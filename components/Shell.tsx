'use client';

import { CommandPalette } from './CommandPalette';
import { Terminal } from './Terminal';
import { SystemMonitor } from './SystemMonitor';
import { CustomCursor } from './CustomCursor';
import { Overdrive } from './Overdrive';
import { HUDFrame } from './HUDFrame';

export interface ShellData {
  email: string;
  github: string | null;
  linkedin: string | null;
  whatsapp: string | null;
  resumeUrl: string | null;
  skills: string[];
  overview: string | null;
}

/** Site-wide interactive layer: command palette, terminal, telemetry, cursor, easter eggs. */
export function Shell({ data }: { data: ShellData }) {
  return (
    <>
      <CustomCursor />
      <HUDFrame />
      <SystemMonitor />
      <CommandPalette data={data} />
      <Terminal data={data} />
      <Overdrive />
    </>
  );
}
