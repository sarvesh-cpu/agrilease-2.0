const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    
    db.serialize(() => {
      // Create Users Table
      db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        fullName TEXT NOT NULL,
        phone TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL DEFAULT '',
        role TEXT NOT NULL, -- 'landowner', 'lessee', 'admin'
        aadhaar TEXT,
        pan TEXT,
        bankDetails TEXT,
        isVerified BOOLEAN DEFAULT 0,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      // Create Lands Table (original leasing)
      db.run(`CREATE TABLE IF NOT EXISTS lands (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ownerId INTEGER NOT NULL,
        surveyNumber TEXT NOT NULL,
        area REAL NOT NULL,
        location TEXT NOT NULL,
        landType TEXT NOT NULL,
        soilType TEXT,
        pricePerAcre REAL NOT NULL,
        leaseDuration TEXT NOT NULL,
        documentUrl TEXT,
        status TEXT DEFAULT 'pending',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (ownerId) REFERENCES users (id)
      )`);

      // Create Land Profiles Table (for crop analysis)
      db.run(`CREATE TABLE IF NOT EXISTS land_profiles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER,
        name TEXT DEFAULT 'My Land',
        district TEXT NOT NULL,
        taluka TEXT NOT NULL,
        area REAL NOT NULL,
        soilType TEXT NOT NULL,
        irrigationType TEXT NOT NULL,
        previousCrop TEXT,
        season TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users (id)
      )`);

      // Create Analysis Results Table
      db.run(`CREATE TABLE IF NOT EXISTS analysis_results (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        landProfileId INTEGER NOT NULL,
        recommendations TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (landProfileId) REFERENCES land_profiles (id)
      )`);

      // Create Chat Sessions Table (Conversation Memory)
      db.run(`CREATE TABLE IF NOT EXISTS chat_sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        role TEXT NOT NULL,
        message TEXT NOT NULL,
        activeLandId INTEGER,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users (id),
        FOREIGN KEY (activeLandId) REFERENCES land_profiles (id)
      )`);

      // Create LeaseRequests Table
      db.run(`CREATE TABLE IF NOT EXISTS lease_requests (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        landId INTEGER NOT NULL,
        lesseeId INTEGER NOT NULL,
        ownerId INTEGER NOT NULL,
        status TEXT DEFAULT 'pending',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (landId) REFERENCES lands (id),
        FOREIGN KEY (lesseeId) REFERENCES users (id),
        FOREIGN KEY (ownerId) REFERENCES users (id)
      )`);

      // Create Agreements Table
      db.run(`CREATE TABLE IF NOT EXISTS agreements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        requestId INTEGER NOT NULL,
        documentUrl TEXT,
        signedByOwner BOOLEAN DEFAULT 0,
        signedByLessee BOOLEAN DEFAULT 0,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (requestId) REFERENCES lease_requests (id)
      )`);

      // Create Payments Table
      db.run(`CREATE TABLE IF NOT EXISTS payments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        agreementId INTEGER NOT NULL,
        amount REAL NOT NULL,
        type TEXT NOT NULL,
        status TEXT DEFAULT 'held',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (agreementId) REFERENCES agreements (id)
      )`);
    });
  }
});

module.exports = db;
