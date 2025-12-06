'use client';

import { useEffect } from 'react';
import { incrementVisitorCount } from '@/app/actions';

export function VisitorCounter() {
  useEffect(() => {
    // Call the server action to increment count on mount
    incrementVisitorCount();
  }, []);

  return null;
}

