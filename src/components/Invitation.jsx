import { invite, event } from '../data.js';
import Script from './Script.jsx';
import Tracked from './Tracked.jsx';
import Countdown from './Countdown.jsx';
import Actions from './Actions.jsx';
import Rsvp from './Rsvp.jsx';
import { useReveal } from '../hooks/useReveal.js';

// The whole invitation, in one section, set directly on the painted scene.
//
// The crest carries the full names and each family, so the couple is named once
// and in full; the body below is only what follows from that — the message, the
// when and where, and how to reply.
export default function Invitation({ open, onCelebrate }) {
  const [bodyRef, bodyShown] = useReveal({ threshold: 0.01, rootMargin: '0px 0px 50px 0px' });
  const isShown = open || bodyShown;
  // Unlike the rest of .body, this one stays gated purely on scroll — the
  // crest is visible in the first viewport so its reveal plays on landing,
  // but "Save the date" sits below the fold; if it rode `isShown` too it
  // would fire (and finish) off-screen the instant the intro ends, so by the
  // time a visitor scrolls down it would already look static.
  const [whenRef, whenShown] = useReveal();

  return (
    <section className={`invite${open ? ' in' : ''}`} id="invitation">
      <div className="scene-art" aria-hidden="true">
        <img
          className="scene-img"
          src="/media/scene-1800.webp"
          srcSet="/media/scene-1200.webp 1200w, /media/scene-1800.webp 1800w"
          sizes="100vw" alt="" decoding="async" fetchPriority="high"
        />
        <span className="scene-veil" />
      </div>

      <div className="invite-flow">
        <header className="crest">
          <span className="ganesha-mark" aria-hidden="true" />

          <Tracked className="crest-eyebrow" text={invite.eyebrow} />

          <div className="crest-couple">
            <div className="who">
              <div className="names-wrap">
                <Script as="h1" className="crest-name" delay={0.7}>{invite.groom.name}</Script>
                <span className="glints" aria-hidden="true">
                  {[[16, 30], [44, 16], [72, 66], [90, 34]].map(([x, y], i) => (
                    <span key={i} className="glint" style={{ '--x': `${x}%`, '--y': `${y}%`, '--i': i }} />
                  ))}
                </span>
              </div>
              <p className="crest-of" style={{ '--d': '1.25s' }}>{invite.groom.parents}</p>
            </div>

            <div className="crest-join" style={{ '--d': '1.45s' }}>
              <span className="crest-join-line" aria-hidden="true" />
              <em>{invite.joiner}</em>
              <span className="crest-join-line" aria-hidden="true" />
            </div>

            <div className="who">
              <div className="names-wrap">
                <Script as="h1" className="crest-name" delay={1.6}>{invite.bride.name}</Script>
                <span className="glints" aria-hidden="true">
                  {[[10, 62], [38, 22], [66, 70], [88, 28]].map(([x, y], i) => (
                    <span key={i} className="glint" style={{ '--x': `${x}%`, '--y': `${y}%`, '--i': i + 4 }} />
                  ))}
                </span>
              </div>
              <p className="crest-of" style={{ '--d': '2.15s' }}>{invite.bride.parents}</p>
            </div>
          </div>
        </header>

        <div className={`body${isShown ? ' in' : ''}`} ref={bodyRef}>
          <p className="note">
            {invite.message.map((line, i) => (
              <span key={i} style={{ '--d': `${0.2 + i * 0.14}s` }}>{line}</span>
            ))}
          </p>

          <span className="hair" aria-hidden="true" />

          <div className={`when-block${whenShown ? ' in' : ''}`} ref={whenRef}>
            <p className="when-label when-fade">Save the date</p>
            <p className="when-date">{event.dateLabel}</p>
            <p className="when-at when-fade">{event.timeLabel}</p>
            <p className="where when-fade">
              {event.venue}<br /><span>{event.city}</span>
            </p>
          </div>

          <Countdown startsAt={event.startsAt} />
          <Actions event={event} />

          <Rsvp event={event} onCelebrate={onCelebrate} />

          <p className="sign-off">{invite.awaiting}</p>
          <p className="guests">{invite.guests}</p>
        </div>
      </div>
    </section>
  );
}
