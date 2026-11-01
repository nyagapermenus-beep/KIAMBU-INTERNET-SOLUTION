-- NetPulse System SQL Database Schema
-- For Kiambu Internet Solutions Network Monitoring System

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS devices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    ip_address VARCHAR(45) NOT NULL UNIQUE,
    community VARCHAR(50) DEFAULT 'public',
    status VARCHAR(20) DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS traffic_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    device_id INT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    inbound_mbps DECIMAL(10, 2) NOT NULL,
    outbound_mbps DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'Normal',
    FOREIGN KEY (device_id) REFERENCES devices(id) ON DELETE CASCADE
);

-- Default User Account (Password: zetech@123, hashed with Bcrypt)
INSERT INTO users (username, password) 
VALUES ('matrix', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

-- Initial Seed Devices
INSERT INTO devices (name, ip_address, community, status) VALUES
('Kiambu Main Core Router', '192.168.10.1', 'public', 'Active'),
('Distribution Switch A', '192.168.10.2', 'public', 'Active'),
('Billing Gateway Server', '192.168.10.5', 'public', 'Active');