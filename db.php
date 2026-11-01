<?php
// db.php - SQLite Database Connection & Initialization
$dbFile = __DIR__ . '/netpulse.db';

try {
    $pdo = new PDO('sqlite:' . $dbFile);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Create tables if they do not exist
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password TEXT
        );

        CREATE TABLE IF NOT EXISTS devices (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            ip_address TEXT,
            community TEXT,
            status TEXT
        );

        CREATE TABLE IF NOT EXISTS traffic_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT,
            device_name TEXT,
            ip_address TEXT,
            inbound REAL,
            outbound REAL,
            status TEXT
        );
    ");

    // Insert default admin user if not exists (Password: zetech@123)
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM users WHERE username = ?");
    $stmt->execute(['matrix']);
    if ($stmt->fetchColumn() == 0) {
        $hashedPassword = password_hash('zetech@123', PASSWORD_DEFAULT);
        $insert = $pdo->prepare("INSERT INTO users (username, password) VALUES (?, ?)");
        $insert->execute(['matrix', $hashedPassword]);
    }

} catch (PDOException $e) {
    die("Database Connection Error: " . $e->getMessage());
}
?>