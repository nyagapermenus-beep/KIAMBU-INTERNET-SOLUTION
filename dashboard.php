<?php
session_start();
if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
    header('Location: index.php');
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NetPulse - Dashboard</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body class="bg-slate-950 text-slate-100 p-8">
    <div class="max-w-4xl mx-auto space-y-6">
        <div class="flex justify-between items-center bg-slate-900 p-6 rounded-2xl border border-slate-800">
            <div>
                <h1 class="text-xl font-bold">Kiambu Internet Solutions - Live Monitoring</h1>
                <p class="text-xs text-cyan-400 mt-1">Logged in as: matrix | <a href="devices.php" class="underline">Devices</a> | <a href="reports.php" class="underline">Reports</a></p>
            </div>
            <a href="logout.php" class="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl text-xs font-semibold">Logout</a>
        </div>
        <div class="bg-slate-900 p-6 rounded-2xl border border-slate-800">
            <h3 class="font-bold text-sm mb-4">Real-Time Traffic Utilization (Mbps)</h3>
            <div class="h-64"><canvas id="trafficChart"></canvas></div>
        </div>
    </div>
    <script>
        const ctx = document.getElementById('trafficChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['10:00', '10:10', '10:20', '10:30', '10:40', '10:50'],
                datasets: [{ label: 'Bandwidth (Mbps)', data: [35, 52, 48, 65, 72, 84.5], borderColor: '#06b6d4', tension: 0.4 }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });
    </script>
</body>
</html>