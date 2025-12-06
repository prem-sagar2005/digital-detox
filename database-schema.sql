-- Digital Detox Travel Planner Database Schema
-- PostgreSQL

-- Create Database (run this separately if needed)
CREATE DATABASE digital_detox;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    "userID" SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    "passwordHash" VARCHAR(255) NOT NULL,
    "fullName" VARCHAR(100),
    bio TEXT,
    "profilePicture" VARCHAR(255),
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trips Table
CREATE TABLE IF NOT EXISTS trips (
    "tripID" SERIAL PRIMARY KEY,
    "userID" INTEGER NOT NULL REFERENCES users("userID") ON DELETE CASCADE,
    destination VARCHAR(100) NOT NULL,
    "startDate" DATE NOT NULL,
    "endDate" DATE NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'planned' CHECK (status IN ('planned', 'ongoing', 'completed', 'cancelled')),
    "coverImage" VARCHAR(255),
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Checkins Table
CREATE TABLE IF NOT EXISTS checkins (
    "checkinID" SERIAL PRIMARY KEY,
    "tripID" INTEGER NOT NULL REFERENCES trips("tripID") ON DELETE CASCADE,
    "checkinDate" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    mood VARCHAR(20) NOT NULL CHECK (mood IN ('happy', 'relaxed', 'energetic', 'peaceful', 'stressed', 'anxious', 'neutral')),
    "stressLevel" INTEGER CHECK ("stressLevel" >= 1 AND "stressLevel" <= 10),
    "screenTime" INTEGER,
    notes TEXT
);

-- Itineraries Table
CREATE TABLE IF NOT EXISTS itineraries (
    "itineraryID" SERIAL PRIMARY KEY,
    "tripID" INTEGER NOT NULL REFERENCES trips("tripID") ON DELETE CASCADE,
    day INTEGER NOT NULL CHECK (day >= 1),
    activity VARCHAR(255) NOT NULL,
    time TIME,
    location VARCHAR(100),
    description TEXT,
    "isCompleted" BOOLEAN DEFAULT FALSE
);

-- Rules Table
CREATE TABLE IF NOT EXISTS rules (
    "ruleID" SERIAL PRIMARY KEY,
    "tripID" INTEGER NOT NULL REFERENCES trips("tripID") ON DELETE CASCADE,
    "ruleName" VARCHAR(100) NOT NULL,
    description TEXT,
    "ruleType" VARCHAR(50) DEFAULT 'custom' CHECK ("ruleType" IN ('device_free_zones', 'time_limits', 'app_restrictions', 'emergency_only', 'custom')),
    "isActive" BOOLEAN DEFAULT TRUE,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
    "reviewID" SERIAL PRIMARY KEY,
    "tripID" INTEGER NOT NULL REFERENCES trips("tripID") ON DELETE CASCADE,
    "userID" INTEGER NOT NULL REFERENCES users("userID") ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    "reviewText" TEXT,
    "detoxSuccess" BOOLEAN DEFAULT TRUE,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better query performance
CREATE INDEX idx_trips_user ON trips("userID");
CREATE INDEX idx_checkins_trip ON checkins("tripID");
CREATE INDEX idx_itineraries_trip ON itineraries("tripID");
CREATE INDEX idx_rules_trip ON rules("tripID");
CREATE INDEX idx_reviews_trip ON reviews("tripID");
CREATE INDEX idx_reviews_user ON reviews("userID");

-- Sample data insertion (optional)
-- Uncomment to insert sample data for testing

/*
-- Insert sample user
INSERT INTO users (username, email, "passwordHash", "fullName", bio)
VALUES ('johndoe', 'john@example.com', '$2a$10$examplehash', 'John Doe', 'Digital wellness enthusiast');

-- Insert sample trip
INSERT INTO trips ("userID", destination, "startDate", "endDate", description, status)
VALUES (1, 'Bali, Indonesia', '2024-06-01', '2024-06-10', 'A peaceful retreat to disconnect and recharge', 'planned');

-- Insert sample check-in
INSERT INTO checkins ("tripID", mood, "stressLevel", "screenTime", notes)
VALUES (1, 'relaxed', 3, 30, 'Feeling much better after reducing screen time');

-- Insert sample itinerary
INSERT INTO itineraries ("tripID", day, activity, time, location, description)
VALUES (1, 1, 'Morning beach yoga', '07:00', 'Seminyak Beach', 'Start the day with peaceful yoga by the ocean');

-- Insert sample rule
INSERT INTO rules ("tripID", "ruleName", description, "ruleType", "isActive")
VALUES (1, 'No phones after 8 PM', 'Digital curfew to ensure quality sleep', 'time_limits', TRUE);

-- Insert sample review
INSERT INTO reviews ("tripID", "userID", rating, "reviewText", "detoxSuccess")
VALUES (1, 1, 5, 'Amazing experience! Truly disconnected and felt rejuvenated.', TRUE);
*/

















