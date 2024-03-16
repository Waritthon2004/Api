import express from "express";
import { conn } from "../dbconnet";


export const router = express.Router();


router.get("/", (req, res) => {
    let sql = `SELECT *, ROW_NUMBER() OVER (ORDER BY point DESC) AS "rank" FROM Statics,Picture 
    WHERE  Picture.PID = Statics.PID
     ORDER BY point DESC LIMIT 10`;
    conn.query(sql, (err, result) => {
      if (err) throw err;
      res
        .status(200)
        .json(result);
    });
  });

  router.get("/pervious", (req, res) => {
    let sql = `SELECT *, ROW_NUMBER() OVER (ORDER BY point DESC) AS "rank" FROM Statics,Picture 
    WHERE  Picture.PID = Statics.PID
    AND DATEDIFF(CURDATE(),Date)=1 ORDER BY point DESC LIMIT 10
    `;
    conn.query(sql, (err, result) => {
      if (err) throw err;
      res
        .status(200)
        .json(result);
    });
  });