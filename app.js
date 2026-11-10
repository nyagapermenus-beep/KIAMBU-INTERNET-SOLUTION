// ==========================================
// KIAMBU INTERNET SOLUTIONS - APP.JS ENGINE
// ==========================================

document.addEventListener("DOMContentLoaded", function () {
    // Initializer check for dynamic rows / storage setup
    initializeDemoData();
    renderDeviceTable();
    renderLogs();
});

// 1. Device Form Modal Controls
function openDeviceForm() {
    const panel = document.getElementById("device-form-panel");
    const form = document.getElementById("device-form");
    if (panel) {
        panel.hidden = false;
        panel.scrollIntoView({ behavior: 'smooth' });
    }
    if (form) {
        form.reset();
        const idField = document.getElementById("device-id");
        if (idField) idField.value = "";
    }
}

function closeDeviceForm() {
    const panel = document.getElementById("device-form-panel");
    if (panel) {
        panel.hidden = true;
    }
}

// 2. Demo Poll Simulation Handler
function runSnmpPoll() {
    const msg = document.getElementById("page-message") || document.querySelector(".notice");
    if (msg) {
        const originalText = msg.textContent;
        msg.textContent = "↻ Polling simulated SNMP endpoints... Data refreshed.";
        msg.style.color = "#00d2ff";
        setTimeout(() => {
            msg.textContent = originalText;
            msg.style.color = "";
        }, 3000);
    }
}

// 3. Traffic CSV Export Handler
function downloadCSV() {
    const csvContent = "data:text/csv;charset=utf-8,Timestamp,Device,Traffic In,Traffic Out,Status\n" +
        "2026-11-10 11:30:00,Core Router,10485760,5242880,Up\n" +
        "2026-11-10 11:32:15,Main Switch,3145728,1048576,Up\n" +
        "2026-11-10 11:35:40,Server 01,52428800,26214400,Up";
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "network_traffic_logs.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// 4. Print / PDF Report Handler
function printReport() {
    window.print();
}

// 5. Secure Logout Handler (Directly clears cache & redirects)
function logoutUser() {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "index.html";
}

// 6. Local Storage Fallback Data Handlers
function initializeDemoData() {
    if (!localStorage.getItem("devices")) {
        const defaultDevices = [
            { id: 1, name: "Core Router", ip: "192.168.1.1", type: "Router", status: "Up", polled: "Just now" },
            { id: 2, name: "Main Switch", ip: "192.168.1.2", type: "Switch", status: "Up", polled: "2 mins ago" }
        ];
        localStorage.setItem("devices", JSON.stringify(defaultDevices));
    }
}

function renderDeviceTable() {
    const tbody = document.getElementById("device-rows");
    if (!tbody) return;
    
    const devices = JSON.parse(localStorage.getItem("devices")) || [];
    tbody.innerHTML = "";
    
    devices.forEach(d => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${d.name}</td>
            <td>${d.ip}</td>
            <td>${d.type}</td>
            <td><span class="badge ${d.status.toLowerCase()}">${d.status}</span></td>
            <td>${d.polled}</td>
            <td><button class="btn" style="padding:4px 8px; font-size:12px;" onclick="deleteDevice(${d.id})">Remove</button></td>
        `;
        tbody.appendChild(tr);
    });

    // Update stats counters if elements exist
    const totalEl = document.getElementById("total-devices");
    const onlineEl = document.getElementById("online-devices");
    if (totalEl) totalEl.textContent = devices.length;
    if (onlineEl) onlineEl.textContent = devices.filter(d => d.status === "Up").length;
}

function renderLogs() {
    const tbody = document.getElementById("log-rows");
    if (!tbody) return;
    
    tbody.innerHTML = `
        <tr><td>2026-11-10 11:30:00</td><td>Core Router</td><td>10,485,760</td><td>5,242,880</td><td><span class="badge up">Up</span></td></tr>
        <tr><td>2026-11-10 11:32:15</td><td>Main Switch</td><td>3,145,728</td><td>1,048,576</td><td><span class="badge up">Up</span></td></tr>
    `;
    const totalLogsEl = document.getElementById("total-logs");
    if (totalLogsEl) totalLogsEl.textContent = "2";
}

function deleteDevice(id) {
    let devices = JSON.parse(localStorage.getItem("devices")) || [];
    devices = devices.filter(d => d.id !== id);
    localStorage.setItem("devices", JSON.stringify(devices));
    renderDeviceTable();
}
