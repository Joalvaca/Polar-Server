module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || "development",
  DB_URL: process.env.DB_URL || "postgresql://polar:1@localhost/footprints",
  JWT_SECRET: process.env.JWT_SECRET || "change-this-secret",
  TEST_DB_URL:
    process.env.TEST_DB_URL || "postgresql://polar:1@localhost/footprints-test"
};
