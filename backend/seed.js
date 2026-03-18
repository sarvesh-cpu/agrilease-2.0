// A simple script to add some dummy data to the test database
// using the db connection which handles table creation first
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log("Database connected. Waiting for tables to initialize before seeding...");
    
    // Give time for db.js table creation to finish if running alongside (hacky but works for MVP seed)
    setTimeout(() => {
      console.log("Seeding database...");
      db.serialize(() => {
        db.run("DELETE FROM users");
        db.run("DELETE FROM lands");
        db.run("DELETE FROM sqlite_sequence WHERE name IN ('users', 'lands')");

        const stmtUsers = db.prepare("INSERT INTO users (fullName, phone, role, isVerified) VALUES (?, ?, ?, ?)");
        stmtUsers.run("John Owner", "9876543210", "landowner", 1);
        stmtUsers.run("Alice Farmer", "8765432109", "lessee", 1);
        stmtUsers.run("Admin User", "0000000000", "admin", 1);
        stmtUsers.finalize();

        const stmtLands = db.prepare("INSERT INTO lands (ownerId, surveyNumber, area, location, landType, pricePerAcre, leaseDuration, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        stmtLands.run(1, "SV-101", 10.5, "Pune, Maharashtra", "Agricultural", 15000, "1 Year", "approved");
        stmtLands.run(1, "SV-102", 5.0, "Nashik, Maharashtra", "Agricultural", 20000, "2 Years", "pending");
        stmtLands.run(1, "SV-409", 2.5, "Satara, Maharashtra", "Greenhouse Ready", 40000, "1 Year", "approved");
        stmtLands.run(1, "SV-821", 15.0, "Solapur, Maharashtra", "Agricultural", 12000, "5 Years", "rejected");
        stmtLands.run(1, "SV-211", 8.0, "Kolhapur, Maharashtra", "Dairy Farm Ready", 18000, "5 Years", "approved");
        stmtLands.finalize();

        console.log("Seeding complete. Use Ctrl+C if script doesn't exit automatically.");
      });
    }, 1000); // 1 sec delay to ensure tables exist
  }
});

