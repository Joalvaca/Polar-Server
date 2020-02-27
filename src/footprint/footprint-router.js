const path = require("path");
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
          // .location(req.originalUrl + `/${print.id}`)
          .location(path.posix.join(req.originalUrl, `/${print.id}`))
          .json(print);
      })
      .catch(next);
  });

footPrintRouter
  .route("/:print_id")
  .all((req, res, next) => {
    FootPrintService.getById(req.app.get("db"), req.params.print_id)
      .then(prints => {
        if (!prints) {
          return res.status(404).json({
            error: { message: `Footprint doesn't exist` }
          });
        }
        req.prints = prints;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(req.prints);
  })
  .delete((req, res, next) => {
    FootPrintService.deletePrint(req.app.get("db"), req.params.print_id)
      .then(numRowsAffected => {
        res.status(204).send();
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

    const numberOfValues = Object.values(printToUpdate).filter(Boolean).length;
    if (numberOfValues === 0) {
      return res.status(400).json({
        error: {
          message: `Request body must contain either 'product name ', 'purchase price', 'sold price','purchase date' or 'sold date'`
        }
      });
    }

    FootPrintService.updatePrint(
      req.app.get("db"),
      req.params.print_id,
      printToUpdate
    )
      .then(numRowsAffected => {
        res.send(204);
      })
      .catch(next);
  });

module.exports = footPrintRouter;
