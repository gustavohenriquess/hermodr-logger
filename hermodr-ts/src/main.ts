require("dotenv").config();
const Hermodr = require("./hermodr");
import express from "express";

const app = express();
app.use(express.json());

Hermodr.log("teste", "test");

app.listen(3001, () => console.log("Listening 3000"));
