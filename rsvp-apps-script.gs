// Google Apps Script webhook for the RSVP form on the invitation site.
// Not part of the build — this file lives here for reference only. Paste its
// contents into script.google.com bound to your Google Sheet (see README
// section "RSVP setup" for the full walkthrough).

function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('RSVPs')
    || SpreadsheetApp.getActiveSpreadsheet().insertSheet('RSVPs');

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Timestamp', 'Name', 'Attending', 'Guest Count', 'Vehicle', 'Phone', 'Message']);
  }

  const data = e.parameter;
  sheet.appendRow([
    data.timestamp || new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
    data.name || "",
    data.attending || "",
    data.guestCount || "",
    data.vehicle || "",
    data.phone || "",
    data.message || "",
  ]);

  return ContentService.createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
