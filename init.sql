CREATE DATABASE IF NOT EXISTS app_db;
USE app_db;
-- Table 1: Users (7 columns, 7 data types)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    -- 1. Integer
    full_name VARCHAR(100) NOT NULL,
    -- 2. String/Varchar
    birth_date DATE,
    -- 3. Date
    is_active BOOLEAN DEFAULT TRUE,
    -- 4. Boolean
    balance DECIMAL(15, 2),
    -- 5. Decimal
    registration_time TIME,
    -- 6. Time
    last_name_initial CHAR(1) -- 7. Fixed Char
);
-- Table 2: Profiles (7 columns + FK, 8 additional types)
CREATE TABLE IF NOT EXISTS profiles (
    profile_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    -- 8. Big Integer
    user_id INT NOT NULL,
    -- Relation (FK)
    biography TEXT,
    -- 9. Text (Long)
    experience_level INT,
    -- 10. Standard Integer
    last_login DATETIME,
    -- 11. DateTime
    latitude DOUBLE,
    -- 12. Double
    longitude FLOAT,
    -- 13. Float
    entry_year INT,
    -- 14. Integer (Year logic)
    avatar_points SMALLINT,
    -- 15. Small Integer
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);