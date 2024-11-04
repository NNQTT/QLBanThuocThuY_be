import express from "express";
import adminProductController from "../controller/adminProductController";

const adminRouter = express.Router();

const initAdminRoute = (app) => {
    adminRouter.get('/getloaisudung', adminProductController.getLoaiSuDung);
    adminRouter.get('/getnhomthuoc', adminProductController.getNhomThuoc);
    adminRouter.get('/getthanhphan', adminProductController.getThanhPhan);
    adminRouter.post('/postthanhphan', adminProductController.addThanhPhan);
    adminRouter.get('/getthuoc', adminProductController.getThuoc);
    adminRouter.post('/postthuoc', adminProductController.addThuoc);
    adminRouter.put('/updatethuoc', adminProductController.updateThuoc);

    return app.use('/admin', adminRouter);
};

export default initAdminRoute;
