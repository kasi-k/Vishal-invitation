import { useEffect, useRef, useState } from 'react';
import { invite, event } from '../data.js';
import Tracked from './Tracked.jsx';

// The opening: the film plays full-bleed with the announcement set over it, and
// when it finishes the picture recedes, leaving the words before the page takes
// over.
//
// The words are deliberately present from the first frame rather than waiting
// for the film to end — that overlay is the shot the invitation opens on.
//
// Three phases — 'film', 'title', 'done'. The video drives the first handoff via
// its own `ended` event rather than a timer, so the change never lands early on a
// slow connection or late after a stall.
export default function Intro({ onStartOpen, onDone }) {
  const ref = useRef(null);
  const [phase, setPhase] = useState('film');
  const [needsTap, setNeedsTap] = useState(false);

  const reduced = typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (reduced) { onStartOpen?.(); onDone?.(); return; }
    const v = ref.current;
    if (!v) return;
    v.play().catch(() => setNeedsTap(true));
  }, [reduced, onStartOpen, onDone]);

  const finish = () => {
    if (phase === 'done') return;
    setPhase('done');
    onStartOpen?.();
    setTimeout(onDone, 850);
  };

  return (
    <div className={`intro intro-${phase}`}>
      <video
        ref={ref}
        className="intro-video"
        src="/media/ring-ceremony.mp4"
        poster="/media/ring-ceremony-poster.webp"
        muted
        playsInline
        preload="auto"
        onEnded={finish}
        aria-label="Vishal and Malarvizhi exchanging rings"
      />
      <span className="intro-veil" aria-hidden="true" />

      <div className="intro-words">
        <span className="it-rule" aria-hidden="true" />
        <Tracked className="it-eyebrow" text={invite.eyebrow} />
        <h1 className="it-names">{invite.couple}</h1>
        <p className="it-when">{event.dateLabel} &nbsp;·&nbsp; {event.timeLabel}</p>
        <p className="it-where">{event.venue}<br />{event.city}</p>
        <span className="it-rule" aria-hidden="true" />
      </div>

      {phase === 'film' && (
        <button className="intro-skip" type="button" onClick={finish}>
          {needsTap ? 'Tap to play' : 'Skip'}
        </button>
      )}
    </div>
  );
}
