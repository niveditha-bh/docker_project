const express = require("express");
const app = express();
const path = require("path");
const MongoClient = require("mongodb").MongoClient;

const PORT = 5050;

// Standard middleware for processing incoming form-data and JSON bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 
app.use(express.static("public"));

const MONGO_URL = "mongodb://admin:qwerty@localhost:27017";
const client = new MongoClient(MONGO_URL);

// Connect to the database ONCE globally before starting the server
async function connectDB() {
    try {
        await client.connect();
        console.log('>>> Connected successfully to MongoDB server');
    } catch (error) {
        console.error("MongoDB connection failed:", error);
    }
}
connectDB();

// GET all users
app.get("/getUsers", async (req, res) => {
    try {
        const db = client.db("apnacollege-db");
        const data = await db.collection('users').find({}).toArray();
        res.send(data);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).send({ error: "Failed to fetch users" });
    }
});

// POST new user
app.post("/addUser", async (req, res) => {
    try {
        const userObj = req.body;
        console.log("Incoming user payload:", userObj);

        const db = client.db("apnacollege-db");
        const result = await db.collection('users').insertOne(userObj);
        
        console.log("Data successfully inserted in DB:", result);
        
        // Always send a response back so the client/form doesn't hang!
        res.status(201).send({ message: "User added successfully", id: result.insertedId });
    } catch (error) {
        console.error("Error inserting user:", error);
        res.status(500).send({ error: "Failed to add user" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
