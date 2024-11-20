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
            const magh = await pool.request()
                .input('uid', sql.VarChar, uid)
                .query('INSERT INTO GioHang(TrangThai, TenTaiKhoan) VALUES (0, @uid); SELECT SCOPE_IDENTITY() AS MaGioHang');
            const maGioHang = magh.recordset[0].MaGioHang;
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

        // Kiểm tra số lượng tồn kho
        const availableQuantity = product.recordset[0].SoLuong;
        
        // Kiểm tra số lượng trong giỏ hàng hiện tại
        const cart = await pool.request()
            .input('uid', sql.VarChar, uid)
            .query('SELECT * FROM GioHang WHERE TenTaiKhoan = @uid AND TrangThai = 0');
            
        let currentQuantityInCart = 0;
        if (cart.recordset.length > 0) {
            const maGioHang = cart.recordset[0].MaGioHang;
            const checkProduct = await pool.request()
                .input('uid', maGioHang)
                .input('productId', sql.VarChar, productId)
                .query('SELECT SoLuong FROM ChiTietGioHang WHERE MaGioHang = @uid AND MaThuoc = @productId');
            
            if (checkProduct.recordset.length > 0) {
                currentQuantityInCart = checkProduct.recordset[0].SoLuong;
            }
        }

        // Kiểm tra tổng số lượng
        if (currentQuantityInCart + quantity > availableQuantity) {
            return res.json({
                message: 'Tổng số lượng thuốc vượt quá số lượng trong kho',
                success: false,
                availableQuantity: availableQuantity,
                currentInCart: currentQuantityInCart
            });
        }

        const totalPrice = product.recordset[0].GiaBan * quantity;
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
    const name = req.body.name;
    const phone = req.body.phone;
    const address = req.body.address;
    const email = req.body.email;
    const total = req.body.total;
    const products = req.body.products;
    let cartid = req.body.cartid;
    try {
        const pool = await connectDB();
        
        if (!(cartid === undefined || cartid === null || cartid === '')) {
            console.log('cartid', cartid);
            // Người dùng đã đăng nhập, lấy thông tin giỏ hàng từ database
            const cartItems = await pool.request()
                .input('cartid', sql.Int, cartid)
                .query(`
                    SELECT ct.MaThuoc, ct.SoLuong, t.SoLuong as TonKho 
                    FROM ChiTietGioHang ct
                    JOIN Thuoc t ON ct.MaThuoc = t.MaThuoc
                    WHERE ct.MaGioHang = @cartid
                `);

            // Kiểm tra số lượng tồn kho
            for (const item of cartItems.recordset) {
                if (item.TonKho < item.SoLuong) {
                    return res.status(400).json({
                        message: `Sản phẩm ${item.MaThuoc} không đủ số lượng trong kho`,
                        success: false,
                        availableQuantity: item.TonKho,
                        requestedQuantity: item.SoLuong
                    });
                }
            }

            // Cập nhật trạng thái giỏ hàng và số lượng tồn kho
            await pool.request()
                .input('cartid', sql.Int, cartid)
                .query('UPDATE GioHang SET TrangThai = 1 WHERE MaGioHang = @cartid');

            // Cập nhật số lượng tồn kho
            for (const item of cartItems.recordset) {
                await pool.request()
                    .input('productid', sql.VarChar, item.MaThuoc)
                    .input('quantity', sql.Int, item.SoLuong)
                    .query('UPDATE Thuoc SET SoLuong = SoLuong - @quantity WHERE MaThuoc = @productid');
            }
        } else {
            // Người dùng chưa đăng nhập, kiểm tra số lượng từ mảng products
            for (let i = 0; i < products.length; i++) {
                const product = await pool.request()
                    .input('productId', sql.VarChar, products[i].MaThuoc)
                    .query('SELECT SoLuong FROM Thuoc WHERE MaThuoc = @productId');
                
                if (product.recordset[0].SoLuong < products[i].SoLuong) {
                    return res.status(400).json({
                        message: `Sản phẩm ${products[i].MaThuoc} không đủ số lượng trong kho`,
                        success: false,
                        availableQuantity: product.recordset[0].SoLuong,
                        requestedQuantity: products[i].SoLuong
                    });
                }
            }

            // Tạo giỏ hàng mới
            const newCart = await pool.request()
                .query('INSERT INTO GioHang(TrangThai) VALUES (1); SELECT SCOPE_IDENTITY() AS MaGioHang');
            cartid = newCart.recordset[0].MaGioHang;

            // Thêm chi tiết giỏ hàng và cập nhật số lượng tồn kho
            for (let i = 0; i < products.length; i++) {
                await pool.request()
                    .input('cartid', sql.Int, cartid)
                    .input('productid', sql.VarChar, products[i].MaThuoc)
                    .input('quantity', sql.Int, products[i].SoLuong)
                    .input('total', sql.Float, products[i].ThanhTien)
                    .query('INSERT INTO CHITIETGIOHANG(MaGioHang, MaThuoc, SoLuong, ThanhTien) VALUES (@cartid, @productid, @quantity, @total)');
                
                await pool.request()
                    .input('productid', sql.VarChar, products[i].MaThuoc)
                    .input('quantity', sql.Int, products[i].SoLuong)
                    .query('UPDATE Thuoc SET SoLuong = SoLuong - @quantity WHERE MaThuoc = @productid');
            }
        }

        // Tạo hóa đơn
        const result = await pool.request()
            .input('name', sql.NVarChar, name)
            .input('phone', sql.NVarChar, phone)
            .input('address', sql.NVarChar, address)
            .input('email', sql.NVarChar, email)
            .input('total', sql.Float, total)
            .input('cartid', sql.Int, cartid)
            .input('status', sql.NVarChar, 'Đang xử lý')
            .query('INSERT INTO HoaDon(DienThoai, DiaChi, TrangThaiHD, NgayLap, TongTien, MaGioHang) VALUES (@phone, @address, @status, GETDATE(), @total, @cartid); SELECT SCOPE_IDENTITY() AS MaDonHang');

        return res.status(200).json({ 
            message: 'Checkout successfully', 
            success: true, 
            mahd: result.recordset[0].MaDonHang 
        });
    } catch(err) {
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