import express from "express";
import { conn } from "../dbconnet";
import mysql from "mysql";
//router = ตัวจัดการเส้นทาง
export const router = express.Router();
  
  router.get("/", (req, res) => {
    let sql = "SELECT * FROM Picture";
    conn.query(sql, (err, result) => {
      if (err) throw err;
      res
        .status(200)
        .json(result);
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

  
 