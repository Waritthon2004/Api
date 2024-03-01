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
  
  router.put("/", (req, res) => {
      const image = req.body;
      console.log(image);
      
      let sql1 = "update Picture set `point` = ?  where `PID` = ?";
      let sql2 = "update Picture set `point` = ?  where `PID` = ?";
      sql1 = mysql.format(sql1, [
          image.point1,
          image.PID1
      ]);
  
      sql2 = mysql.format(sql2, [
          image.point2,
          image.PID2
      ]);
      
      // สร้าง Promise สำหรับ query ทั้งสอง
      let query1 = new Promise((resolve, reject) => {
          conn.query(sql1, (err, result) => {
              if (err) reject(err);
              resolve(result);
          });
      });
  
      let query2 = new Promise((resolve, reject) => {
          conn.query(sql2, (err, result) => {
              if (err) reject(err);
              resolve(result);
          });
      });
  
      // รอให้ทั้งสอง query เสร็จสิ้นแล้วค่อยส่ง response กลับไปยัง client
      Promise.all([query1, query2])
          .then((results) => {
              res.status(200).json(results);
          })
          .catch((err) => {
              res.status(500).json({ error: err.message });
          });
  });
  