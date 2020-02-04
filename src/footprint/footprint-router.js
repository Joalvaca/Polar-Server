const express = require("express");
const FootPrintService = require("./footprint-service");
const footprintRouter = express.Router();

footprintRouter
  .route("/footprint")
  .get((req, res, next) => {
    FootPrintService.getAllPrints(req.app.get("db"))
      .then(prints => {
        res.json(prints);
      })
      .catch(next);
  })

  .post(jsonParser, (req, res, next) => {
    const { name, date_purchased, price_purchase, sell_purchase } = req.body;
    const newPrint = { name, date_purchased, price_purchase, sell_purchase };

    FootPrintService.insertPrint(req.app.get("db"), newPrint)
      .then(print => {
        res
          .status(201)
          .location(`/footprint/${print.id}`)
          .json(print);
      })
      .catch(next);
  })

  .delete((req, res, next) => {
    FootPrintService.deletePrint(req.app.get("db"), req.params.print_id)
      .then(numRowsAffected => {
        res.status(204).end();
      })
      .catch(next);
  })

  .patch(jsonParser, (req, res, next) => {
    const { name, date_purchased, price_purchase, sell_purchase } = req.body;
    const printToUpdate = {
      name,
      date_purchased,
      price_purchase,
      sell_purchase
    };

    FootPrintService.updatePrint(
      req.app.get("db"),
      req.params.print_id,
      printToUpdate
    )
      .then(numRowsAffected => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = footprintRouter;
