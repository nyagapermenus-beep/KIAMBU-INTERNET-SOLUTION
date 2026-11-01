<?php
session_start();
$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username'] ?? '');
    $password = trim($_POST['password'] ?? '');

    if ($username === 'matrix' && $password === 'zetech@123') {
        $_SESSION['logged_in'] = true;
        $_SESSION['username'] = 'matrix';
        header('Location: dashboard.php');
        exit;
    } else {
        $error = 'Invalid username or password. Use matrix / zetech@123';
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NetPulse - Kiambu Internet Solutions</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body class="bg-slate-950 text-slate-100 flex items-center justify-center min-h-screen">
    <div class="w-full max-w-md p-8 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl">
        <div class="text-center mb-6">
            <h1 class="text-2xl font-bold">NetPulse Portal</h1>
            <p class="text-xs text-cyan-400 mt-1">Kiambu Internet Solutions</p>
        </div>
        <?php if (!empty($error)): ?>
            <div class="mb-4 p-3 bg-red-950/50 border border-red-900 rounded-xl text-red-400 text-xs text-center"><?php echo htmlspecialchars($error); ?></div>
        <?php endif; ?>
        <form method="POST" class="space-y-4">
            <div>
                <label class="block text-xs uppercase text-slate-400 mb-1">Username</label>
                <input type="text" name="username" required placeholder="matrix" class="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-cyan-500">
            </div>
            <div>
                <label class="block text-xs uppercase text-slate-400 mb-1">Password</label>
                <input type="password" name="password" required placeholder="zetech@123" class="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-cyan-500">
            </div>
            <button type="submit" class="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs transition">Authenticate</button>
        </form>
    </div>
</body>
</html>