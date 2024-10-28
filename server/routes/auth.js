const router = require("express").Router();
const { User, validateLogin, validateUser } = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Endpoint for registering a new user
router.post("/signup", async (req, res) => {
    try {
        // Validate input data
        const { error } = validateUser(req.body);
        if (error) return res.status(400).send({ message: error.details[0].message });

        // Check if user already exists
        let user = await User.findOne({ email: req.body.email });
        if (user) return res.status(400).send({ message: "User already registered." });

        // Encrypt password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // Create new user
        user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: hashedPassword,
            gender: req.body.gender,
            dateOfBirth: req.body.dateOfBirth || null,
            street: req.body.street || "-",
            buildingNumber: req.body.buildingNumber || "-",
            apartmentNumber: req.body.apartmentNumber || "-",
            postalCode: req.body.postalCode || "-",
            city: req.body.city || "-",
            country: req.body.country || "-",
            education: {
                from: req.body.education?.from || null,
                to: req.body.education?.to || null,
                place: req.body.education?.place || "-",
                fieldOfStudy: req.body.education?.fieldOfStudy || "-",
            },
            workExperience: {
                from: req.body.workExperience?.from || null,
                to: req.body.workExperience?.to || null,
                place: req.body.workExperience?.place || "-",
                position: req.body.workExperience?.position || "-",
            },
            skills: req.body.skills || [],
            languages: req.body.languages || [],
            interests: req.body.interests || "-",
        });

        await user.save(); // Save user to database

        // Generate JWT token and send response
        const token = user.generateAuthToken();
        res.status(201).send({ data: token, message: "User registered successfully" });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

// Endpoint for user login
router.post("/login", async (req, res) => {
    try {
        // Validate login data
        const { error } = validateLogin(req.body);
        if (error) return res.status(400).send({ message: error.details[0].message });

        // Find user by email
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(401).send({ message: "Invalid Email or Password" });

        // Compare passwords
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) return res.status(401).send({ message: "Invalid Email or Password" });

        // Generate JWT token and send response
        const token = user.generateAuthToken();
        res.status(200).send({ data: token, message: "Logged in successfully" });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

module.exports = router;