import { useEffect, useState } from 'react';

const pad = (n) => String(n).padStart(2, '0');
const split = (ms) => {
  const s = Math.max(0, Math.floor(ms / 1000));
  return { d: Math.floor(s / 86400), h: Math.floor(s / 3600) % 24,
           m: Math.floor(s / 60) % 60, s: s % 60 };
};

export default function Countdown({ startsAt }) {
  const target = new Date(startsAt).getTime();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  if (now >= target) return <p className="cd-past">The day is here — with all our love.</p>;
  const t = split(target - now);

  return (
    <div className="cd" aria-label="Time remaining until the ceremony">
      {[['Days', t.d], ['Hours', pad(t.h)], ['Minutes', pad(t.m)], ['Seconds', pad(t.s)]]
        .map(([label, value], i) => (
          <div className="cd-cell" key={label} style={{ '--d': `${0.1 * i}s` }}>
            <span className="cd-num">{value}</span>
            <span className="cd-lbl">{label}</span>
          </div>
        ))}
    </div>
  );
}
