import express from "express";
import { conn } from "../dbconnet";
import mysql from "mysql";
//router = ตัวจัดการเส้นทาง
export const router = express.Router();

router.get("/", (req, res) => {
    let sql = "SELECT url FROM Picture ORDER BY RAND() LIMIT 2";
    conn.query(sql, (err, result) => {
        if (err) throw err;
       
        res.status(200).json({image1 : result[0].url, image2 : result[1].url});
    })
  });