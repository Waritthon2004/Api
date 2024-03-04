import express from "express";
import { conn } from "../dbconnet";
import mysql from "mysql";

export const router = express.Router();

router.put("/", (req, res) => {
  const image = req.body;
  let pointA ;
  let pointB ;
  let a = 1 / (1 + Math.pow(10, (image.point2 - image.point1) / 400));
  let b = 1 / (1 + Math.pow(10, (image.point1- image.point2) / 400));
  console.log(a,b);
  
  if (image.win == 1) {
      pointA = image.point1 + 32 * (1 - a);
      pointB = image.point2 + 32 * (0 - b);
 
  } else if (image.win == 2) {
      pointA = image.point1 + 32 * (0 - a);
      pointB = image.point2 + 32 * (1 - b);
  }

  if(pointA <=0){
    pointA = 0;
  }

  if(pointB <=0){
    pointB = 0;
  }


  let sql1 = "update Picture set `point` = ?  where `PID` = ?";
  let sql2 = "update Picture set `point` = ?  where `PID` = ?";
  sql1 = mysql.format(sql1, [pointA, image.PID1]);

  sql2 = mysql.format(sql2, [pointB, image.PID2]);

  // สร้าง Promise สำหรับ query ทั้งสอง
  // let query1 = new Promise((resolve, reject) => {
  //   conn.query(sql1, (err, result) => {
  //     if (err) reject(err);
  //     resolve(result);
  //   });
  // });
  conn.query(sql1, (err, result) => {
        if (err) throw(err);
        
        res.status(400);
      });

      conn.query(sql2, (err, result) => {
        if (err) throw(err);
        
        res.status(400);
      });
  // let query2 = new Promise((resolve, reject) => {
  //   conn.query(sql2, (err, result) => {
  //     if (err) reject(err);
  //     resolve(result);
  //   });
  // });

  // รอให้ทั้งสอง query เสร็จสิ้นแล้วค่อยส่ง response กลับไปยัง client
  // Promise.all([query1, query2])
  //   .then((results) => {
  //     res.status(200).json(results);
  //   })
  //   .catch((err) => {
  //     res.status(500).json({ error: err.message });
  //   });
});
