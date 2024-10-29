import express, { request } from "express";
import productController from "../controller/productController";

const router = express.Router();

const initProductRoute = (app) => {
    router.get('/getProducts', productController.getProducts);
    router.get('/getProductById', productController.getProductById);
    router.get('/getproductsbyname', productController.getProductsByName);
    router.get('/getproductssortedbyprice', productController.getProductsSortedByPrice);
    router.get('/getproductsfilterdbyprice', productController.getProductsFilteredByPrice);
    return app.use('/product', router);
}

module.exports = initProductRoute;