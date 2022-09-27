require("dotenv").config();
const Hermodr = require("hermodr-logger");
Hermodr.config({ stack: false });
import express from "express";

const app = express();
app.use(express.json());

Hermodr.log("test");

app.listen(3001, () => Hermodr.log("Listening 3000"));
