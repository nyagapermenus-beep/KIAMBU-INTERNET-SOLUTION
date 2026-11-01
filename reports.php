<?php
session_start();
if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
    header('Location: index.php');
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Reports</title><script src="https://cdn.tailwindcss.com"></script></head>
<body class="bg-slate-950 text-slate-100 p-8">
    <div class="max-w-4xl mx-auto space-y-6">
        <div class="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex justify-between items-center">
            <h1 class="text-lg font-bold">Historical Search & Reporting (SO3)</h1>
            <a href="dashboard.php" class="text-xs text-cyan-400 underline">&larr; Back to Dashboard</a>
        </div>
        <div class="bg-slate-900 p-6 rounded-2xl border border-slate-800">
            <button onclick="alert('Report exported successfully!')" class="px-4 py-2 bg-cyan-500 text-slate-950 font-bold rounded-xl text-xs">Export CSV Report</button>
        </div>
    </div>
</body>
</html>