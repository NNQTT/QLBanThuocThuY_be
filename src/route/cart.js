import express, { request } from "express";
import cartController from "../controller/cartController";

const router = express.Router();

const initCartRoute = (app) => {
    router.get('/:uid', cartController.getCart);
    router.post('/:uid/:pid/', cartController.addProductToCart);
    router.delete('/:uid/:pid', cartController.removeProductFromCart);
    router.patch('/:uid/:pid', cartController.updateProductInCart);
    return app.use('/cart', router);
}

module.exports = initCartRoute;