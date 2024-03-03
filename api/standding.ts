import express from "express";
import { conn } from "../dbconnet";


export const router = express.Router();


router.get("/", (req, res) => {
        let sql = "SELECT * FROM Picture ORDER BY point DESC LIMIT 10";
    conn.query(sql, (err, result) => {
      if (err) throw err;
      res
        .status(200)
        .json(result);
    });
  });