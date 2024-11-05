
import express from "express";
import orderController from "../controller/orderControllers";

const router = express.Router();

const initOrdersRoute = (app) =>{
    router.get('/getOrders', orderController.getOrders);
    router.get('/getOrderDetails/:maDonHang', orderController.getOrderDetails);
    return app.use('/order', router);
}

module.exports = initOrdersRoute;