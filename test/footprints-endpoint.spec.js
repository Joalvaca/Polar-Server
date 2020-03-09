const { expect } = require("chai");
const knex = require("knex");
const app = require("../src/app");
const { makeFootprintsArray } = require("./footprints.fixtures");
const helpers = require("./test-helpers");

const testUsers = helpers.makeUsersArray();

describe("Footprints Endpoints", function() {
  let db;

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DB_URL
    });
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy());

  before("clean the table", () => helpers.cleanTables(db));

  afterEach("cleanup", () => helpers.cleanTables(db));
  beforeEach("insert users", () => helpers.seedUsers(db, testUsers));

  describe(`GET /api/footprints`, () => {
    context(`Given no prints`, () => {
      it(`responds with 200 and and empty list`, () => {
        return supertest(app)
          .get("/api/footprints")
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(200, []);
      });
    });

    context("Given there are prints in the database", () => {
      const testPrints = makeFootprintsArray();
      beforeEach("insert prints", () => {
        return db.into("polar_prints").insert(testPrints);
      });

      it("responds with 200 and all of the footprints", () => {
        return supertest(app)
          .get("/api/footprints")
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(200, testPrints);
      });
    });
  });

  describe("GET /api/fooprints/:print_id", () => {
    context(`Given no footprints`, () => {
      it(`responds with 404`, () => {
        const printId = 125455;
        return supertest(app)
          .get(`/api/footprints/${printId}`)
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(404, { error: { message: `Footprint doesn't exist` } });
      });
    });

    context("Given there are footprints in the database", () => {
      const testPrints = makeFootprintsArray();

      beforeEach("insert prints", () => {
        return db.into("polar_prints").insert(testPrints);
      });

      it("responds with 200 and the specified footprint", () => {
        const printId = 2;
        const expectedPrint = testPrints[printId - 1];
        return supertest(app)
          .get(`/api/footprints/${printId}`)
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(200, expectedPrint);
      });
    });
  });

  describe(`POST /api/footprints`, () => {
    it(`creates an footprint, responding with a 201 and a new footprint`, function() {
      this.retries(3);
      const newPrint = {
        product_name: "test",
        date_purchased: "12/2/20",
        date_sold: "12/12/20",
        purchase_price: "123",
        sold_price: "123"
      };
      return supertest(app)
        .post("/api/footprints")
        .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
        .send(newPrint)
        .expect(201)
        .expect(res => {
          expect(res.body.product_name).to.eql(newPrint.product_name);
          expect(res.body.date_purchased).to.eql(newPrint.date_purchased);
          expect(res.body.purchase_price).to.eql(newPrint.purchase_price);
          expect(res.body.date_sold).to.eql(newPrint.date_sold);
          expect(res.body.sold_price).to.eql(newPrint.sold_price);
          expect(res.body).to.have.property("id");
          expect(res.headers.location).to.eql(`/api/footprints/${res.body.id}`);
          const expected = new Date().toLocaleString("en", { timeZone: "UTC" });
          const actual = new Date().toLocaleString("en", {
            timeZone: "UTC"
          });
          expect(actual).to.eql(expected);
        })
        .then(res =>
          supertest(app)
            .get(`/api/footprints/${res.body.id}`)
            .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
            .expect(res.body)
        );
    });

    const requiredFields = [
      "product_name",
      "date_purchased",
      "date_sold",
      "purchase_price",
      "sold_price"
    ];

    requiredFields.forEach(field => {
      const newPrint = {
        product_name: "test new print",
        date_purchased: "12/2/21",
        date_sold: "12/12/21",
        purchase_price: "12344",
        sold_price: "12344"
      };

      it(`responds with 400 and an error message when the '${field}' is missing`, () => {
        delete newPrint[field];

        return supertest(app)
          .post("/api/footprints")
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .send(newPrint)
          .expect(400, {
            error: { message: `Missing '${field}' in request body` }
          });
      });
    });

    describe(`DELETE /api/footprints/:print_id`, () => {
      context(`Given no footprints`, () => {
        it(`responds with 404`, () => {
          const printId = 12345;
          return supertest(app)
            .delete(`/api/footprints/${printId}`)
            .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
            .expect(404, { error: { message: `Footprint doesn't exist` } });
        });
      });

      context("Given there are footprints in the database", () => {
        const testPrints = makeFootprintsArray();

        beforeEach("insert prints", () => {
          return db.into("polar_prints").insert(testPrints);
        });

        it("responds with 204 and removes the article", () => {
          const idToRemove = 2;
          const expectedPrint = testPrints.filter(
            print => print.id !== idToRemove
          );

          return supertest(app)
            .delete(`/api/footprints/${idToRemove}`)
            .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
            .expect(204)
            .then(res =>
              supertest(app)
                .get(`/api/footprints`)
                .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
                .expect(expectedPrint)
            );
        });
      });
    });

    describe(`PATCH /api/footprints/:print_id`, () => {
      context(`Given no footprints`, () => {
        it(`responds with 404`, () => {
          const printId = 1234567;
          return supertest(app)
            .delete(`/api/footprints/${printId}`)
            .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
            .expect(404, { error: { message: `Footprint doesn't exist` } });
        });
      });

      context("Given there are footprints in the database", () => {
        const testPrints = makeFootprintsArray();

        beforeEach("insert footprints", () => {
          return db.into("polar_prints").insert(testPrints);
        });

        it("responds with 204 and updates the footprint", () => {
          const idToUpdate = 2;
          const updatePrint = {
            product_name: "update print",
            date_purchased: "12/23/20",
            date_sold: "12/4/20",
            purchase_price: "123",
            sold_price: "125"
          };
          const expectedPrint = {
            ...testPrints[idToUpdate - 1],
            ...updatePrint
          };

          return supertest(app)
            .patch(`/api/footprints/${idToUpdate}`)
            .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
            .send(updatePrint)
            .expect(204)
            .then(res =>
              supertest(app)
                .get(`/api/footprints/${idToUpdate}`)
                .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
                .expect(expectedPrint)
            );
        });

        it(`responds with 400 when no required fields supplied`, () => {
          const idToUpdate = 2;
          return supertest(app)
            .patch(`/api/footprints/${idToUpdate}`)
            .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
            .send({ irrelevantField: "foo" })
            .expect(400, {
              error: {
                message: `Request body must contain either 'product name ', 'purchase price', 'sold price','purchase date' or 'sold date'`
              }
            });
        });

        it(`responds with 204 when updating only a subset of fields`, () => {
          const idToUpdate = 2;
          const updatePrint = {
            product_name: "updated product name"
          };

          const expectedPrint = {
            ...testPrints[idToUpdate - 1],
            ...updatePrint
          };

          return supertest(app)
            .patch(`/api/footprints/${idToUpdate}`)
            .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
            .send({
              ...updatePrint,
              fieldToIgnore: "should not be in GET response"
            })

            .expect(204)
            .then(res =>
              supertest(app)
                .get(`/api/footprints/${idToUpdate}`)
                .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
                .expect(expectedPrint)
            );
        });
      });
    });
  });
});
