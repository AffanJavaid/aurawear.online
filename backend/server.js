const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
const port = 3111;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database setup
const db = new sqlite3.Database(":memory:"); // Use ":memory:" for testing, change to file for persistence

// Create table for orders
db.serialize(() => {
    db.run(`
        CREATE TABLE orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_id TEXT,
            name TEXT,
            email TEXT,
            phone TEXT,
            address TEXT,
            total_price REAL,
            items TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);
});

// Endpoint to save order
app.post("/orders", (req, res) => {
    const { order_id, name, email, phone, address, total_price, items } = req.body;

    db.run(
        `INSERT INTO orders (order_id, name, email, phone, address, total_price, items) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [order_id, name, email, phone, address, total_price, JSON.stringify(items)],
        function (err) {
            if (err) {
                return res.status(500).json({ error: "Database error" });
            }
            res.status(201).json({ message: "Order saved successfully", orderId: this.lastID });
        }
    );
});

// Endpoint to retrieve orders
app.get("/orders", (req, res) => {
    db.all("SELECT * FROM orders", [], (err, rows) => {
        if (err) {
            console.error("Error retrieving orders:", err.message);
            return res.status(500).json({ error: "Database error" });
        }

        console.log("Retrieved Orders:");
        console.table(rows); // Logs data as a table in the console

        res.status(200).json(rows);
    });
});


// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
