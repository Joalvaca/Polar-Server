const express = require("express");
const FootPrintService = require("./footprint-service");
const footPrintRouter = express.Router();

footPrintRouter
  .route("/")
  .get((req, res, next) => {
    FootPrintService.getAllPrints(req.app.get("db"))
      .then(prints => {
        res.json(prints);
      })
      .catch(next);
  })

  .post((req, res, next) => {
    const {
      product_name,
      date_purchased,
      date_sold,
      purchase_price,
      sold_price
    } = req.body;
    const newPrint = {
      product_name,
      date_purchased,
      date_sold,
      purchase_price,
      sold_price
    };

    for (const [key, value] of Object.entries(newPrint)) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        });
      }
    }

    FootPrintService.insertPrint(req.app.get("db"), newPrint)
      .then(print => {
        res
          .status(201)
          .location(`/${print.id}`)
          .json(print);
      })
      .catch(next);
  });

footPrintRouter
  .route("/:print_id")
  .get((req, res, next) => {
    FootPrintService.getById(req.app.get("db"), req.params.print_id)
      .then(prints => {
        res.json(prints);
      })
      .catch(next);
  })
  .delete((req, res, next) => {
    FootPrintService.deletePrint(req.app.get("db"), req.params.print_id)
      .then(numRowsAffected => {
        res.json({ status: "deleted" });
      })
      .catch(next);
  })
  .patch((req, res, next) => {
    const {
      product_name,
      date_purchased,
      date_sold,
      purchase_price,
      sold_price
    } = req.body;
    const printToUpdate = {
      product_name,
      date_purchased,
      date_sold,
      purchase_price,
      sold_price
    };

    FootPrintService.updatePrint(
      req.app.get("db"),
      req.params.print_id,
      printToUpdate
    )
      .then(numRowsAffected => {
        res.json({ status: "posted" }, 200);
      })
      .catch(next);
  });

module.exports = footPrintRouter;
