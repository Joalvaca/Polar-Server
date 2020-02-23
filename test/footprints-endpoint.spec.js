const { expect } = require("chai");
const knex = require("knex");
const app = require("../src/app");

describe.only("Footprints Endpoints", function() {
  let db;
  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DB_URL
    });
  });

  after("disconnect from db", () => db.destroy());

  before("clean the table", () => db("polar_prints").truncate());

  afterEach("cleanup", () => db("polar_prints").truncate());

  context("Given there are prints in the database", () => {
    const testPrints = [
      {
        id: 1,
        product_name: "first test product",
        date_purchased: "12/01/20",
        date_sold: "12/01/20",
        purchase_price: "500",
        sold_price: "500"
      },
      {
        id: 2,
        product_name: "second test product",
        date_purchased: "12/01/20",
        date_sold: "12/01/20",
        purchase_price: "500",
        sold_price: "500"
      },
      {
        id: 3,
        product_name: "third test product",
        date_purchased: "12/01/20",
        date_sold: "12/01/20",
        purchase_price: "500",
        sold_price: "500"
      },
      {
        id: 4,
        product_name: "fourth test product",
        date_purchased: "12/01/20",
        date_sold: "12/01/20",
        purchase_price: "500",
        sold_price: "500"
      }
    ];

    beforeEach("insert prints", () => {
      return db.into("polar_prints").insert(testPrints);
    });

    it("GET /footprints responds with 200 and all of the articles", () => {
      return supertest(app)
        .get("/footprints")
        .expect(200, testPrints);
    });

    it("GET /fooprints/:print_id responds with 200 and the specified article", () => {
      const id = 2;
      const expectedPrint = testPrints[id - 1];
      return supertest(app)
        .get(`/footprints/${id}`)
        .expect(200, expectedPrint);
    });
  });
});
