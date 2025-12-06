'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

const CHARS = '-_~`!@#$%^&*()+=[]{}|;:,.<>?/0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

interface ScrambleTextProps {
  text: string;
  className?: string;
  scrambleSpeed?: number;
  revealSpeed?: number;
  delay?: number;
}

export function ScrambleText({ 
  text, 
  className = '', 
  scrambleSpeed = 50,
  revealSpeed = 100,
  delay = 0
}: ScrambleTextProps) {
  const [displayText, setDisplayText] = useState('');
  const [isScrambling, setIsScrambling] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let currentIteration = 0;
    const maxIterations = text.length * 3; // How many scrambles before settling
    
    // Initial delay
    timeoutRef.current = setTimeout(() => {
      intervalRef.current = setInterval(() => {
        if (currentIteration >= maxIterations) {
          setDisplayText(text);
          setIsScrambling(false);
          if (intervalRef.current) clearInterval(intervalRef.current);
          return;
        }

        const scrambled = text
          .split('')
          .map((char, index) => {
            if (index < currentIteration / 3) {
              return text[index];
            }
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join('');

        setDisplayText(scrambled);
        currentIteration++;
      }, scrambleSpeed);
    }, delay);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [text, scrambleSpeed, delay]);

  return (
    <motion.span className={className}>
      {displayText}
      {isScrambling && <span className="animate-pulse ml-1 inline-block w-2 h-[1em] bg-cyan-500 align-middle" />}
    </motion.span>
  );
}

