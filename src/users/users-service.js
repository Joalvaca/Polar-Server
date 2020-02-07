const UsersService = {
  getAllUsers(knex) {
    return knex.select("*").from("polar_users");
  },

  insertUser(knex, newUser) {
    return knex
      .insert(newUser)
      .into("polar_users")
      .returning("*")
      .then(rows => {
        return rows[0];
      });
  },

  getById(knex, id) {
    return knex
      .from("polar_users")
      .select("*")
      .where("id", id)
      .first();
  },

  deleteUser(knex, id) {
    return knex("polar_users")
      .where({ id })
      .delete();
  },

  updateUser(knex, id, newUserFields) {
    return knex("polar_users")
      .where({ id })
      .update(newUserFields);
  }
};

module.exports = UsersService;
