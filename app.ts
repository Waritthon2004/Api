import express from "express";
import bodyParser from "body-parser";
import {router as user} from "./api/user";
import {router as upload} from "./api/userupload";
import {router as image} from "./api/image";
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

app.use("/upload",upload);

app.use("/image",image);
