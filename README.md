# Network Traffic Monitoring System

## GitHub Pages frontend
The `index.html` file is configured to use the deployed backend by default:
`https://kiambu-internet-solution.onrender.com`

Upload `index.html` to the existing GitHub repository's published folder (`docs` if your Pages setting uses `/docs`). If the site already uses the repository root, replace the existing `index.html` there instead. Keep the rest of your repository files unchanged unless you know they belong to this project.

## Login
- Username: `matrix`
- Password: `matrix123`
- Enter both manually; the fields are not prefilled and login is not automatic.

The backend also needs the Render environment variables `ADMIN_USERNAME=matrix` and `ADMIN_PASSWORD=matrix123`, plus `FIREBASE_SERVICE_ACCOUNT_JSON` configured privately in Render. Do not put Firebase service-account credentials in GitHub or this frontend.

## Included pages and functions
- Dashboard: registered devices, online/offline counts, and recent traffic
- Devices: insert, view, update, and delete device records
- Traffic Log: search by device/IP and filter by traffic status
- Reports: summary totals and print/save as PDF

Traffic measurements must be submitted by a configured monitoring agent or gateway. The browser does not independently capture packets or scan private-network devices. Online/offline state is based on the status stored in the backend; automatic timeout-based offline detection is not included in this version.

## Important security note
The current backend validates the login form, but device-management API routes are not all protected by a server-side authenticated session. Treat this as a project/demo deployment and do not expose sensitive network data until API authorization is implemented.
