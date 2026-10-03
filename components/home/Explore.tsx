import Image from 'next/image';
import { PROFILE_PHOTO } from '@/content/home';
import { SectionHeading } from '@/components/site/ui';
import { BentoCard, UsesCard } from './Bento';

/** Portrait tucked into a recessed frame; it straightens up on hover. */
function BehindTheCodeVisual() {
  return (
    <div className="absolute inset-x-0 -bottom-4 flex justify-center">
      <div className="relative h-48 w-36">
        <div className="pointer-events-none absolute -inset-4 rounded-full bg-indigo-500/40 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100 dark:bg-indigo-400/30" />
        <div className="absolute inset-0 scale-105 rounded-2xl border border-neutral-300 p-2 transition-all duration-500 ease-out group-hover:border-indigo-400/60 dark:border-neutral-600 dark:group-hover:border-indigo-400/60">
          <div className="size-full rounded-xl border-2 border-neutral-200/10 bg-[#dfe0e1] shadow-inner dark:border-neutral-500/20 dark:bg-neutral-700" />
        </div>
        <Image
          src={PROFILE_PHOTO}
          alt="Vico Aritonang"
          width={144}
          height={192}
          className="absolute inset-0 h-48 w-36 rotate-8 rounded-lg object-cover object-top shadow transition-all duration-500 group-hover:scale-105 group-hover:rotate-3"
        />
      </div>
    </div>
  );
}

/** Dot grid with a handwritten "hi!" that draws itself on hover, plus a pen. */
function GuestbookVisual() {
  return (
    <>
      <div className="dot-grid absolute inset-0 opacity-50" />
      <svg
        viewBox="0 0 200 100"
        className="absolute top-1/2 left-1/2 w-44 -translate-x-1/2 -translate-y-[60%] text-neutral-800 transition-colors duration-500 group-hover:text-indigo-500 dark:text-white dark:group-hover:text-indigo-400"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path
          className="[stroke-dasharray:420] [stroke-dashoffset:0] transition-[stroke-dashoffset] duration-[1400ms] ease-out group-hover:animate-[draw-path_1.4s_ease-out]"
          d="M30 70C40 40 46 20 44 18C40 30 36 60 38 78C44 60 56 52 62 58C66 64 62 74 66 78M86 56C88 64 86 72 90 78M90 38v1M120 28C118 46 116 60 118 70M118 84v1M140 70c10-4 22-10 30-20"
        />
      </svg>
      <svg
        viewBox="0 0 24 24"
        className="absolute top-[38%] left-[62%] size-7 text-neutral-500 transition-transform duration-700 ease-out group-hover:translate-x-3 group-hover:-translate-y-2 group-hover:rotate-12 dark:text-neutral-400"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M4 20l4-1L19 8a2.1 2.1 0 0 0-3-3L5 16zM14 7l3 3" />
      </svg>
    </>
  );
}

export function Explore() {
  return (
    <section className="relative py-pagebuilder">
      <SectionHeading eyebrow="My Site" lead="Explore, experiment" accent="&& say hello" />
      <div className="grid grid-cols-1 gap-3 border-y md:grid-cols-12">
        <div className="col-span-1 md:col-span-6 lg:col-span-4">
          <UsesCard className="h-72" />
        </div>
        <div className="col-span-1 md:col-span-6 lg:col-span-4">
          <BentoCard name="Behind The Code" description="Journey, skills & experience" linkTo="/about" metaPosition="top-center" className="h-72">
            <BehindTheCodeVisual />
          </BentoCard>
        </div>
        <div className="col-span-1 md:col-span-12 lg:col-span-4">
          <div className="relative h-72 w-full">
            <BentoCard name="Guestbook" description="Let me know you were here" linkTo="/guestbook" className="size-full">
              <GuestbookVisual />
            </BentoCard>
          </div>
        </div>
      </div>
    </section>
  );
}
