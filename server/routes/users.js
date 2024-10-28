const router = require("express").Router();
const { User, validateUser } = require("../models/user");
const bcrypt = require("bcrypt");
const tokenVerification = require("../middleware/tokenVerification");

// Endpoint for registering a new user
router.post("/", async (req, res) => {
    try {
        const { error } = validateUser(req.body);
        if (error) return res.status(400).send({ message: error.details[0].message });

        let user = await User.findOne({ email: req.body.email });
        if (user) return res.status(409).send({ message: "User with given email already exists!" });

        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashPassword = await bcrypt.hash(req.body.password, salt);

        user = new User({
            ...req.body,
            password: hashPassword,
            cv: {}, // Initialize empty CV object
        });

        await user.save();

        res.status(201).send({ message: "User created successfully" });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

// Endpoint for getting a list of all users (only accessible to authenticated users)
router.get("/", tokenVerification, async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).send({ data: users, message: "List of users" });
    } catch (error) {
        console.error("Get users error:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

// Endpoint for getting details of the currently logged-in user
router.get("/details", tokenVerification, async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        res.status(200).send({ data: user, message: "Current user details" });
    } catch (error) {
        console.error("Get user details error:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

// Endpoint for deleting the account of the currently logged-in user
router.delete("/delete-account", tokenVerification, async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        await User.findByIdAndDelete(userId);
        res.status(200).send({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Delete user error:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

// Endpoint for updating CV data of the currently logged-in user
router.put("/update-cv", tokenVerification, async (req, res) => {
    try {
        const userId = req.user._id;
 
        // Validate CV data here if needed
 
        // Find user by userId
        let user = await User.findByIdAndUpdate(userId, {
 
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                dateOfBirth: req.body.dateOfBirth,
                jobPosition: req.body.jobPosition,
                street: req.body.street,
                buildingNumber: req.body.buildingNumber,
                apartmentNumber: req.body.apartmentNumber,
                postalCode: req.body.postalCode,
                city: req.body.city,
                country: req.body.country,
 
            education: {
                from: req.body.educationFrom,
                to: req.body.educationTo,
                place: req.body.educationPlace,
                fieldOfStudy: req.body.educationField,
            },
            workExperience: {
                from: req.body.workFrom,
                to: req.body.workTo,
                place: req.body.workPlace,
                position: req.body.workPosition,
            },
            skills: req.body.skills,
            languages: req.body.languages,
            interests: req.body.interests,
        },{
            new: true,
            upsert: true 
        });
 
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }
 
        // Update user's CV data
        // user.cv = ;
 
        // Save updated CV data
        //  await user.save();
 
        res.status(200).send({ message: "CV data updated successfully", data: user.cv });
    } catch (error) {
        console.error("Update CV data error:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
 
});

module.exports = router;