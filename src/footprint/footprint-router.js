const express = require("express");
const FootPrintService = require("./footprint-service");
const footprintRouter = express.Router();

footprintRouter
  .route("/")
  .get((req, res, next) => {
    FootPrintService.getAllPrints(req.app.get("db"))
      .then(prints => {
        res.json(prints);
      })
      .catch(next);
  })

  .post()
  .delete()
  .patch();

module.exports = footprintRouter;
