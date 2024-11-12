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
                .query('INSERT INTO GioHang(TrangThai, TenTaiKhoan) VALUES (0, @uid); SELECT SCOPE_IDENTITY() AS MaGioHang');
            const maGioHang = result.recordset[0].MaGioHang;
            const cart = await pool.request()
                .input('uid', sql.Int, maGioHang)
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

const checkout = async (req, res) => {
    //post method
    const name = req.body.name;
    const phone = req.body.phone;
    const address = req.body.address;
    const email = req.body.email;
    const total = req.body.total;
    let cartid = req.body.cartid;

    try{
        const pool = await connectDB();
        if (cartid === undefined || cartid === null || cartid === '') {
            const newCart = await pool.request().query('INSERT INTO GioHang(TrangThai) VALUES (1); SELECT SCOPE_IDENTITY() AS MaGioHang');
            cartid = newCart.recordset[0].MaGioHang;
        }
        else await pool.request().input('cartid', sql.Int, cartid).query('UPDATE GioHang SET TrangThai = 1 WHERE MaGioHang = @cartid');
        const result = await pool.request()
            .input('name', sql.NVarChar, name)
            .input('phone', sql.NVarChar, phone)
            .input('address', sql.NVarChar, address)
            .input('email', sql.NVarChar, email)
            .input('total', sql.Float, total)
            .input('cartid', sql.Int, cartid)
            .input('status', sql.NVarChar, 'Chưa xác nhận')
            .query('INSERT INTO HoaDon(DienThoai, DiaChi, TrangThaiHD, NgayLap, TongTien, MaGioHang) VALUES (@phone, @address, @status, GETDATE(), @total, @cartid); SELECT SCOPE_IDENTITY() AS MaDonHang');
        console.log(result.recordset);
        return res.status(200).json({ message: 'Checkout successfully', success: true, mahd: result.recordset[0].MaDonHang });
    }
    catch(err){
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
    updateProductInCart,
    checkout
}