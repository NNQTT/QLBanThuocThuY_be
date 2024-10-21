import express, { request } from "express";
import apiController from "../controller/apiControllers";

const router = express.Router();

const initApiRoute = (app) => {
    router.get('/getTest', apiController.getTest);

    return app.use('/api', router);
}

module.exports = initApiRoute;