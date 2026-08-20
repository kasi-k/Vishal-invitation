import { useEffect, useMemo, useState } from 'react';
import { THEME } from '../theme/themes.js';

// Two behaviours from one component: a burst when the seal is broken, and a slow
// continuous drift for the rest of the page. The burst is what makes opening feel
// like an event rather than a state change.
export default function Petals({ burst, count = 30 }) {
  const [showBurst, setShowBurst] = useState(false);

  useEffect(() => {
    if (!burst) return;
    setShowBurst(true);
    const t = setTimeout(() => setShowBurst(false), 3200);
    return () => clearTimeout(t);
  }, [burst]);

  // deterministic scatter, so petals never re-shuffle on a render
  const rnd = (i, n) => ((Math.sin(i * 12.9898 + n * 78.233) * 43758.5453) % 1 + 1) % 1;

  const drift = useMemo(() => Array.from({ length: count }, (_, i) => ({
    left: rnd(i, 1) * 100,
    size: 5 + rnd(i, 2) * 7,
    delay: -rnd(i, 3) * 24,
    dur: 17 + rnd(i, 4) * 16,
    sway: (rnd(i, 5) - 0.5) * 22,
    spin: 320 + rnd(i, 6) * 500,
    tint: THEME.petal[i % THEME.petal.length],
    round: rnd(i, 7) > 0.72,
  })), [count]);

  const shower = useMemo(() => Array.from({ length: 46 }, (_, i) => ({
    left: 6 + rnd(i, 11) * 88,
    size: 7 + rnd(i, 12) * 12,
    delay: rnd(i, 13) * 0.9,
    dur: 1.9 + rnd(i, 14) * 1.5,
    sway: (rnd(i, 15) - 0.5) * 30,
    spin: 300 + rnd(i, 16) * 700,
    tint: THEME.petal[i % THEME.petal.length],
  })), []);

  return (
    <>
      <div className="petals" aria-hidden="true">
        {drift.map((p, i) => (
          <span key={i} className={`petal${p.round ? ' round' : ''}`} style={{
            left: `${p.left}%`, width: `${p.size}px`,
            height: `${p.size * (p.round ? 1 : 0.6)}px`, background: p.tint,
            animationDelay: `${p.delay}s`, animationDuration: `${p.dur}s`,
            '--sway': `${p.sway}vw`, '--spin': `${p.spin}deg`,
          }} />
        ))}
      </div>

      {showBurst && (
        <div className="shower" aria-hidden="true">
          {shower.map((p, i) => (
            <span key={i} className="petal shower-petal" style={{
              left: `${p.left}%`, width: `${p.size}px`, height: `${p.size * 0.62}px`,
              background: p.tint, animationDelay: `${p.delay}s`,
              animationDuration: `${p.dur}s`, '--sway': `${p.sway}vw`, '--spin': `${p.spin}deg`,
            }} />
          ))}
        </div>
      )}
    </>
  );
}
