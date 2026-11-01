<?php
session_start();
if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
    header('Location: index.php');
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Devices</title><script src="https://cdn.tailwindcss.com"></script></head>
<body class="bg-slate-950 text-slate-100 p-8">
    <div class="max-w-4xl mx-auto space-y-6">
        <div class="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex justify-between items-center">
            <h1 class="text-lg font-bold">Device Management Module (SO1)</h1>
            <a href="dashboard.php" class="text-xs text-cyan-400 underline">&larr; Back to Dashboard</a>
        </div>
        <div class="bg-slate-900 p-6 rounded-2xl border border-slate-800">
            <table class="w-full text-left text-xs">
                <thead class="bg-slate-950 text-slate-400 uppercase"><tr><th class="p-3">Name</th><th class="p-3">IP Address</th><th class="p-3">Status</th></tr></thead>
                <tbody class="divide-y divide-slate-800">
                    <tr><td class="p-3 font-semibold">Kiambu Core Router</td><td class="p-3 font-mono text-slate-400">192.168.10.1</td><td class="p-3 text-emerald-400">Online</td></tr>
                </tbody>
            </table>
        </div>
    </div>
</body>
</html>