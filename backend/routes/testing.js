import express from "express";
import testingController from "../controllers/TestingController.js";

const route = express.Router();

route.post("/reset", testingController.resetDatabase);

export default route;
