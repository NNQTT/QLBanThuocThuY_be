import express, { request } from "express";
import productController from "../controller/productController";

const router = express.Router();

const initProductRoute = (app) => {
    router.get('/getproducts', productController.getProducts);
    router.get('/getproductbyid/:id', productController.getProductById);
    router.get('/getproductsbyname', productController.getProductsByName);
    router.get('/getproductssortedbyprice', productController.getProductsSortedByPrice);
    router.get('/getproductsfilterdbyprice', productController.getProductsFilteredByPrice);
    router.get('/getproductrelated', productController.getProductRelated);
    router.get('/getproductbylocalstorage', productController.getProductByLocalStorage);
    router.get('/getalbumproduct', productController.getAlbumProducts);

    return app.use('/product', router);
}

module.exports = initProductRoute;