const knex = require("knex");
const app = require("../src/app");
const helpers = require("./test-helpers");
const bcrypt = require("bcryptjs");

describe("Users Endpoints", function() {
  let db;

  let testUsers = [
    {
      id: 1,
      first_name: "tester",
      last_name: "tested",
      user_name: "test1",
      password: "Password1!"
    }
  ];

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL
    });
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy());

  before("clean the table", () =>
    db.raw(`TRUNCATE polar_users, polar_prints,RESTART IDENTITY CASCADE`)
  );

  beforeEach("insert users", () => helpers.seedUsers(db, testUsers));

  afterEach("clean the table", () =>
    db.raw(
      `TRUNCATE bookery_users, bookery_books, bookery_bookshelf RESTART IDENTITY CASCADE`
    )
  );

  describe(`POST /api/users`, () => {
    context(`Happy path`, () => {
      it(`responds 201, serialized user, storing bcryped password`, () => {
        const newUser = {
          first_name: "tester first_name",
          last_name: "tested last_name",
          user_name: "test1 user_name",
          password: "Password1!"
        };
        return supertest(app)
          .post("/api/users")
          .set("Content-Type", "application/json")
          .set("Authorization", helpers.makeAuthHeader(newUser))
          .send(newUser)
          .expect(201)
          .expect(res => {
            expect(res.body).to.have.property("id");
            expect(res.body.first_name).to.eql(newUser.first_name);
            expect(res.body.last_name).to.eql(newUser.last_name);
            expect(res.body.user_name).to.eql(newUser.user_name);
            expect(res.body).to.not.have.property("password");
            expect(res.headers.location).to.eql(`/api/users/${res.body.id}`);
          })
          .expect(res =>
            db
              .from("polar_users")
              .select("*")
              .where({ id: res.body.id })
              .first()
              .then(row => {
                expect(row.first_name).to.eql(newUser.first_name);
                expect(row.last_name).to.eql(newUser.last_name);
                expect(row.user_name).to.eql(newUser.user_name);
                return bcrypt.compare(newUser.password, row.password);
              })
              .then(compareMatch => {
                expect(compareMatch).to.be.true;
              })
          );
      });
    });
  });
});
