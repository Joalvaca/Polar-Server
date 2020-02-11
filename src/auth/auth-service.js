const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config");

const AuthService = {
  getUserWithUserName(db, user_name) {
    return db("polar_users")
      .where({ user_name })
      .first();
  },

  comparePasswords(password, hash) {
    return bcrypt.compare(password, hash);
  },

  createjwt(subject, payload) {
    return jwt.sign(payload, config.JWT_SECRET, {
      subject,
      algorithm: "HS256"
    });
  },

  verifyJwt(token) {
    return jwt.verify(token, config.JWT_SECRET, {
      algorithms: ["HS256"]
    });
  },

  paseBasicToken(token) {
    return Buffer.from(token, "base64")
      .toString()
      .split("");
  }
};

module.exports = AuthService;
