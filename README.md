# Kiambu Internet Solutions – Network Traffic Monitoring System

A centralized, web-based network traffic monitoring dashboard designed for **Kiambu Internet Solutions** to replace manual notebook record-keeping with structured device tracking, automated polling logs, downtime alerts, and instant reporting.

**Submitted By:** Permenus Nyaga (`DSE-02-0224/2025`)  
**Institution:** Zetech University – Diploma in Software Engineering

---

## Live Features

* **Authentication & Access Control (`index.html`, `register.html`):**
  * Standard Technician & Management login and self-service staff sign-up.
  * Integrated **Google Sign-In (OAuth 2.0)** support for one-click authentication.
  * Animated HTML5 video and canvas network topology background.
* **Device Dashboard (`dashboard.html`):**
  * Real-time device status monitoring (`Up` / `Down`) for Routers, Switches, and Access Points.
  * Automatic **Downtime Alert Banner** highlighting unreachable devices.
  * Full CRUD device management (Add, Update, Delete device records).
  * Interactive **Chart.js** bandwidth visualization comparing Bytes In vs. Bytes Out.
* **Traffic Log & Polling (`traffic-log.html`):**
  * Timestamped traffic records tracking `Bytes In`, `Bytes Out`, and device reachability.
  * Live search and filtering by device name, timestamp, or status.
  * One-click simulated SNMP polling across all registered devices.
* **Report Generation (`reports.html`):**
  * Filterable **Traffic Summary** and **Device Status** reports by device and polling period.
  * Direct **CSV export** and **Print / Save as PDF** support.

---

## Project Structure

```text
kiambu-network-monitor/
├── index.html               # Video/Canvas Login Page + Google Sign-In
├── register.html            # Staff Account Registration
├── dashboard.html           # Device Dashboard + Downtime Alerts + Chart.js
├── traffic-log.html         # Searchable Traffic Log + Poll Trigger
├── reports.html             # CSV & PDF Report Generator
├── README.md                # Project Documentation
└── assets/
    ├── css/
    │   └── style.css        # Responsive UI & Glassmorphism Styles
    ├── js/
    │   ├── app.js           # Auth, Google OAuth, LocalStorage DB & Polling Logic
    │   └── network-bg.js    # Animated Network Particle Background
    ├── img/
    │   └── login-bg.png     # Fallback Login Poster Image
    └── video/
        └── network-bg.mp4   # Optional Looping Background Video
```

---

## Demo Login Credentials

You can test the application immediately using the pre-seeded accounts or by creating a new account via **Sign Up** / **Continue with Google**:

| Role | Username | Email | Password |
| :--- | :--- | :--- | :--- |
| **Management** | `admin` | `admin@kiambuinetsolutions.co.ke` | `password123` |
| **Technician** | `permenus` | `permenus@kiambuinetsolutions.co.ke` | `password123` |

---

## Deployment (GitHub Pages & Custom Domain)

1. Push all files to the `main` branch of your GitHub repository.
2. Navigate to **Settings → Pages** in your repository.
3. Under **Build and deployment**, choose **Deploy from a branch**, select `main` and `/ (root)`, then click **Save**.
4. *(Optional)* Enter your custom domain under **Custom domain** and configure your DNS `A` / `CNAME` records to point to GitHub Pages.
5. *(Optional)* To enable live Google OAuth on your domain, create a Web Application **OAuth Client ID** in [Google Cloud Console](https://google.com), add your domain to **Authorized JavaScript origins**, and paste your Client ID into `assets/js/app.js`.

---

## Technologies Used

* **Frontend:** HTML5, CSS3, Vanilla JavaScript (ES6+)
* **Data Visualization:** Chart.js
* **Authentication:** Google Identity Services (GSI) & LocalStorage Session Management
* **Hosting:** GitHub Pages
