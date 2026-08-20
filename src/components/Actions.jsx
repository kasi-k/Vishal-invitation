import { useState } from 'react';

// The calendar file is assembled in the page: no server, works offline, and the
// CRLF line endings are what the iCalendar spec requires — several clients
// reject the file without them.
function ics(e) {
  const stamp = (iso) => new Date(iso).toISOString().replace(/[-:]|\.\d{3}/g, '');
  const esc = (s) => s.replace(/([,;\\])/g, '\\$1');
  return [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//invitation//EN', 'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${stamp(e.startsAt)}-vishal-malarvizhi@invitation`,
    `DTSTAMP:${stamp(new Date().toISOString())}`,
    `DTSTART:${stamp(e.startsAt)}`, `DTEND:${stamp(e.endsAt)}`,
    `SUMMARY:${esc(e.title)}`, `LOCATION:${esc(e.address)}`,
    'END:VEVENT', 'END:VCALENDAR',
  ].join('\r\n');
}

const gcal = (e) => {
  const f = (iso) => new Date(iso).toISOString().replace(/[-:]|\.\d{3}/g, '');
  const q = new URLSearchParams({
    action: 'TEMPLATE', text: e.title, dates: `${f(e.startsAt)}/${f(e.endsAt)}`,
    details: 'With great joy and the blessings of our families.', location: e.address,
  });
  return `https://calendar.google.com/calendar/render?${q}`;
};

export default function Actions({ event }) {
  const [copied, setCopied] = useState(false);

  const download = () => {
    const url = URL.createObjectURL(new Blob([ics(event)], { type: 'text/calendar;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url; a.download = 'engagement-vishal-malarvizhi.ics';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

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
      <a className="btn" href={gcal(event)} target="_blank" rel="noreferrer">Add to Google Calendar</a>
      <button className="btn" type="button" onClick={download}>Apple / Outlook (.ics)</button>
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
