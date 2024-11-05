import sql from "mssql";
import { connectDB } from '../configs/connectDB';

const getCart = async (req, res) => {
    const uid = req.params.uid;
    const pool = await connectDB();
    try {
        const result = await pool.request()
            .input('uid', sql.VarChar, uid)
            .query('SELECT * FROM GioHang WHERE TenTaiKhoan = @uid AND TrangThai = 0');
        if (result.recordset.length > 0) {
            const maGioHang = result.recordset[0].MaGioHang;
            const cart = await pool.request()
                .input('uid', maGioHang)
                .query('SELECT c.*, t.TenThuoc, t.DangBaoChe, t.QCDongGoi, t.GiaBan, t.AnhDaiDien FROM ChiTietGioHang c join Thuoc t ON c.MaThuoc = t.MaThuoc WHERE MaGioHang = @uid');
            return res.status(200).send(cart.recordset);
        } else {
            console.log('cart not found');
            //create new cart
            await pool.request()
                .input('uid', sql.VarChar, uid)
                .query('INSERT INTO GioHang(TrangThai, TenTaiKhoan) VALUES (0, @uid)');
            const cart = await pool.request()
                .input('uid', sql.VarChar, uid)
                .query('SELECT * FROM ChiTietGioHang WHERE MaGioHang = @uid');
            return res.status(200).send(cart.recordset);
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: 'Internal Server Error',
            success: false
        });
    }
}

const addProductToCart = async (req, res) => {
    const uid = req.params.uid;
    const productId = req.params.pid;
    const quantity = req.body.quantity || 1;
    const pool = await connectDB();
    try {
        const product = await pool.request()
            .input('uid', sql.VarChar, productId)
            .query('SELECT * FROM Thuoc WHERE MaThuoc = @uid');
        if (product.recordset.length === 0) {
            return res.status(404).json({
                message: 'Product not found',
                success: false
            });
        }
        const totalPrice = product.recordset[0].GiaBan * quantity;
        const cart = await pool.request()
            .input('uid', sql.VarChar, uid)
            .query('SELECT * FROM GioHang WHERE TenTaiKhoan = @uid AND TrangThai = 0');
        if (cart.recordset.length > 0) {
            const maGioHang = cart.recordset[0].MaGioHang;
            const checkProduct = await pool.request()
                .input('uid', maGioHang)
                .input('productId', sql.VarChar, productId)
                .query('SELECT * FROM ChiTietGioHang WHERE MaGioHang = @uid AND MaThuoc = @productId');
            if (checkProduct.recordset.length > 0) {
                await pool.request()
                    .input('uid', maGioHang)
                    .input('productId', productId)
                    .input('quantity', quantity)
                    .input('totalPrice', totalPrice)
                    .query('UPDATE ChiTietGioHang SET SoLuong = SoLuong + @quantity, ThanhTien = ThanhTien + @totalPrice WHERE MaGioHang = @uid AND MaThuoc = @productId');
            } else {
                await pool.request()
                    .input('uid', maGioHang)
                    .input('productId', sql.VarChar, productId)
                    .input('quantity', quantity)
                    .input('totalPrice', totalPrice)
                    .query('INSERT INTO ChiTietGioHang (MaGioHang, MaThuoc, SoLuong, ThanhTien) VALUES (@uid, @productId, @quantity, @totalPrice)');
            }
        } else {
            const cart = await pool.request()
                .input('uid', sql.VarChar, uid)
                .query('INSERT INTO GioHang (TrangThai, TenTaiKhoan) VALUES (0, @uid)');
            const maGioHang = cart.recordset[0].MaGioHang;
            await pool.request()
                .input('uid', maGioHang)
                .input('productId', sql.VarChar, productId)
                .input('quantity', quantity)
                .input('totalPrice', totalPrice)
                .query('INSERT INTO ChiTietGioHang (MaGioHang, MaThuoc, SoLuong, ThanhTien) VALUES (@uid, @productId, @quantity, @totalPrice)');
        }
        return res.status(200).json({
            message: 'Add product to cart successfully',
            success: true
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: 'Internal Server Error',
            success: false
        });
    }
}

const removeProductFromCart = async (req, res) => {
    //delete method
    const uid = req.params.uid;
    const productId = req.params.pid;
    const pool = await connectDB();
    try {
        const cart = await pool.request()
            .input('uid', sql.VarChar, uid)
            .query('SELECT * FROM GioHang WHERE TenTaiKhoan = @uid AND TrangThai = 0');
        if (cart.recordset.length > 0) {
            const maGioHang = cart.recordset[0].MaGioHang;
            await pool.request()
                .input('uid', maGioHang)
                .input('productId', sql.VarChar, productId)
                .query('DELETE FROM ChiTietGioHang WHERE MaGioHang = @uid AND MaThuoc = @productId');
            return res.status(200).json({
                message: 'Remove product from cart successfully',
                success: true
            });
        } else {
            return res.status(404).json({
                message: 'Cart not found',
                success: false
            });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: 'Internal Server Error',
            success: false
        });
    }
}

const updateProductInCart = async (req, res) => {
    //patch method
    const uid = req.params.uid;
    const productId = req.params.pid;
    const quantity = req.body.quantity;
    const pool = await connectDB();
    try {
        const product = await pool.request()
            .input('uid', sql.VarChar, productId)
            .query('SELECT * FROM Thuoc WHERE MaThuoc = @uid');
        if (product.recordset.length === 0) {
            return res.status(404).json({
                message: 'Product not found',
                success: false
            });
        }
        const totalPrice = product.recordset[0].GiaBan * quantity;
        const cart = await pool.request()
            .input('uid', sql.VarChar, uid)
            .query('SELECT * FROM GioHang WHERE TenTaiKhoan = @uid AND TrangThai = 0');
        if (cart.recordset.length > 0) {
            const maGioHang = cart.recordset[0].MaGioHang;
            await pool.request()
                .input('uid', maGioHang)
                .input('productId', sql.VarChar, productId)
                .input('quantity', quantity)
                .input('totalPrice', totalPrice)
                .query('UPDATE ChiTietGioHang SET SoLuong = @quantity, ThanhTien = @totalPrice WHERE MaGioHang = @uid AND MaThuoc = @productId');
            return res.status(200).json({
                message: 'Update product in cart successfully',
                success: true
            });
        } else {
            return res.status(404).json({
                message: 'Cart not found',
                success: false
            });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: 'Internal Server Error',
            success: false
        });
    }
}

module.exports = {
    getCart,
    addProductToCart,
    removeProductFromCart,
    updateProductInCart
}