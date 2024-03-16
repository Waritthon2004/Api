import express from "express";
import { conn } from "../dbconnet";
import mysql from "mysql";

export const router = express.Router();
router.post("/chart",async (req, res) => {
  
  const data = req.body;
  let sql = "SELECT DISTINCT DATE_FORMAT(Date, '%Y-%m-%d') AS Date, point  FROM Statics  WHERE PID = 102 AND DATEDIFF(Date, CURDATE()) <= 7 ORDER BY Date ASC";
  conn.query(sql, (err, result) => {
    if (err) throw err;
    res
      .status(200)
      .json(result);
    console.log(result);
    
  });
});




router.put("/",async (req, res) => {
  const image = req.body;
  let pointA ;
  let pointB ;
  let a = 1 / (1 + Math.pow(10, (image.point2 - image.point1) / 400));
  let b = 1 / (1 + Math.pow(10, (image.point1- image.point2) / 400));
  
  
  console.log(image);

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
  const currentDate = new Date().toISOString().slice(0, 10);
  let check1: any = await new Promise((resolve, reject) => {
    conn.query("select SID from Statics where `Date` = ?  and `PID` = ?", [currentDate,image.PID1], (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });

  let check2: any = await new Promise((resolve, reject) => {
    conn.query("select SID from Statics where `Date` = ?  and `PID` = ?", [currentDate,image.PID2], (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });

  let sql1 = "";
  let sql2 = "";
 
  if(check1.length>0){
    sql1 = "update Statics set `point` = ?  where `SID` = ?";
    sql1 = mysql.format(sql1, [pointA, check1[0].SID]);
  }
  else{
    sql1 = "INSERT INTO `Statics`(`PID`, `Date`, `point`) VALUES (?,?,?)";
    sql1 = mysql.format(sql1, [image.PID1,currentDate, pointA]);
  }

  if(check2.length>0){
     sql2 = "update Statics set `point` = ?  where `SID` = ?";
    sql2 = mysql.format(sql2, [pointB,check2[0].SID]);
  }
  else{
    sql2 = "INSERT INTO `Statics`(`PID`, `Date`, `point`) VALUES (?,?,?)";
    sql2 = mysql.format(sql2, [image.PID2, currentDate,pointB]);
  }
console.log(sql1);
console.log(sql2);


  Promise.all([
    new Promise((resolve, reject) => {
      conn.query(sql1, (err, result) => {
        if (err) reject(err);
        resolve(result.affectedRows);
      });
    }),
    new Promise((resolve, reject) => {
      conn.query(sql2, (err, result) => {
        if (err) reject(err);
        resolve(result.affectedRows);
      });
    })
  ])
    .then(results => {
      res.status(200).send(results);
      
    })
    .catch(err => {
      res.status(400).send(err);
    });

});


