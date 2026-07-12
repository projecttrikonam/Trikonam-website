# Trikonam Student Hub — Welcome System backend

Every registration journey on the website (Classical Hatha Yoga, Online Programs, Group
Workshops, Private Sessions, Children's Programs, Retreats, Corporate Wellness, and a
general Enquiry) posts to **one** Google Apps Script Web App. It (1) routes each submission
to its own tab in this spreadsheet, (2) seeds internal CRM columns, (3) emails your team the
full details, and (4) emails the visitor a warm autoresponder. No payment gateway — you send
payment links manually afterward.

## Updating to v2.1 (you already have the script deployed)

You do **not** need a new spreadsheet or a new URL — just update the code and redeploy:

1. Open your existing sheet → **Extensions → Apps Script**.
2. Select all the code and replace it with the contents of [`Code.gs`](./Code.gs). Save.
3. Confirm `TEAM_EMAIL` near the top is correct (default `projecttrikonam@gmail.com`).
4. **Deploy → Manage deployments →** click the ✏️ (edit) on your Web App → **Version: New
   version** → **Deploy**. (Execute as: Me · Who has access: Anyone.)
5. *(Optional, tidy)* rename the spreadsheet to **Trikonam Student Hub**.

That's it — the `/exec` URL is unchanged, so nothing on the website needs to change.

## First-time setup (only if you're starting fresh)

1. Create a Google Sheet at <https://sheets.new>, name it **Trikonam Student Hub**.
2. **Extensions → Apps Script**, paste [`Code.gs`](./Code.gs), save.
3. **Deploy → New deployment → Web app** — Execute as: **Me**, Who has access: **Anyone** —
   Deploy, authorize, and copy the **/exec** URL.
4. Paste that URL into `forms.appsScript` in `src/content/site-config.ts`, commit + push.

## What it does automatically

- **Tabs** are created on demand — one per journey (`Classical Hatha Yoga`, `Online
  Programs`, `Group Workshops`, `Private Sessions`, `Children's Programs`, `Retreats`,
  `Corporate Wellness`, `Contact Enquiries`).
- Each tab starts with **CRM columns** for your team: `Timestamp`, `Status` (set to *New*),
  `Payment Status`, `Payment Link Sent`, `Assigned Teacher`, `Assigned Batch`,
  `Follow-up Date`, `Internal Notes` — followed by the submitted fields (columns grow as new
  fields appear).
- **Two emails per submission:** the full details to your team (reply-to = the visitor), and
  a "We've received your registration | Trikonam" autoresponder to the visitor.

## Future-ready

The row-per-submission + status columns are designed so you can later bolt on Razorpay /
Stripe, automatic payment confirmation, Zoom/Meet links, calendar invites, reminders,
attendance, and certificates — by updating `Status` / `Payment Status` and adding columns,
without changing the website's registration experience.

## Testing

Visit the `/exec` URL in a browser → you should see `{"ok":true,"service":"Trikonam Student
Hub"}`. A real submission from the site adds a row to the matching tab and sends both emails.
