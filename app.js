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
    // Generate dummy CSV export content based on demonstration data
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

// 5. Secure Logout Handler
function logoutUser() {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "index.html";
}
