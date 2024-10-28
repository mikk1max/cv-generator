const jwt = require("jsonwebtoken");

function tokenVerification(req, res, next) {
    // Retrieve the token from the header
    const token = req.headers["x-access-token"];
    if (!token) {
        return res.status(403).send({ message: "No token provided!" });
    }

    // Verify the token
    jwt.verify(token, process.env.JWTPRIVATEKEY, (err, decoded) => {
        if (err) {
            console.log("Unauthorized!");
            return res.status(401).send({ message: "Unauthorized!" });
        }

        // Attach the decoded user ID to the request object
        console.log("Token valid, user ID: " + decoded._id);
        req.user = decoded;
        next();
    });
}

module.exports = tokenVerification;