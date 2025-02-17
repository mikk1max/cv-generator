const router = require("express").Router();
const { User, validateUser } = require("../models/user");
const bcrypt = require("bcrypt");
const tokenVerification = require("../middleware/tokenVerification");

// Endpoint for registering a new user
router.post("/", async (req, res) => {
  try {
    const { error } = validateUser(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    let user = await User.findOne({ email: req.body.email });
    if (user)
      return res
        .status(409)
        .send({ message: "User with given email already exists!" });

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
  
      // Ensure education and work experience arrays are handled properly
      const educationData = req.body.education.map((edu) => ({
        from: edu.from,
        to: edu.to,
        place: edu.place,
        fieldOfStudy: edu.fieldOfStudy,
      }));
  
      const workExperienceData = req.body.workExperience.map((work) => ({
        from: work.from,
        to: work.to,
        place: work.place,
        position: work.position,
      }));
  
      // Find and update user data
      let user = await User.findByIdAndUpdate(
        userId,
        {
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
          education: educationData,
          workExperience: workExperienceData,
          skills: req.body.skills,
          languages: req.body.languages,
          interests: req.body.interests,
        },
        { new: true, upsert: true }
      );
  
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }
  
      res.status(200).send({ message: "CV updated successfully", data: user });
    } catch (error) {
      console.error("Error updating CV data:", error);
      res.status(500).send({ message: "Internal Server Error" });
    }
  });
  

// Endpoint for fetching the CV data of the logged-in user
router.get("/cv", tokenVerification, async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // Ensure education and workExperience are arrays before mapping
    const cvData = {
      firstName: user.firstName,
      lastName: user.lastName,
      dateOfBirth: user.dateOfBirth,
      jobPosition: user.jobPosition,
      street: user.street,
      buildingNumber: user.buildingNumber,
      apartmentNumber: user.apartmentNumber,
      postalCode: user.postalCode,
      city: user.city,
      country: user.country,
      education:
        user.education?.map((edu) => ({
          from: edu.from,
          to: edu.to,
          place: edu.place,
          fieldOfStudy: edu.fieldOfStudy,
        })) || [],
      workExperience:
        user.workExperience?.map((work) => ({
          from: work.from,
          to: work.to,
          place: work.place,
          position: work.position,
        })) || [],
      skills: user.skills || [],
      languages: user.languages || [],
      interests: user.interests || "",
    };

    res
      .status(200)
      .send({ data: cvData, message: "CV data retrieved successfully" });
  } catch (error) {
    console.error("Error fetching CV data:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

module.exports = router;
