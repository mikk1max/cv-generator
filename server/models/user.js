const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    gender: { type: String, enum: ["male", "female"], default: "male", required: true },
    jobPosition: { type: String, default: "-" },
    dateOfBirth: { type: Date },
    street: { type: String, default: "-" },
    buildingNumber: { type: String, default: "-" },
    apartmentNumber: { type: String, default: "-" },
    postalCode: { type: String, default: "-" },
    city: { type: String, default: "-" },
    country: { type: String, default: "-" },
    education: [{
        from: { type: Date },
        to: { type: Date},
        place: { type: String, default: "-" },
        fieldOfStudy: { type: String, default: "-" },
    }],
    workExperience: [{
        from: { type: Date },
        to: { type: Date },
        place: { type: String, default: "-" },
        position: { type: String, default: "-" },
    }],
    skills: { type: [String], default: [] },
    languages: { type: [String], default: [] },
    interests: { type: String, default: "-" },
});

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, {
        expiresIn: "7d",
    });
    return token;
};

const User = mongoose.model("User", userSchema);

const validateUser = (data) => {
    const schema = Joi.object({
        firstName: Joi.string().label("First Name"),
        lastName: Joi.string().label("Last Name"),
        email: Joi.string().email().required().label("Email"),
        password: passwordComplexity().required().label("Password"),
        gender: Joi.string().valid("male", "female").label("Gender"),
        jobPosition: Joi.string().label("Job Position"),
        dateOfBirth: Joi.date().label("Date of Birth"),
        street: Joi.string().label("Street"),
        buildingNumber: Joi.string().label("Building Number"),
        apartmentNumber: Joi.string().label("Apartment Number"),
        postalCode: Joi.string().label("Postal Code"),
        city: Joi.string().label("City"),
        country: Joi.string().label("Country"),
        education: Joi.object({
            from: Joi.date().label("Education From"),
            to: Joi.date().label("Education To"),
            place: Joi.string().label("Education Place"),
            fieldOfStudy: Joi.string().label("Field of Study"),
        }),
        workExperience: Joi.object({
            from: Joi.date().label("Work From"),
            to: Joi.date().label("Work To"),
            place: Joi.string().label("Work Place"),
            position: Joi.string().label("Work Position"),
        }),
        skills: Joi.array().items(Joi.string()).label("Skills"),
        languages: Joi.array().items(Joi.string()).label("Languages"),
        interests: Joi.string().label("Interests"),
    });
    return schema.validate(data);
};

const validateLogin = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required().label("Email"),
        password: Joi.string().required().label("Password"),
    });
    return schema.validate(data);
};

module.exports = { User, validateUser, validateLogin };
