import express from "express";
import adminProductController from "../controller/adminProductController";

const adminRouter = express.Router();

const initAdminRoute = (app) => {
    adminRouter.get('/getloaisudung', adminProductController.getLoaiSuDung);
    adminRouter.get('/getnhomthuoc', adminProductController.getNhomThuoc);
    adminRouter.get('/getthanhphan', adminProductController.getThanhPhan);
    adminRouter.get('/getthuoc/:maThuoc', adminProductController.getThuocById);
    adminRouter.get('/getthuoc', adminProductController.getThuoc);
    adminRouter.post('/postthanhphan', adminProductController.addThanhPhan);
    adminRouter.post('/postthuoc', adminProductController.addThuoc);
    adminRouter.post('/postthuoctp', adminProductController.addThuocThanhPhan);
    adminRouter.post('/postdanhmucha', adminProductController.addDanhMucAnh);
    adminRouter.put('/updatethuoc', adminProductController.updateThuoc);
    adminRouter.put('/updatedanhmucha', adminProductController.updateDanhMucAnh);
    adminRouter.put('/updatethuoctp', adminProductController.updateThuocThanhPhan);
    
    return app.use('/admin', adminRouter);
};

export default initAdminRoute;
