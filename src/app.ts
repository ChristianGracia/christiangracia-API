// import * as express from 'express';
import express, { Request, Response } from "express";
import * as bodyParser from "body-parser";
import * as path from "path";
import * as dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();

const router = express.Router();
app.use(router);

const options: cors.CorsOptions = {
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "X-Access-Token",
  ],
  credentials: true,
  methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
  origin: "*",
  preflightContinue: false,
};

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept,content-type,application/json",
  );
  next();
});

router.use(cors(options));

router.options("*", cors(options));

app.set("port", process.env.PORT || 3000);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const homePage = `
<div style="background-color: black; height: 100%; margin: 0;">
  <h1 style="color: green;">Welcome to my API</h1>
  <h2 style="color: green;">
    This API serves <a style="color: white;" href="https://christiangracia.com">
      christiangracia.com
    </a>
  </h2>
  <h2 style="color: green; font-weight: bold;">
    Routes
  </h2>
  <h3 style="color: white;">/github</h3>
  <h3 style="color: white;">/email</h3>

  <p style="color: green;">
    created by christian gracia
  </p>
</div>;
`;

router.get("/", (req: Request, res: Response) => {
  res.send(homePage);
});

const githubController = require("./controllers/github");
app.use("/github", githubController);

const emailController = require("./controllers/email");
app.use("/email", emailController);

export default app;
