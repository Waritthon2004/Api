import express from "express";
import { conn } from "../dbconnet";
import mysql from "mysql";

export const router = express.Router();

router.put("/",async (req, res) => {
  const image = req.body;
  let pointA ;
  let pointB ;
  let a = 1 / (1 + Math.pow(10, (image.point2 - image.point1) / 400));
  let b = 1 / (1 + Math.pow(10, (image.point1- image.point2) / 400));
  
  
  
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
  let check1: any = await new Promise((resolve, reject) => {
    conn.query("select * from Statics where `Dete` = ?  where `PID` = ?", [], (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });

  let check2: any = await new Promise((resolve, reject) => {
    conn.query("select SID from Statics where `Dete` = ?  where `PID` = ?", [], (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
  const currentDate = new Date().toISOString().slice(0, 10);

  let sql1 = "";
  let sql2 = "";

  if(check1){
    sql1 = "update Statics set `point` = ?  where `SID` = ?";
    sql1 = mysql.format(sql1, [pointA, image.PID1]);
  }
  else{
    sql1 = "INSERT INTO `Statics`(`PID`, `Date`, `point`) VALUES (?,?,?)";
    sql1 = mysql.format(sql1, [pointA,currentDate, image.PID1]);
  }

  if(check2){
     sql2 = "update Statics set `point` = ?  where `SID` = ?";
    sql2 = mysql.format(sql2, [pointB,image.PID2]);
  }
  else{
    sql2 = "INSERT INTO `Statics`(`PID`, `Date`, `point`) VALUES (?,?,?)";
    sql2 = mysql.format(sql2, [pointB, currentDate,image.PID2]);
  }
  Promise.all([
    new Promise((resolve, reject) => {
      conn.query(sql1, (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    }),
    new Promise((resolve, reject) => {
      conn.query(sql2, (err, result) => {
        if (err) reject(err);
        resolve(result);
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


