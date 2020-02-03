const FootPrintService = {
  getAllPrints(knex) {
    return knex.select("*").from("foot_prints");
  },
  insertPrint(knex, newPrint) {
    return knex
      .insert(newPrint)
      .into("foot_prints")
      .returning("*")
      .then(row => {
        return row[0];
      });
  },
  getbyId(knex, id) {
    return knex
      .from("foot_prints")
      .select("*")
      .where("id", id)
      .first();
  },
  deletePrint(knex, id) {
    return knex("foot_prints")
      .where({ id })
      .delete();
  },
  updatePrint(knex, id, newPrintFields) {
    return knex("foot_prints")
      .where({ id })
      .update(newPrintFields);
  }
};

module.exports = FootPrintService;
