/**
 * Trikonam — Online Programs form receiver (v2.0)
 * ------------------------------------------------
 * Receives registration & corporate-enquiry submissions from the website
 * (POST, application/x-www-form-urlencoded) and:
 *   1. appends each one to a tab in this Google Sheet, and
 *   2. emails a copy to the team.
 *
 * The website posts with `mode: 'no-cors'`, so it never reads this response — it just
 * shows its own confirmation screen. This script therefore does not need CORS headers.
 *
 * SETUP: see README.md in this folder. In short — create a Google Sheet, open
 * Extensions → Apps Script, paste this file, set TEAM_EMAIL below, then Deploy as a
 * Web App (Execute as: Me, Who has access: Anyone) and paste the /exec URL into
 * `siteConfig.forms.appsScript` in the website.
 */

// Where to email each submission. Keep in sync with the site's contact email.
var TEAM_EMAIL = 'projecttrikonam@gmail.com';

function doPost(e) {
  try {
    var data = (e && e.parameter) ? e.parameter : {};
    var formType = data.formType || 'submission';
    var isCorporate = formType === 'corporate-enquiry';
    var tabName = isCorporate ? 'Corporate' : 'Registrations';

    appendRow_(tabName, data);
    sendEmail_(formType, isCorporate, data);

    return json_({ ok: true });
  } catch (err) {
    // Still record the failure so nothing is silently lost.
    try { appendRow_('Errors', { error: String(err), raw: JSON.stringify(e && e.parameter) }); } catch (_) {}
    return json_({ ok: false, error: String(err) });
  }
}

// Simple health check when visiting the /exec URL in a browser.
function doGet() {
  return json_({ ok: true, service: 'Trikonam form receiver' });
}

/** Append a submission to a sheet tab, growing the header row as new fields appear. */
function appendRow_(tabName, data) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(tabName) || ss.insertSheet(tabName);

  var headers = sheet.getLastColumn() > 0
    ? sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
    : [];

  if (headers.length === 0) {
    headers = ['submittedAt'];
    Object.keys(data).forEach(function (k) { if (headers.indexOf(k) === -1) headers.push(k); });
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight('bold');
  } else {
    // Add any keys we haven't seen before as new columns.
    var added = false;
    Object.keys(data).forEach(function (k) {
      if (headers.indexOf(k) === -1) { headers.push(k); added = true; }
    });
    if (added) sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight('bold');
  }

  var row = headers.map(function (h) {
    if (h === 'submittedAt') return data.submittedAt || new Date().toISOString();
    return data[h] !== undefined ? data[h] : '';
  });
  sheet.appendRow(row);
}

/** Email a readable copy of the submission to the team. */
function sendEmail_(formType, isCorporate, data) {
  var subject = isCorporate
    ? 'Corporate Enquiry — ' + (data.company || 'New') + ' — Trikonam'
    : 'Online Registration — ' + (data.name || 'New') + ' — Trikonam';

  var lines = [];
  Object.keys(data).forEach(function (k) {
    if (k === 'formType') return;
    if (data[k]) lines.push(prettify_(k) + ': ' + data[k]);
  });
  var body = 'A new ' + (isCorporate ? 'corporate enquiry' : 'registration') +
    ' has arrived from the website.\n\n' + lines.join('\n');

  MailApp.sendEmail({ to: TEAM_EMAIL, subject: subject, body: body, replyTo: data.email || TEAM_EMAIL });
}

function prettify_(key) {
  return key.replace(/([A-Z])/g, ' $1').replace(/^./, function (c) { return c.toUpperCase(); });
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
