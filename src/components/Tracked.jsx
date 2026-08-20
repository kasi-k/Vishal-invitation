// Letter-spaced caps, split for the stagger animation.
//
// Split per character and the browser will break a line between any two letters
// ("ENGAGEME / NT CEREMONY"). Splitting per word first, with each word held
// together, keeps the per-letter reveal but only ever breaks at a space.
//
// The spaces are siblings of the words, not children: when they lived inside the
// word span they were its last child, and the rule that trims the trailing
// letter-space landed on the space itself and closed the gap up entirely.
export default function Tracked({ text, className = '', base = 0.35, step = 0.04 }) {
  let n = -1;
  return (
    <span className={className}>
      {text.split(' ').map((word, w, all) => (
        <span key={w}>
          <span className="tw">
            {word.split('').map((ch, i) => {
              n += 1;
              return <span className="tl" key={i} style={{ '--wd': `${base + n * step}s` }}>{ch}</span>;
            })}
          </span>
          {w < all.length - 1 && <span className="tsp"> </span>}
        </span>
      ))}
    </span>
  );
}
