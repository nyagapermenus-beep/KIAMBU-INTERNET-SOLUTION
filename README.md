# Kiambu Internet Solutions — Network Traffic Monitoring System

## Project structure

- `index.html` — login page (uses the supplied network monitoring image).
- `signup.html` — account registration.
- `dashboard.html` — network overview.
- `devices.html` — device management (add, edit, delete).
- `traffic-log.html` — searchable traffic records.
- `reports.html` — summary, CSV export and print/PDF.
- `css/style.css` — shared styling.
- `js/app.js` — shared browser-side functions and demonstration data.
- `assets/network-login.png` — supplied login background image.

## Run on GitHub Pages

Upload the complete folder contents to the root of your GitHub repository, preserving the folders. In GitHub, enable Pages from the branch and root folder. Open the published site at its GitHub Pages URL.

## Demonstration account

The browser-side seed data creates:
- Username: `admin`
- Password: `password123`

A second sample account is also seeded:
- Username: `permenus`
- Password: `password123`

Change/remove demonstration credentials before presenting publicly.

## Important implementation note

This is a static front-end reconstruction based on the HTML and JavaScript supplied in the conversation. It stores accounts, devices and logs in the browser's `localStorage`. This is suitable only for a classroom UI demonstration. It is **not secure authentication**: passwords are not protected by a server, and users can alter local browser storage.

The `Run demo poll` action creates simulated traffic records. It does **not** perform real SNMP polling, reachability checks, or collect actual network packets. Real monitoring requires the project's trusted backend and a network-side agent/service. Do not describe these simulated records as live measurements.

Google OAuth is not enabled in this reconstruction. A real Google sign-in integration requires a configured OAuth client and server-side token validation or a correctly configured identity provider.

## Before publishing

1. Remove or change sample accounts and passwords.
2. Do not put secrets, API service-role keys, or database passwords in frontend JavaScript.
3. Connect authentication and monitoring to the intended backend before using real users or real network data.
