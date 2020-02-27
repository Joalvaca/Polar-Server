const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

function makeFootprintsArray() {
  return [
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
}

function makeUsersArray() {
  return [
    {
      id: 1,
      first_name: "tester",
      last_name: "tested",
      user_name: "test1",
      password: "Password1!"
    }
  ];
}

function makeFixures() {
  const testUsers = makeUsersArray();
  const testPrints = makeFootprintsArray();

  return { testUsers, testPrints };
}

function cleanTables(db) {
  return db.raw(
    `TRUNCATE
            polar_prints,
            polar_users
            CASCADE
        `
  );
}

function seedUsers(db, users) {
  const preppedUsers = users.map(user => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1)
  }));
  return db
    .into("polar_users")
    .insert(preppedUsers)
    .then(() =>
      db.raw(`SELECT setval('polar_users_id_seq', ?)`, [
        users[users.length - 1].id
      ])
    );
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.user_name,
    algorithm: "HS256"
  });
  return `Bearer ${token}`;
}

module.exports = {
  makeFootprintsArray,
  makeUsersArray,
  makeFixures,
  cleanTables,
  seedUsers,
  makeAuthHeader
};
