import express from "express";
import { conn } from "../dbconnet";
import mysql from "mysql";
import { UserPostRequest } from "../model/insertusermodel";
import bcrypt from "bcrypt";
import { Loginrespone } from "../model/modellogin";

//router = ตัวจัดการเส้นทาง
export const router = express.Router();

router.get("/", (req, res) => {
  const sql = "Select * from User ";
  conn.query(sql, (err, result) => {
    if (err) {
      res.status(400).json(err);
    } else {
      res.json(result);
    }
  });
});

async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}
router.post("/", async (req, res) => {
  let user: UserPostRequest = req.body;

  console.log(user);
  
  
  try {
    const password = user.Password;
    user.Password = await hashPassword(password);
    let sql =
      "INSERT INTO `User`(`Firstname`, `Lastname`, `Email`, `Password`) VALUES (?,?,?,?)";
    sql = mysql.format(sql, [
      user.Firstname,
      user.Lastname,
      user.Email,
      user.Password,
    ]);

    conn.query(sql, (err, result) => {
      if (err) throw err;

      res.status(201).json({
        affected_row: result.affectedRows,
        last_idx: result.insertId,  
      });
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

// เปรียบเทียบรหัสผ่านแบบแฮช
async function comparePassword(
  inputPassword: string,
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(inputPassword, hashedPassword);
}

router.post("/check", async (req, res) => {
    let user: Loginrespone = req.body;

    let sql = "SELECT UID, Email, Password FROM User WHERE Email = ?";
    sql = mysql.format(sql, [user.Email]);
    conn.query(sql, async (err, result) => {
        if (err) throw err;
        try {
            const isMatch = await comparePassword(user.Password, result[0].Password);
            if (isMatch) {
                res.status(201).json({ UID : result[0].UID});
            } else {
                res.json({ UID : "Invalid password" });
            }
        } catch (error) {
            res.status(500).json(err);
        }
    });
});


