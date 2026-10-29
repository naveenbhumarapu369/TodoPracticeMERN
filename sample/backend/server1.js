
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const User = require("./models/user");
const Todo = require("./models/todo");

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT;

app.use(cors());
app.use(express.json());

// Authentication middleware
function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    console.log("from mid "+authHeader);
    if (!authHeader) {
        return res.status(401).json({
            msg: "Token missing"
        });
    }
console.log("from mid1 "+authHeader);
    const token = authHeader.split(" ")[1];
    console.log(token);
    try {
        req.user = jwt.verify(token, JWT_SECRET);
        next();
    } catch (error) {
        return res.status(401).json({
            msg: "Invalid or expired token"
        });
    }
}

// Home route
app.get("/", authMiddleware, async (req, res) => {
    try {
        const todos = await Todo.find({
            userId: req.user.id
        });

        res.json(todos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Failed to fetch todos" });
    }
});

// Add a todo
app.post("/", authMiddleware, async (req, res) => {
    try {
        const { id,title } = req.body;

        if (typeof title !== "string" || !title.trim()) {
            return res.status(400).json({
                msg: "Todo title is required"
            });
        }

        const todo = await Todo.create({
            id:id,
            title: title.trim(),
            completed: false,
            userId: req.user.id
        });

        res.status(201).json(todo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Failed to create todo" });
    }
});

// Register a user
app.post("/users/reg", async (req, res) => {
    try {
        const { name, pass } = req.body;

        if (
            typeof name !== "string" ||
            !name.trim() ||
            typeof pass !== "string" ||
            pass.length < 6
        ) {
            return res.status(400).json({
                msg: "Enter a name and a password of at least 6 characters"
            });
        }

        const cleanName = name.trim();

        const existingUser = await User.findOne({
            name: cleanName
        });

        if (existingUser) {
            return res.status(409).json({
                msg: "Username already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(pass, 10);

        const user = await User.create({
            name: cleanName,
            pass: hashedPassword
        });

        res.status(201).json({
            msg: "Registration successful",
            user: {
                id: user._id,
                name: user.name
            }
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                msg: "Username already exists"
            });
        }

        console.error(error);
        res.status(500).json({ msg: "Registration failed" });
    }
});

// Login
app.post("/users/login", async (req, res) => {
    try {
        const { name, pass } = req.body;

        if (
            typeof name !== "string" ||
            typeof pass !== "string"
        ) {
            return res.status(400).json({
                msg: "Name and password are required"
            });
        }

        const user = await User.findOne({
            name: name.trim()
        });

        if (!user || !(await bcrypt.compare(pass, user.pass))) {
            return res.status(401).json({
                msg: "Invalid credentials"
            });
        }

        const token = jwt.sign(
            {
                id: user._id.toString(),
                name: user.name
            },
            JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({
            msg: "Login successful",
            token:token
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Login failed" });
    }
});

// Get the logged-in user's profile
app.get("/users/profile", authMiddleware, (req, res) => {
    res.json({
        msg: "Welcome to your profile " + req.user.name,
        user: req.user
    });
});

// Get all users without exposing their passwords
app.get("/users", authMiddleware, async (req, res) => {
    try {
        const users = await User.find().select("-pass");
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Failed to fetch users" });
    }
});

// Get one todo
app.get("/:id", authMiddleware, async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ msg: "Invalid todo ID" });
        }

        const todo = await Todo.findOne({
            id: req.params.id,
            userId: req.user.id
        });

        if (!todo) {
            return res.status(404).json({ msg: "Todo not found" });
        }

        res.json(todo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Failed to fetch todo" });
    }
});

// Update a todo
app.put("/:id", authMiddleware, async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ msg: "Invalid todo ID" });
        }

        const updates = {};

        if (typeof req.body.completed === "boolean") {
            updates.completed = req.body.completed;
        }

        if (typeof req.body.title === "string" && req.body.title.trim()) {
            updates.title = req.body.title.trim();
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                msg: "Provide a valid title or completed value"
            });
        }

        const todo = await Todo.findOneAndUpdate(
            {
                _id: req.params.id,
                userId: req.user.id
            },
            { $set: updates },
            { new: true, runValidators: true }
        );

        if (!todo) {
            return res.status(404).json({ msg: "Todo not found" });
        }

        res.json(todo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Failed to update todo" });
    }
});

// Delete a todo
app.delete("/:id", authMiddleware, async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ msg: "Invalid todo ID" });
        }

        const todo = await Todo.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!todo) {
            return res.status(404).json({ msg: "Todo not found" });
        }

        res.json({ msg: "Todo deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Failed to delete todo" });
    }
});

// Connect to Atlas before starting the server
async function startServer() {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is missing from .env");
        }

        if (!JWT_SECRET) {
            throw new Error("JWT is missing from .env");
        }

        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Atlas connected");

        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Startup failed:", error.message);
        process.exit(1);
    }
}

startServer();
