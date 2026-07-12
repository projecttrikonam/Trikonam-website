# Online Programs forms — Google Apps Script backend

The website's **Online Registration** and **Corporate Enquiry** forms POST to a Google
Apps Script Web App that (1) logs each submission to a Google Sheet and (2) emails your
team. No payment gateway — you send payment links manually by email afterward.

This is a **one-time setup**. After it's done, the forms work forever.

## Setup (≈5 minutes)

1. **Create a Google Sheet** — go to <https://sheets.new>, name it e.g. "Trikonam Registrations".
2. In that sheet, open **Extensions → Apps Script**. Delete the sample `myFunction` code.
3. **Paste** the entire contents of [`Code.gs`](./Code.gs) into the editor.
4. Confirm the `TEAM_EMAIL` line near the top is the address that should receive
   submissions (default: `projecttrikonam@gmail.com`). Save (⌘/Ctrl-S).
5. Click **Deploy → New deployment**. Choose type **Web app**. Set:
   - **Execute as:** Me
   - **Who has access:** **Anyone**
6. Click **Deploy**, then **Authorize access** and allow the permissions (Sheets + send
   email as you). Google may show an "unverified app" screen — click *Advanced → Go to
   (project) → Allow*; this is your own script.
7. Copy the **Web app URL** (it ends in `/exec`).

## Connect it to the website

Paste that `/exec` URL into **`src/content/site-config.ts`**:

```ts
forms: {
  // …
  appsScript: 'https://script.google.com/macros/s/AKfyc…/exec',
},
```

Commit + push — Cloudflare redeploys and the forms go live. That's the only change needed.

## How it behaves

- Each submission adds a row to a **Registrations** or **Corporate** tab (columns are
  created automatically) and emails you a readable copy (with the person's email as
  reply-to, so you can respond directly).
- Until the URL is set, the forms **fall back to opening a pre-filled email** so no
  registration is ever lost during setup.

## Updating the script later

If you edit `Code.gs`, redeploy with **Deploy → Manage deployments → (edit) → New
version**. The `/exec` URL stays the same, so no website change is needed.
