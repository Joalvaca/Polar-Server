const FootPrintService = {
  getAllPrints(knex) {
    return knex.select("*").from("polar_prints");
  },
  insertPrint(knex, newPrint) {
    return knex
      .insert(newPrint)
      .into("polar_prints")
      .returning("*")
      .then(row => {
        return row[0];
      });
  },
  getById(knex, id) {
    return knex
      .from("polar_prints")
      .select("*")
      .where("id", id)
      .first();
  },
  deletePrint(knex, id) {
    return knex("polar_prints")
      .where({ id })
      .delete();
  },
  updatePrint(knex, id, newPrintFields) {
    return knex("polar_prints")
      .where({ id })
      .update(newPrintFields);
  }
};

module.exports = FootPrintService;
