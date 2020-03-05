const knex = require("knex");
const app = require("../src/app");
const helpers = require("./test-helpers");

describe("Protected endpoints", function() {
  let db;

  const testUsers = helpers.makeUsersArray();

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DB_URL
    });
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy());

  before("cleanup", () => helpers.cleanTables(db));

  afterEach("cleanup", () => helpers.cleanTables(db));

  beforeEach("insert articles", () => helpers.seedUsers(db, testUsers));

  const protectedEndpoints = [
    {
      name: "GET /api/footprints/:polar_id",
      path: "/api/footprints/1",
      method: supertest(app).get
    }
  ];

  protectedEndpoints.forEach(endpoint => {
    describe(endpoint.name, () => {
      it(`responds 401 'Unauthorized request' when no credentials in token`, () => {
        const userNoCreds = { user_name: "", password: "" };
        return endpoint
          .method(endpoint.path)
          .set("Authorization", helpers.makeAuthHeader(userNoCreds))
          .expect(401, { error: `Unauthorized request` });
      });

      it(`responds 401 'Unauthorized request' when invalid user`, () => {
        const userInvalidCreds = { user_name: "user-not", password: "existy" };
        return endpoint
          .method(endpoint.path)
          .set("Authorization", helpers.makeAuthHeader(userInvalidCreds))
          .expect(401, { error: `Unauthorized request` });
      });
    });
  });
});
