-- SQLite

-- Delete table data
DELETE FROM users;
DELETE FROM verifiedUsers;

-- Create tables
CREATE TABLE IF NOT EXISTS users (
    uuid VARCHAR(36) UNIQUE,
    token VARCHAR(100)
);

-- Selection examples
SELECT uuid, token FROM users;
SELECT uuid, token FROM verifiedUsers;
SELECT COUNT(*) AS theCount FROM verifiedUsers WHERE uuid = "b01add3c-5f22-474d-82c1-0b1313b39012";