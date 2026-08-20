import { useState } from 'react';
import { googleCalendarUrl, downloadIcs } from '../lib/calendar.js';

export default function Actions({ event }) {
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const data = { title: event.title,
                   text: `${event.venue} · ${event.dateLabel}, ${event.timeLabel}`,
                   url: window.location.href };
    if (navigator.share) { try { await navigator.share(data); return; } catch { /* dismissed */ } }
    try { await navigator.clipboard.writeText(window.location.href); } catch { /* denied */ }
    setCopied(true); setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div className="actions">
      <a className="btn" href={googleCalendarUrl(event)} target="_blank" rel="noreferrer">Add to Google Calendar</a>
      <button className="btn" type="button" onClick={() => downloadIcs(event)}>Apple / Outlook (.ics)</button>
      <a className="btn" target="_blank" rel="noreferrer"
         href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.mapQuery)}`}>
        Open in Maps
      </a>
      <button className="btn btn-solid" type="button" onClick={share}>
        {copied ? 'Link copied' : 'Share'}
      </button>
    </div>
  );
}
