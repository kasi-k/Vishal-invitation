import { useState } from 'react';

// Apps Script web apps don't send CORS headers back to a cross-origin fetch,
// so the response is opaque either way — 'no-cors' just skips pretending we
// can read it. The row still lands in the sheet; a thrown TypeError here
// means the request never went out at all (offline, blocked, bad URL).
async function post(url, fields) {
  await fetch(url, { method: 'POST', mode: 'no-cors', body: new URLSearchParams(fields) });
}

// type="number" lets 'e', '+', '-', and the scroll wheel silently change the
// value, and its spinner UI doesn't match the rest of the form. Plain text
// with digit stripping avoids all of that while still popping the numeric
// keypad on mobile via inputMode.
const digitsOnly = (s) => s.replace(/\D+/g, '');
const clamp = (s, min, max, fallback) => (s === '' ? fallback : Math.min(max, Math.max(min, Number(s))));

export default function Rsvp({ event, onCelebrate }) {
  const [name, setName] = useState('');
  const [attending, setAttending] = useState(null); // 'yes' | 'no'
  const [guests, setGuests] = useState('1');
  const [vehicle, setVehicle] = useState('None');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error

  if (!event.rsvpScriptUrl) {
    return (
      <div className="rsvp">
        <h3>RSVP</h3>
        <p className="rsvp-hint">
          To collect replies here, deploy the Apps Script webhook and paste its URL into
          {' '}<code>event.rsvpScriptUrl</code> in <code>src/data.js</code>.
        </p>
      </div>
    );
  }

  const submit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !attending || phone.length !== 10 || status === 'sending') return;
    setStatus('sending');
    try {
      await post(event.rsvpScriptUrl, {
        name: name.trim(),
        attending,
        guestCount: attending === 'yes' ? String(clamp(guests, 1, 20, 1)) : '0',
        vehicle: attending === 'yes' ? vehicle : 'None',
        phone,
        message: message.trim(),
      });
      setStatus('sent');
      onCelebrate?.();
    } catch {
      setStatus('error');
    }
  };

  if (status === 'sent') {
    return (
      <div className="rsvp">
        <h3>RSVP</h3>
        <p className="rsvp-sent">
          {attending === 'yes'
            ? "Thank you — we can't wait to celebrate with you!"
            : "Thank you for letting us know — you'll be missed."}
        </p>
      </div>
    );
  }

  return (
    <div className="rsvp">
      <h3>RSVP</h3>
      <form className="rsvp-form" onSubmit={submit}>
        <label className="rf-field">
          <span>Your name</span>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                 required autoComplete="name" placeholder="Full name" />
        </label>

        <div className="rf-field">
          <span>Will you be joining us?</span>
          <div className="rf-toggle" role="radiogroup" aria-label="Attending">
            <button type="button" className={`rf-pill${attending === 'yes' ? ' on' : ''}`}
                    aria-pressed={attending === 'yes'} onClick={() => setAttending('yes')}>
              Joyfully accept
            </button>
            <button type="button" className={`rf-pill${attending === 'no' ? ' on' : ''}`}
                    aria-pressed={attending === 'no'} onClick={() => setAttending('no')}>
              Regretfully decline
            </button>
          </div>
        </div>

        <label className="rf-field">
          <span>Phone number</span>
          <input type="text" inputMode="numeric" pattern="[0-9]*" maxLength={10}
                 value={phone} onChange={(e) => setPhone(digitsOnly(e.target.value))}
                 required placeholder="10-digit mobile number" autoComplete="tel" />
        </label>

        {attending === 'yes' && (
          <div className="rf-row">
            <label className="rf-field rf-num">
              <span>Guests (incl. you)</span>
              <input type="text" inputMode="numeric" pattern="[0-9]*" maxLength={2}
                     value={guests} onChange={(e) => setGuests(digitsOnly(e.target.value))}
                     onBlur={() => setGuests(String(clamp(guests, 1, 20, 1)))} />
            </label>
            <label className="rf-field rf-num">
              <span>Vehicle</span>
              <select value={vehicle} onChange={(e) => setVehicle(e.target.value)}>
                <option value="None">None</option>
                <option value="Bike">Bike</option>
                <option value="Cab">Cab</option>
                <option value="Four Wheeler">Four Wheeler</option>
              </select>
            </label>
          </div>
        )}

        <label className="rf-field">
          <span>A message for the couple (optional)</span>
          <textarea value={message} onChange={(e) => setMessage(e.target.value)}
                    rows={3} placeholder="Your wishes…" />
        </label>

        <button className="btn btn-solid rf-submit" type="submit"
                disabled={!name.trim() || !attending || phone.length !== 10 || status === 'sending'}>
          {status === 'sending' ? 'Sending…' : 'Send RSVP'}
        </button>

        {status === 'error' && (
          <p className="rf-error">Something went wrong — please try again, or reach out to us directly.</p>
        )}
      </form>
    </div>
  );
}
