import express from "express";
import bodyParser from "body-parser";
import {router as user} from "./api/user";
import cors from "cors";
export const app = express();

app.use(
    cors({
      origin: "*",
    })
  );
//check body ก่อนเรียก path api
app.use(bodyParser.text());
app.use(bodyParser.json());
//-----------------



app.use("/user",user);