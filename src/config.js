module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || "development",
  DATABASE_URL:
    process.env.DATABASE_URL || "postgresql://polar:1@localhost/footprints",
  JWT_SECRET: process.env.JWT_SECRET || "secret",
  TEST_DATABASE_URL:
    process.env.TEST_DATABASE_URL ||
    "postgresql://polar:1@localhost/footprints-test"
};
