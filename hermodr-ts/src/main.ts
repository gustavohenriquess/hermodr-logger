require("dotenv").config();
import express from "express";

const app = express();
app.use(express.json());

import Hermodr from "hermodr-logger";

Hermodr.config({
  stack: false,
  database: {
    database: true,
    database_name: "mongodb",
    database_uri: process.env.MONGO_URI,
  },
});

Hermodr.debug("express", "express is running");
Hermodr.warn("express", "express is running");
Hermodr.error("express", "express is running");

const server = app.listen(3001, () => Hermodr.log("Listening 3000"));
