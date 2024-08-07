const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

app.use(bodyParser.json());
app.use(morgan("tiny"));
app.use(cors());
app.options("*", cors());

const authRouter = require("./routes/auth");
// const productRouter = require("./routes/product");

app.use("/auth", authRouter);
// app.use("/product", productRouter);

const port = process.env.PORT;
const hostname = process.env.HOSTNAME;

mongoose
  .connect(process.env.DB_CONNECTION)
  .then(() => {
    console.log("Connected to DB ");
  })
  .catch((error) => {
    console.error(error);
  });

app.listen(port, hostname, () =>
  console.log(`Server running at: http://${hostname}:${port}`)
);
