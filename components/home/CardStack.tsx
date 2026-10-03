'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import { HERO_PHOTOS } from '@/content/home';

const SIZES = '(min-width: 1024px) 220px, (min-width: 640px) 190px, 134px';

/** Cycle the photo list so there are always `n` of them. */
function photos(n: number) {
  return Array.from({ length: n }, (_, i) => HERO_PHOTOS[i % HERO_PHOTOS.length]);
}

/**
 * One draggable photo. Settles at a small random tilt, lifts and twists on
 * hover, and springs back to its slot when let go.
 */
function DraggablePhoto({ src, alt, direction, priority }: { src: string; alt: string; direction: 'left' | 'right'; priority?: boolean }) {
  const sign = direction === 'left' ? -1 : 1;
  const [tilt, setTilt] = useState(0);

  useEffect(() => {
    setTilt((3 * Math.random() + 1) * sign);
  }, [sign]);

  return (
    <motion.div
      className="relative mx-auto shrink-0 cursor-grab active:cursor-grabbing"
      style={{ width: 220, height: 220, userSelect: 'none', WebkitUserSelect: 'none', WebkitTouchCallout: 'none', touchAction: 'none' }}
      initial={{ rotate: 0 }}
      animate={{ rotate: tilt }}
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      whileHover={{ scale: 1.02, rotateZ: 2 * sign, zIndex: 9999 }}
      whileTap={{ scale: 0.96, zIndex: 9999 }}
      whileDrag={{ scale: 0.96, zIndex: 9999 }}
      tabIndex={0}
      draggable={false}
    >
      <div className="relative size-full overflow-hidden rounded-lg shadow-sm shadow-slate-900/30">
        <Image src={src} alt={alt} fill sizes={SIZES} priority={priority} draggable={false} className="rounded-lg object-cover object-top" />
      </div>
    </motion.div>
  );
}

const SLOTS = [
  { x: '-170px', y: '17px', z: 40, direction: 'left' as const },
  { x: '-10px', y: '8px', z: 30, direction: 'right' as const },
  { x: '150px', y: '22px', z: 20, direction: 'right' as const },
  { x: '310px', y: '10px', z: 10, direction: 'left' as const },
];

/**
 * Desktop: four photos start stacked, then spring out into a loose row one
 * after another.
 */
export function CardStack({ animationDelay = 0.4 }: { animationDelay?: number }) {
  const list = photos(SLOTS.length);
  const container: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15, delayChildren: animationDelay + 0.4 } },
  };
  const item: Variants = {
    hidden: { x: 0, y: 0, rotate: 0, scale: 1 },
    visible: (c: { x: string; y: string }) => ({
      x: c.x,
      y: c.y,
      rotate: 0,
      scale: 1,
      transition: { type: 'spring', stiffness: 70, damping: 12, mass: 1 },
    }),
  };

  return (
    <div className="relative z-20 flex h-[275px] w-full items-center justify-center">
      <div className="relative mx-auto flex w-full max-w-6xl justify-center">
        <motion.div className="relative flex w-full justify-center" variants={container} initial="hidden" animate="visible">
          <div className="relative h-[220px] w-[220px] -translate-x-10">
            {SLOTS.map((s, i) => (
              <motion.div key={i} className="absolute top-0 left-0" custom={{ x: s.x, y: s.y }} style={{ zIndex: s.z }} variants={item}>
                <DraggablePhoto src={list[i].src} alt={list[i].alt} direction={s.direction} priority={i === 0} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/**
 * Mobile: three framed photos fanned side by side, each tilted inside an
 * inset "slot", the middle one larger and on top.
 */
export function CardFan() {
  const list = photos(3);
  const slots = [
    { photo: list[2], frame: 'h-[178px] w-[120px] sm:h-[252px] sm:w-[170px]', img: 'h-[173px] w-[115px] sm:h-[245px] sm:w-[163px]', top: 'top-1.5 sm:top-2', rotation: -7, delay: 0.08 },
    { photo: list[0], frame: 'h-[197px] w-[133px] sm:h-[278px] sm:w-[188px]', img: 'h-[198px] w-[134px] sm:h-[280px] sm:w-[190px]', top: 'top-0', rotation: 3, delay: 0 },
    { photo: list[1], frame: 'h-[178px] w-[120px] sm:h-[252px] sm:w-[170px]', img: 'h-[173px] w-[115px] sm:h-[245px] sm:w-[163px]', top: 'top-0', rotation: 7, delay: 0.16 },
  ];

  return (
    <div className="relative z-20 -mx-6 sm:-mx-12">
      <div className="relative w-full overflow-hidden py-8 sm:py-12 dark:[mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <div className="flex items-center justify-center gap-5 sm:gap-10">
          {slots.map((s, i) => (
            <div key={i} className={`relative w-fit animate-rise-in ${i === 1 ? 'z-10' : ''}`} style={{ animationDelay: `${s.delay}s` }}>
              <div className={`rounded-[20px] border border-neutral-200 p-2 dark:border-neutral-800 ${s.frame}`}>
                <div className="grid h-full place-items-center rounded-xl border-2 border-neutral-200/30 bg-neutral-100 shadow-[inset_0_2px_1.5px_rgba(0,0,0,0.1)] dark:border-neutral-700/30 dark:bg-neutral-900" />
              </div>
              <div className={`absolute left-0 overflow-hidden rounded-lg shadow-lg shadow-black/20 ${s.img} ${s.top}`} style={{ transform: `rotate(${s.rotation}deg)` }}>
                <Image
                  src={s.photo.src}
                  alt={s.photo.alt}
                  fill
                  priority={i === 1}
                  sizes={i === 1 ? SIZES : '(min-width: 640px) 163px, 115px'}
                  className="object-cover object-top"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
