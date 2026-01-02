-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    university_id VARCHAR(50) NOT NULL UNIQUE,
    college VARCHAR(100),
    department VARCHAR(100),
    year_of_study INT,
    gender ENUM('Male', 'Female') NOT NULL,
    phone_number VARCHAR(20),
    email VARCHAR(255) NOT NULL UNIQUE,
    residence ENUM('Campus Dormitory', 'Non-Campus') NOT NULL,
    dorm_block VARCHAR(50),
    membership_type ENUM('Active Volunteer', 'Passive Member') NOT NULL,
    committees TEXT, -- Comma separated values
    reason_for_joining TEXT,
    password VARCHAR(255) NOT NULL,
    role ENUM('student', 'admin', 'counselor') DEFAULT 'student',
    status ENUM('pending', 'active', 'banned') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Events Table
CREATE TABLE IF NOT EXISTS events (
    event_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    date_time DATETIME NOT NULL,
    venue VARCHAR(255),
    image_url VARCHAR(255),
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Posts/Blogs Table
CREATE TABLE IF NOT EXISTS posts (
    post_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(100),
    image_url VARCHAR(255),
    author_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id)
);

-- Anonymous Messages / Help Requests
CREATE TABLE IF NOT EXISTS messages (
    message_id INT AUTO_INCREMENT PRIMARY KEY,
    subject VARCHAR(255),
    message_body TEXT NOT NULL,
    sender_email VARCHAR(255), -- Optional, for those who want a reply
    is_replied BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Resources Table
CREATE TABLE IF NOT EXISTS resources (
    resource_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    file_path VARCHAR(255) NOT NULL,
    uploaded_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (uploaded_by) REFERENCES users(id)
);
