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
        role TEXT NOT NULL, -- 'landowner', 'lessee', 'admin'
        aadhaar TEXT,
        pan TEXT,
        bankDetails TEXT,
        isVerified BOOLEAN DEFAULT 0,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      // Create Lands Table
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
        status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (ownerId) REFERENCES users (id)
      )`);

      // Create LeaseRequests Table
      db.run(`CREATE TABLE IF NOT EXISTS lease_requests (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        landId INTEGER NOT NULL,
        lesseeId INTEGER NOT NULL,
        ownerId INTEGER NOT NULL,
        status TEXT DEFAULT 'pending', -- 'pending', 'accepted', 'rejected'
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
        type TEXT NOT NULL, -- 'token', 'full'
        status TEXT DEFAULT 'held', -- 'held', 'released'
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (agreementId) REFERENCES agreements (id)
      )`);
    });
  }
});

module.exports = db;
