import { useEffect, useRef, useState } from 'react';

// Adds a class the first time an element scrolls into view. One observer per
// element, disconnected after firing — reveals should not re-run on the way back
// up, which reads as flicker rather than as animation.
export function useReveal({ threshold = 0.22, rootMargin = '0px 0px -8% 0px' } = {}) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') { setShown(true); return; }
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      setShown(true);
      io.disconnect();
    }, { threshold, rootMargin });
    io.observe(el);
    return () => io.disconnect();
  }, [threshold, rootMargin]);

  return [ref, shown];
}
