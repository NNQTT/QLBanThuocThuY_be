import express, { request } from "express";
import apiController from "../controller/apiControllers";
import auth from "../controller/authController";

const router = express.Router();

const initApiRoute = (app) => {
    
    router.get('/getTest', apiController.getTest);
    router.post('/signup', auth.signup);
    router.post('/login', auth.login);
    router.post('/logout', auth.logout);
    router.post('/loginAdmin', auth.loginAdmin);
    router.post('/signupadmin', auth.signupAdmin);
    router.get('/getListUser', auth.getListUser);
    router.get('/authenticationLogin', auth.authenticationLogin);
    router.get('/reloginwithrefreshtoken', auth.reloginwithrefreshtoken);

    return app.use('/api', router);
}

module.exports = initApiRoute;