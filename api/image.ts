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
    let sql = "SELECT * FROM Picture,Statics Where Picture.PID=Statics.PID AND DATEDIFF(CURDATE(),Date)=0 AND UID = ?";
    conn.query(sql,[id], (err, result) => {
      if (err) throw err;
      res
        .status(200)
        .json(result);
    });
  });

  router.get("/", async (req, res) => {
    let sql = "SELECT Picture.* FROM Picture ORDER BY RAND() LIMIT 2";
    conn.query(sql, async (err, result) => {
        if (err) throw err;

        if (result.length > 0) {
            let pid1 = result[0].PID;
            let pid2 = result[1].PID;
            let sql1 = "";
            let sql2 = "";
            try {
                let [data1, data2] : any= await Promise.all([
                    new Promise((resolve, reject) => {
                       sql1 = "SELECT point FROM Statics WHERE `PID` = ? ORDER BY DATE DESC LIMIT 1";
                      sql1 = mysql.format(sql1, [pid1]);
                        conn.query(sql1,(err, result) => {
                            if (err) reject(err);
                            resolve(result);
                        });
                    }),
                    new Promise((resolve, reject) => {
                       sql2 = "SELECT point FROM Statics WHERE `PID` = ? ORDER BY DATE DESC LIMIT 1";
                      sql2 = mysql.format(sql2, [pid2]);
                        conn.query(sql2,(err, result) => {
                            if (err) reject(err);
                            resolve(result);
                        });
                    })
                ]);
                console.log("SQL 1", sql1); 
                console.log("SQL 2", sql2);
                console.log("data1", data1);
                console.log("data2", data2);
                 
                res.status(200).json({
                    pid1: pid1,
                    image1: result[0].url,
                    point1: data1[0].point,

                    image2: result[1].url,
                    point2: data2[0].point,
                    pid2: pid2
                });
            } catch (err) {
                console.error(err);
                res.status(500).send("Internal Server Error");
            }
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

  
 