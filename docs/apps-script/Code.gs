/**
 * Trikonam Student Hub — the Welcome System receiver (v2.1)
 * --------------------------------------------------------
 * ONE Apps Script backend for every registration journey on the website. Each submission
 * arrives as a POST (application/x-www-form-urlencoded) carrying a `category` + `sheet`
 * (from src/content/registration.ts). This script:
 *   1. routes the row to the correct tab of this spreadsheet (auto-created on demand),
 *   2. seeds internal CRM columns on each tab,
 *   3. emails the team the full details, and
 *   4. emails the visitor a warm autoresponder.
 *
 * The website posts with `mode: 'no-cors'`, so it never reads this response — it shows its
 * own confirmation screen. No CORS headers needed.
 *
 * SETUP / REDEPLOY: see README.md. In short — paste this file into the bound Apps Script,
 * then Deploy → Manage deployments → Edit → New version (the /exec URL stays the same, so
 * no website change is needed). Optionally rename this spreadsheet "Trikonam Student Hub".
 */

var TEAM_EMAIL = 'projecttrikonam@gmail.com';

// Internal-only CRM columns, seeded first on every tab (for Trikonam admins).
var CRM_COLUMNS = [
  'Timestamp',
  'Status',
  'Payment Status',
  'Payment Link Sent',
  'Assigned Teacher',
  'Assigned Batch',
  'Follow-up Date',
  'Internal Notes',
];

// Fallback category → tab map (used if a submission omits `sheet`).
var CATEGORY_SHEETS = {
  'classical-hatha-yoga': 'Classical Hatha Yoga',
  'online-programs': 'Online Programs',
  'group-workshops': 'Group Workshops',
  'private-sessions': 'Private Sessions',
  'childrens-programs': "Children's Programs",
  'retreats': 'Retreats',
  'corporate-wellness': 'Corporate Wellness',
  'enquiry': 'Contact Enquiries',
};

// Routing / meta keys that should not become their own data columns.
var META_KEYS = { category: 1, sheet: 1, formType: 1, submittedAt: 1 };

function doPost(e) {
  try {
    var data = (e && e.parameter) ? e.parameter : {};
    var sheetName = data.sheet || CATEGORY_SHEETS[data.category] || 'Submissions';

    appendRow_(sheetName, data);
    emailTeam_(sheetName, data);
    emailVisitor_(data);

    return json_({ ok: true });
  } catch (err) {
    try { appendRow_('Errors', { error: String(err), raw: JSON.stringify(e && e.parameter) }); } catch (_) {}
    return json_({ ok: false, error: String(err) });
  }
}

// Health check when visiting the /exec URL in a browser.
function doGet() {
  return json_({ ok: true, service: 'Trikonam Student Hub' });
}

/** Append a submission to its tab, seeding CRM columns and growing data columns. */
function appendRow_(sheetName, data) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName) || ss.insertSheet(sheetName);

  // Incoming data columns (prettified labels), excluding routing/meta keys.
  var incoming = [];
  Object.keys(data).forEach(function (k) {
    if (!META_KEYS[k]) incoming.push(k);
  });

  var headers = sheet.getLastColumn() > 0
    ? sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
    : [];

  if (headers.length === 0) {
    headers = CRM_COLUMNS.concat(incoming.map(pretty_));
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight('bold');
    sheet.setFrozenRows(1);
  } else {
    var added = false;
    incoming.forEach(function (k) {
      if (headers.indexOf(pretty_(k)) === -1) { headers.push(pretty_(k)); added = true; }
    });
    if (added) sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight('bold');
  }

  var byLabel = {};
  incoming.forEach(function (k) { byLabel[pretty_(k)] = data[k]; });

  var row = headers.map(function (h) {
    if (h === 'Timestamp') return data.submittedAt || new Date().toISOString();
    if (h === 'Status') return 'New';
    if (CRM_COLUMNS.indexOf(h) !== -1) return ''; // other CRM columns left blank for admins
    return byLabel[h] !== undefined ? byLabel[h] : '';
  });
  sheet.appendRow(row);
}

/** Email the team the full submission. */
function emailTeam_(sheetName, data) {
  var who = data.name || data.contactPerson || data.guardianName || data.company || 'New';
  var subject = 'New ' + (data.journey || sheetName) + ' — ' + who + ' — Trikonam';
  var lines = [];
  Object.keys(data).forEach(function (k) {
    if (META_KEYS[k]) return;
    if (data[k]) lines.push(pretty_(k) + ': ' + data[k]);
  });
  var body = 'A new submission has arrived from the website (' + sheetName + ').\n\n' + lines.join('\n');
  MailApp.sendEmail({ to: TEAM_EMAIL, subject: subject, body: body, replyTo: data.email || TEAM_EMAIL });
}

/** Email the visitor a warm autoresponder (only if a plausible email was given). */
function emailVisitor_(data) {
  var email = (data.email || '').trim();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return;

  var subject = 'We’ve received your registration | Trikonam';
  var body = [
    'Thank you for taking the first step with Trikonam.',
    '',
    'We have successfully received your registration.',
    '',
    'Here’s what happens next.',
    '',
    '1. We’ll review your registration.',
    '2. We’ll send your payment link.',
    '3. We’ll confirm your batch.',
    '4. We’ll send your joining instructions.',
    '',
    'We look forward to welcoming you.',
    '',
    'Warm regards,',
    'Trikonam',
  ].join('\n');

  try {
    MailApp.sendEmail({ to: email, subject: subject, body: body, name: 'Trikonam', replyTo: TEAM_EMAIL });
  } catch (_) {
    // A bad address must never drop the row or the internal email.
  }
}

function pretty_(key) {
  if (key === 'journey') return 'Journey';
  return key.replace(/([A-Z])/g, ' $1').replace(/^./, function (c) { return c.toUpperCase(); });
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
