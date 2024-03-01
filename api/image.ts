import express from "express";
import { conn } from "../dbconnet";


//router = ตัวจัดการเส้นทาง
export const router = express.Router();


router.get("/", (req, res) => {
   // let sql = "SELECT url FROM Picture ORDER BY RAND() LIMIT 2";
    let sql = "SELECT * FROM Picture";

    conn.query(sql, (err, result) => {
        if (err) throw err;
        res.status(200).json(result);
    })
  });