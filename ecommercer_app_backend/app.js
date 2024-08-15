const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const authJwt = require("./middlewares/jwt");
const errorHandler = require("./middlewares/error_handler");

require("dotenv").config();

const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const adminRouter = require("./routes/admin");
const categoriesRouter = require("./routes/categories");
const productsRouter = require("./routes/product");
const checkoutRouter = require("./routes/checkout");
const orderRouter = require("./routes/order");

const authorizePostRequests = require("./middlewares/authorization");

const port = process.env.PORT;
const API = process.env.API_URL;
const hostname = process.env.HOST;

const app = express();

app.use(bodyParser.json());
app.use(morgan("tiny"));
app.use(cors());
app.options("*", cors());
app.use(authJwt());
app.use(authorizePostRequests);
app.use(errorHandler);

app.use(`${API}/`, authRouter);
app.use(`${API}/users`, userRouter);
app.use(`${API}/admin`, adminRouter);
app.use(`${API}/categories`, categoriesRouter);
app.use(`${API}/product`, productsRouter);
app.use(`${API}/checkout`, checkoutRouter);
app.use(`${API}/order`, orderRouter);

app.use("/public", express.static(__dirname + "/public"));

require("./helpers/cron_job");

mongoose
  .connect(process.env.DB_CONNECTION)
  .then(() => {
    console.log("Connected to DB ");
  })
  .catch((error) => {
    console.error(error);
  });

app.listen(port, hostname, () =>
  console.log(`Server running at: http://localhost:${port}`)
);
