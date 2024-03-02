import express from "express";
import { conn } from "../dbconnet";
import mysql from "mysql";
//router = ตัวจัดการเส้นทาง
export const router = express.Router();


  
  router.get("/", (req, res) => {
    let sql = "SELECT * FROM Picture ORDER BY RAND() LIMIT 2";
    conn.query(sql, (err, result) => {
      if (err) throw err;
  
      res
        .status(200)
        .json({
          pid1: result[0].PID,
          image1: result[0].url,
          point1: result[0].point,
  
          image2: result[1].url,
          point2: result[1].point,
          pid2: result[1].PID
        });
    });
  });
  
 