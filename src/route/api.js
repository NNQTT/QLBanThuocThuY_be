import express, { request } from "express";
import apiController from "../controller/apiControllers";
import auth from "../controller/authcontroller";

const router = express.Router();

const initApiRoute = (app) => {
    
    router.get('/getTest', apiController.getTest);
    router.post('/signup', auth.signup);
    router.post('/login', auth.login);
    router.post('/loginAdmin', auth.loginAdmin);
    router.post('/signupadmin', auth.signupAdmin);
    router.get('/getListUser', auth.getListUser);
    router.get('/authenticationLogin', auth.authenticationLogin);

    return app.use('/api', router);
}

module.exports = initApiRoute;