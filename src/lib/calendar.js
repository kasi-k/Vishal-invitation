// Shared by Actions.jsx (the calendar/maps/share row) and Rsvp.jsx (the
// post-submit modal) so both offer the same "add to calendar" behaviour
// without keeping two copies of the ICS/Google Calendar URL logic in sync.

// The CRLF line endings are what the iCalendar spec requires — several
// clients reject the file without them.
export function icsFile(e) {
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

export function googleCalendarUrl(e) {
  const f = (iso) => new Date(iso).toISOString().replace(/[-:]|\.\d{3}/g, '');
  const q = new URLSearchParams({
    action: 'TEMPLATE', text: e.title, dates: `${f(e.startsAt)}/${f(e.endsAt)}`,
    details: 'With great joy and the blessings of our families.', location: e.address,
  });
  return `https://calendar.google.com/calendar/render?${q}`;
}

export function downloadIcs(event) {
  const url = URL.createObjectURL(new Blob([icsFile(event)], { type: 'text/calendar;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = url; a.download = 'engagement-vishal-malarvizhi.ics';
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
