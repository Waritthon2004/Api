import express from "express";
import { conn } from "../dbconnet";
import mysql from "mysql";
//router = ตัวจัดการเส้นทาง
export const router = express.Router();
  
  router.get("/all", (req, res) => {
    let sql = "SELECT * FROM Picture";
    conn.query(sql, (err, result) => {
      if (err) throw err;
      res
        .status(200)
        .json(result);
    });
  });
  //get image by id
  router.get("/all/:id", (req, res) => {
    const id = req.params.id;
    let sql = "SELECT * FROM Picture Where UID = ?";
    conn.query(sql,[id], (err, result) => {
      if (err) throw err;
      res
        .status(200)
        .json(result);
    });
  });
  router.get("/", (req, res) => {
    let sql = "SELECT Picture.*,Statics.point as point FROM Picture,Statics WHERE Picture.PID = Statics.PID and DATEDIFF(Date, CURDATE())=0 ORDER BY RAND() LIMIT 2";
    conn.query(sql, (err, result) => {
      if (err) throw err;

      if(result.length > 0){
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
      }
      
    });
  });

  router.delete("/:id", (req, res) => {
    const id = req.params.id;
    console.log(id);
    
    let sql = "DELETE FROM Picture WHERE PID = ?";
    conn.query(sql,[id],(err, result) => {
      if (err) throw err;
      else res.json({affected_row:result.affectedRows});
    });
  });

  router.get('/date/:day',(req,res)=>{
    const day = req.params.day;
    let sql = "SELECT * FROM Statics,Picture WHERE Picture.PID = Statics.PID and DATEDIFF(CURDATE(),Date )=?";
    conn.query(sql,[day],(err,result)=>{
      if(err) throw err;
      res.json(result); 
    })
  })

  
 