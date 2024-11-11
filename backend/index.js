const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const cors = require("cors");

const port = process.env.PORT || 3000;

// Initialize an in-memory SQLite database
const db = new sqlite3.Database(":memory:", (err) => {
  if (err) {
    console.error("Error connecting to in-memory SQLite database", err);
  } else {
    console.log("Connected to in-memory SQLite database");

    // Initialize the database schema
    db.serialize(() => {
      // Create a sample table
      db.run("CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT)");

      // Insert sample data
      const stmt = db.prepare("INSERT INTO users (name) VALUES (?)");
      stmt.run("Alice");
      stmt.run("Bob");
      stmt.finalize();
    });
  }
});

// Example route to fetch users
app.get("/api/people", (req, res) => {
  // Query data from the in-memory database
  db.all("SELECT * FROM users", [], (err, rows) => {
    if (err) {
      res.status(500).send("Error querying the database");
    } else {
      res.json(rows);
    }
  });
});

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Handle other routes by serving the frontend's index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(port, () => {
  console.log(`App running at http://localhost:${port}`);
});
