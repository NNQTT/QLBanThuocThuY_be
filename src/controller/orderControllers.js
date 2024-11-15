import {connectDB} from "../configs/connectDB";

const getOrders = async(req, res) =>{
    try{
        const pool = await connectDB();

        const result = await pool.request().query('SELECT * FROM HoaDon');
        return res.status(200).send(result.recordset);
    } catch(err){
        console.log(err);
        return res.status(500).send('Internal Server Error');
    }
};

const getOrderDetails = async (req, res) => {
    const maDonHang = req.params.maDonHang;
    try {
        const pool = await connectDB();
        
        const result = await pool.request()
            .input('MaDonHang', maDonHang)
            .query(`
                SELECT 
                    HoaDon.MaDonHang, HoaDon.DienThoai, HoaDon.DiaChi, HoaDon.TrangThaiHD, HoaDon.NgayLap, HoaDon.TongTien,
                    ChiTietGioHang.MaThuoc, ChiTietGioHang.SoLuong, ChiTietGioHang.ThanhTien,
                    Thuoc.TenThuoc  -- Thêm cột TenThuoc để hiển thị tên thuốc
                FROM HoaDon
                LEFT JOIN ChiTietGioHang ON HoaDon.MaGioHang = ChiTietGioHang.MaGioHang
                LEFT JOIN Thuoc ON ChiTietGioHang.MaThuoc = Thuoc.MaThuoc  -- JOIN với bảng Thuoc để lấy tên thuốc
                WHERE HoaDon.MaDonHang = @MaDonHang
            `);

        if (result.recordset.length === 0) {
            return res.status(404).send('Order not found');
        }

        return res.status(200).send(result.recordset);
    } catch (err) {
        console.log(err);
        return res.status(500).send('Internal Server Error');
    }
};

const updateOrder = async (req, res) => {
    const maDonHang = req.params.maDonHang;
    const { DienThoai, DiaChi, TrangThaiHD } = req.body;

    try {
        const pool = await connectDB();
        
        const result = await pool.request()
            .input('MaDonHang', maDonHang)
            .input('DienThoai', DienThoai)
            .input('DiaChi', DiaChi)
            .input('TrangThaiHD', TrangThaiHD)
            .query(`
                UPDATE HoaDon
                SET DienThoai = @DienThoai,
                    DiaChi = @DiaChi,
                    TrangThaiHD = @TrangThaiHD
                WHERE MaDonHang = @MaDonHang
            `);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).send('Order not found');
        }

        return res.status(200).send('Order updated successfully');
    } catch (err) {
        console.log(err);
        return res.status(500).send('Internal Server Error');
    }
};


module.exports = {
    getOrders,
    getOrderDetails,
    updateOrder
}