import { useEffect, useState } from 'react';
import { THEME } from './theme/themes.js';
import Petals from './components/Petals.jsx';
import Intro from './components/Intro.jsx';
import Invitation from './components/Invitation.jsx';

export default function App() {
  const [open, setOpen] = useState(false);
  const [introUnmounted, setIntroUnmounted] = useState(false);

  useEffect(() => {
    const s = document.documentElement.style;
    s.setProperty('--page', THEME.page);
    s.setProperty('--wash', THEME.wash);
    s.setProperty('--surface', THEME.surface);
    s.setProperty('--deep', THEME.deep);
    s.setProperty('--text', THEME.text);
    s.setProperty('--dim', THEME.dim);
    s.setProperty('--line', THEME.line);
    s.setProperty('--gold', THEME.gold);
    s.setProperty('--gold-lt', THEME.goldLt);
    s.setProperty('--gold-dk', THEME.goldDk);
    s.setProperty('--accent', THEME.accent);
    document.querySelector('meta[name=theme-color]')?.setAttribute('content', THEME.page);
  }, []);

  // The page is held still under the opening film, so the sequence cannot be
  // scrolled past before it has played.
  useEffect(() => {
    document.body.classList.toggle('locked', !open);
    return () => document.body.classList.remove('locked');
  }, [open]);

  // Anyone arriving with reduced motion set skips the gate entirely.
  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) setOpen(true);
  }, []);

  return (
    <>
      <Petals burst={open} />
      {!introUnmounted && (
        <Intro
          onStartOpen={() => setOpen(true)}
          onDone={() => setIntroUnmounted(true)}
        />
      )}

      <div className={`page${open ? ' open' : ''}`}>
        <main>
          <Invitation open={open} />
        </main>
      </div>
    </>
  );
}
