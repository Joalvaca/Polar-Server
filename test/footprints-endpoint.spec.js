const { expect } = require("chai");
const knex = require("knex");
const app = require("../src/app");
const { makeFootprintsArray } = require("./footprints.fixtures");

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

  before("clean the table", () => db("polar_prints").truncate());

  afterEach("cleanup", () => db("polar_prints").truncate());

  describe(`GET /api/footprints`, () => {
    context(`Given no articles`, () => {
      it(`responds with 200 and and empty list`, () => {
        return supertest(app)
          .get("/api/footprints")
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
          .expect(200, testPrints);
      });
    });
  });

  describe("GET /api/footprints/:print_id", () => {
    context(`Given no footprints`, () => {
      it(`responds with 404`, () => {
        const printId = 125455;
        return supertest(app)
          .get(`/api/footprints/${printId}`)
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
        .send(newPrint)
        .expect(201)
        .expect(res => {
          expect(res.body.product_name).to.eql(newPrint.product_name);
          expect(res.body.date_purchased).to.eql(newPrint.date_purchased);
          expect(res.body.purchase_price).to.eql(newPrint.purchase_price);
          expect(res.body.date_sold).to.eql(newPrint.date_sold);
          expect(res.body.sold_price).to.eql(newPrint.sold_price);
          expect(res.body).to.have.property("id");
          expect(res.headers.location).to.eql(`/${res.body.id}`);
          const expected = new Date().toLocaleString("en", { timeZone: "UTC" });
          const actual = new Date().toLocaleString("en", {
            timeZone: "UTC"
          });
          expect(actual).to.eql(expected);
        })
        .then(res =>
          supertest(app)
            .get(`/api/footprint/${res.body.id}`)
            .expect(res.body)
        );
    });

    const requiredFields = [
      "product_name,date_purchased,date_sold,purchase_price,sold_price"
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
          .send(newPrint)
          .expect(400, {
            error: { message: `Missing '${field}' in request body` }
          });
      });
    });
  });
});
