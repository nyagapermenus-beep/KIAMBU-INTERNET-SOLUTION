// Replace with your Google Cloud OAuth Client ID when connecting your custom domain
const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_://googleusercontent.com";

// Initialize default seed data matching Chapter 2 UI Models
function initStorage() {
    if (!localStorage.getItem('kis_users')) {
        const defaultUsers = [
            { username: 'admin', email: 'admin@kiambuinetsolutions.co.ke', password: 'password123', role: 'Management' },
            { username: 'permenus', email: 'permenus@kiambuinetsolutions.co.ke', password: 'password123', role: 'Technician' }
        ];
        localStorage.setItem('kis_users', JSON.stringify(defaultUsers));
    }

    if (!localStorage.getItem('kis_devices')) {
        const defaultDevices = [
            { id: 1, name: 'Core-Router-1', ip: '192.168.1.1', type: 'Router', status: 'Up', lastPolled: '2 min ago' },
            { id: 2, name: 'Switch-Floor2', ip: '192.168.1.5', type: 'Switch', status: 'Up', lastPolled: '2 min ago' },
            { id: 3, name: 'AP-Reception', ip: '192.168.1.20', type: 'Access Point', status: 'Down', lastPolled: '9 min ago' },
            { id: 4, name: 'Core-Router-2', ip: '192.168.1.2', type: 'Router', status: 'Up', lastPolled: '1 min ago' }
        ];
        localStorage.setItem('kis_devices', JSON.stringify(defaultDevices));
    }

    if (!localStorage.getItem('kis_logs')) {
        const defaultLogs = [
            { timestamp: '2026-11-09 08:00:01', device: 'Core-Router-1', bytesInMB: 1228.8, bytesOutMB: 819.2, status: 'Normal' },
            { timestamp: '2026-11-09 08:00:01', device: 'Switch-Floor2', bytesInMB: 450.0, bytesOutMB: 300.0, status: 'Normal' },
            { timestamp: '2026-11-09 08:00:01', device: 'AP-Reception', bytesInMB: 0, bytesOutMB: 0, status: 'Unreachable' },
            { timestamp: '2026-11-09 08:05:01', device: 'Core-Router-1', bytesInMB: 1433.6, bytesOutMB: 921.6, status: 'Normal' }
        ];
        localStorage.setItem('kis_logs', JSON.stringify(defaultLogs));
    }
}

initStorage();

function getUsers() { return JSON.parse(localStorage.getItem('kis_users') || '[]'); }
function saveUsers(users) { localStorage.setItem('kis_users', JSON.stringify(users)); }

function getDevices() { return JSON.parse(localStorage.getItem('kis_devices') || '[]'); }
function saveDevices(devices) { localStorage.setItem('kis_devices', JSON.stringify(devices)); }

function getLogs() { return JSON.parse(localStorage.getItem('kis_logs') || '[]'); }
function saveLogs(logs) { localStorage.setItem('kis_logs', JSON.stringify(logs)); }

function getCurrentUser() { return JSON.parse(localStorage.getItem('kis_current_user') || 'null'); }

function requireAuth() {
    const user = getCurrentUser();
    if (!user) {
        window.location.href = 'index.html';
        return null;
    }
    const navUser = document.getElementById('nav-username');
    if (navUser) navUser.textContent = user.username;
    return user;
}

function logoutUser() {
    localStorage.removeItem('kis_current_user');
    window.location.href = 'index.html';
}

function formatMB(mb) {
    if (mb <= 0) return '0 MB';
    if (mb >= 1024) return (mb / 1024).toFixed(1) + ' GB';
    return Math.round(mb) + ' MB';
}

// Decode Google JWT Credential on Frontend (GitHub Pages compatible)
function handleGoogleCredentialResponse(response) {
    try {
        const base64Url = response.credential.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(decodeURIComponent(atob(base64).split('').map(c =>
            '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        ).join('')));

        const users = getUsers();
        let existing = users.find(u => u.email === payload.email);

        if (!existing) {
            existing = {
                username: payload.name || payload.email.split('@')[0],
                email: payload.email,
                password: null,
                role: 'Technician',
                googleId: payload.sub
            };
            users.push(existing);
            saveUsers(users);
        }

        localStorage.setItem('kis_current_user', JSON.stringify(existing));
        window.location.href = 'dashboard.html';
    } catch (e) {
        alert('Google Sign-In error: ' + e.message);
    }
}

// Run Simulated SNMP Poll across all devices
function runSnmpPoll() {
    const devices = getDevices();
    const logs = getLogs();
    const now = new Date();
    const ts = now.toISOString().replace('T', ' ').substring(0, 19);

    devices.forEach(dev => {
        dev.lastPolled = 'Just now';
        if (dev.status === 'Up') {
            const inMB = +(Math.random() * 1200 + 250).toFixed(1);
            const outMB = +(Math.random() * 800 + 150).toFixed(1);
            logs.unshift({ timestamp: ts, device: dev.name, bytesInMB: inMB, bytesOutMB: outMB, status: 'Normal' });
        } else {
            logs.unshift({ timestamp: ts, device: dev.name, bytesInMB: 0, bytesOutMB: 0, status: 'Unreachable' });
        }
    });

    saveDevices(devices);
    saveLogs(logs);
}
