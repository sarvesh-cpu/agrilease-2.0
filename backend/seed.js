// Seed script for AgriLease Land Intelligence Platform
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log("Database connected. Seeding...");
    
    setTimeout(() => {
      db.serialize(() => {
        // Clear existing data
        db.run("DELETE FROM analysis_results");
        db.run("DELETE FROM land_profiles");
        db.run("DELETE FROM users");
        db.run("DELETE FROM lands");

        // Seed Users
        const stmtUsers = db.prepare("INSERT INTO users (fullName, phone, password, role, isVerified) VALUES (?, ?, ?, ?, ?)");
        stmtUsers.run("Rajesh Patil", "9876543210", "pass123", "landowner", 1);
        stmtUsers.run("Anita Deshmukh", "8765432109", "pass123", "lessee", 1);
        stmtUsers.run("Admin User", "0000000000", "admin123", "admin", 1);
        stmtUsers.finalize();

        // Seed Lands (for leasing)
        const stmtLands = db.prepare("INSERT INTO lands (ownerId, surveyNumber, area, location, landType, pricePerAcre, leaseDuration, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        stmtLands.run(1, "SV-101", 10.5, "Pune, Maharashtra", "Agricultural", 15000, "1 Year", "approved");
        stmtLands.run(1, "SV-102", 5.0, "Nashik, Maharashtra", "Agricultural", 20000, "2 Years", "pending");
        stmtLands.run(1, "SV-409", 2.5, "Satara, Maharashtra", "Greenhouse Ready", 40000, "1 Year", "approved");
        stmtLands.run(1, "SV-821", 15.0, "Solapur, Maharashtra", "Agricultural", 12000, "5 Years", "rejected");
        stmtLands.run(1, "SV-211", 8.0, "Kolhapur, Maharashtra", "Dairy Farm Ready", 18000, "5 Years", "approved");
        stmtLands.finalize();

        // Seed Land Profiles (for analysis)
        const stmtProfiles = db.prepare("INSERT INTO land_profiles (userId, name, district, taluka, area, soilType, irrigationType, previousCrop, season) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
        stmtProfiles.run(1, "Farm at Baramati", "Pune", "Baramati", 8.0, "Black", "Canal", "Sugarcane", "Kharif");
        stmtProfiles.run(1, "Nashik Vineyard Plot", "Nashik", "Dindori", 4.5, "Red", "Drip", "Grapes", "Rabi");
        stmtProfiles.run(2, "Maval Agricultural Land", "Pune", "Maval", 6.0, "Loamy", "Borewell", "Soybean", "Kharif");
        stmtProfiles.finalize();

        // Seed Analysis Results
        const analysis1 = JSON.stringify([
          { rank: 1, key: "cotton", name: "Cotton", icon: "🌿", score: 70, risk: { level: "Low", color: "#22c55e" }, yieldRange: "8–12 quintals/acre", revenueMin: 416000, revenueMax: 816000, waterNeed: "Medium", waterCompatible: true, description: "Cotton thrives in black soil with moderate water.", factors: ["Excellent soil match", "Kharif is the right season", "Compatible with Canal irrigation"] },
          { rank: 2, key: "soybean", name: "Soybean", icon: "🫘", score: 65, risk: { level: "Low", color: "#22c55e" }, yieldRange: "6–10 quintals/acre", revenueMin: 216000, revenueMax: 440000, waterNeed: "Low", waterCompatible: true, description: "Low investment, good returns.", factors: ["Excellent soil match", "Kharif is the right season", "Pune belt is known for this crop"] },
          { rank: 3, key: "maize", name: "Maize", icon: "🌽", score: 55, risk: { level: "Medium", color: "#f59e0b" }, yieldRange: "12–18 quintals/acre", revenueMin: 192000, revenueMax: 403200, waterNeed: "Medium", waterCompatible: true, description: "Versatile crop with growing demand.", factors: ["Excellent soil match", "Kharif is the right season", "Compatible with Canal irrigation"] }
        ]);

        const analysis2 = JSON.stringify([
          { rank: 1, key: "grapes", name: "Grapes", icon: "🍇", score: 80, risk: { level: "Low", color: "#22c55e" }, yieldRange: "8–15 tonnes/acre", revenueMin: 1440000, revenueMax: 5400000, waterNeed: "Medium", waterCompatible: true, description: "Nashik is India's grape capital.", factors: ["Nashik is a major hub", "Rabi is the right season", "Compatible with Drip irrigation"] },
          { rank: 2, key: "pomegranate", name: "Pomegranate", icon: "🍎", score: 70, risk: { level: "Low", color: "#22c55e" }, yieldRange: "4–8 tonnes/acre", revenueMin: 1080000, revenueMax: 4320000, waterNeed: "Low", waterCompatible: true, description: "Drought-resistant and high-value.", factors: ["Nashik is a major hub", "Excellent soil match", "Compatible with Drip irrigation"] },
          { rank: 3, key: "tomato", name: "Tomato", icon: "🍅", score: 60, risk: { level: "Medium", color: "#f59e0b" }, yieldRange: "80–120 quintals/acre", revenueMin: 1440000, revenueMax: 5400000, waterNeed: "Medium", waterCompatible: true, description: "High-yield vegetable crop.", factors: ["Excellent soil match", "Rabi is the right season", "Compatible with Drip irrigation"] }
        ]);

        const stmtAnalysis = db.prepare("INSERT INTO analysis_results (landProfileId, recommendations) VALUES (?, ?)");
        stmtAnalysis.run(1, analysis1);
        stmtAnalysis.run(2, analysis2);
        stmtAnalysis.finalize();

        console.log("✅ Seeding complete — Users, Lands, Land Profiles, Analysis Results.");
        console.log("   Press Ctrl+C to exit.");
      });
    }, 1000);
  }
});
