'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import css from './Cursor.module.css';

export default function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const handlePointerMove = (event: PointerEvent) => {
      cursor.style.left = `${event.clientX}px`;
      cursor.style.top = `${event.clientY}px`;
      cursor.style.opacity = '1';
    };

    const handlePointerLeave = () => {
      cursor.style.opacity = '0';
    };

    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerleave', handlePointerLeave);
    document.addEventListener('pointerenter', handlePointerMove as EventListener);

    return () => {
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerleave', handlePointerLeave);
      document.removeEventListener('pointerenter', handlePointerMove as EventListener);
    };
  }, []);

  return (
    <div ref={cursorRef} className={css.cursor} aria-hidden="true">
      <Image src="/svg/logo.svg" alt="" width={24} height={24} priority />
    </div>
  );
}