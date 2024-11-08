import { connectDB } from "../configs/connectDB";
import sql from "mssql";

const getLoaiSuDung = async (req, res) => {
    try {
        const pool = await connectDB();
        const result = await pool.request().query('SELECT MaLoai, TenLoai FROM LoaiSuDung');
        return res.status(200).json(result.recordset);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Lỗi khi tải danh sách LoaiSuDung" });
    }
};

const getNhomThuoc = async (req, res) => {
    try {
        const pool = await connectDB();
        const result = await pool.request().query('SELECT MaNhomThuoc, TenNhom FROM NhomThuoc');
        return res.status(200).json(result.recordset);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Lỗi khi tải danh sách NhomThuoc" });
    }
};

const getThanhPhan = async (req, res) => {
    try {
        const pool = await connectDB();
        const result = await pool.request().query('SELECT MaTP, TenThanhPhan FROM ThanhPhan');
        return res.status(200).json(result.recordset);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Lỗi khi tải danh sách ThanhPhan" });
    }
};

const addThanhPhan = async (req, res) => {
    const { tenThanhPhan } = req.body;
    try {
        if (!tenThanhPhan) {
            return res.status(400).json({ message: 'Tên thành phần là bắt buộc' });
        }

        const pool = await connectDB();
        await pool.request()
            .input('tenThanhPhan', sql.NVarChar, tenThanhPhan)
            .query('INSERT INTO ThanhPhan (TenThanhPhan) VALUES (@tenThanhPhan)');
        
        return res.status(201).json({ message: 'Thêm thành phần thành công' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Lỗi khi thêm thành phần' });
    }
};

const getThuoc = async (req, res) => {
    try {
        const pool = await connectDB();
        const result = await pool.request().query('SELECT * FROM Thuoc');
        return res.status(200).json(result.recordset);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Lỗi khi tải danh sách Thuoc" });
    }
};

const addDanhMucAnh = async (req, res) => {
    const { maThuoc, tenHinhAnh } = req.body;
    try {
        if (!maThuoc || !tenHinhAnh) {
            return res.status(400).json({ message: 'Mã thuốc và tên hình ảnh là bắt buộc' });
        }

        const pool = await connectDB();
        await pool.request()
            .input('maThuoc', sql.VarChar, maThuoc)
            .input('tenHinhAnh', sql.NVarChar, tenHinhAnh)
            .query('INSERT INTO DanhMucHinhAnh (MaThuoc, TenHinhAnh) VALUES (@maThuoc, @tenHinhAnh)');
        
        return res.status(201).json({ message: 'Thêm hình ảnh thành công' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Lỗi khi thêm hình ảnh' });
    }
};

const addThuocThanhPhan = async (req, res) => {
    const { maThuoc, maTP } = req.body;
    try {
        if (!maThuoc || !maTP) {
            return res.status(400).json({ message: 'Mã thuốc và mã thành phần là bắt buộc' });
        }

        const pool = await connectDB();
        await pool.request()
            .input('maThuoc', sql.VarChar, maThuoc)
            .input('maTP', sql.Int, maTP)
            .query('INSERT INTO ThuocThanhPhan (MaThuoc, MaTP) VALUES (@maThuoc, @maTP)');
        
        return res.status(201).json({ message: 'Thêm thành phần cho thuốc thành công' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Lỗi khi thêm thành phần cho thuốc' });
    }
};


const addThuoc = async (req, res) => {
    const { maThuoc, tenThuoc, giaBan, soLuong, dangBaoChe, qCDongGoi, congDung, anhDaiDien, trangThai, maNhomThuoc, maLoai } = req.body;
    try {
        const pool = await connectDB();
        await pool.request()
            .input('maThuoc', sql.VarChar, maThuoc)
            .input('tenThuoc', sql.NVarChar, tenThuoc)
            .input('giaBan', sql.Float, giaBan)
            .input('soLuong', sql.Int, soLuong)
            .input('dangBaoChe', sql.NVarChar, dangBaoChe)
            .input('qCDongGoi', sql.NVarChar, qCDongGoi)
            .input('congDung', sql.NVarChar, congDung)
            .input('anhDaiDien', sql.NVarChar, anhDaiDien)
            .input('trangThai', sql.NVarChar, trangThai)
            .input('maNhomThuoc', sql.VarChar, maNhomThuoc)
            .input('maLoai', sql.VarChar, maLoai)
            .query('INSERT INTO Thuoc (MaThuoc, TenThuoc, GiaBan, SoLuong, DangBaoChe, QCDongGoi, CongDung, AnhDaiDien, TrangThai, MaNhomThuoc, MaLoai) VALUES (@maThuoc, @tenThuoc, @giaBan, @soLuong, @dangBaoChe, @qCDongGoi, @congDung, @anhDaiDien, @trangThai, @maNhomThuoc, @maLoai)');
        
        return res.status(201).json({ message: 'Thêm thuốc thành công' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Lỗi khi thêm thuốc' });
    }
};

const updateThuoc = async (req, res) => {
    const { maThuoc, tenThuoc, giaBan, soLuong, dangBaoChe, qCDongGoi, congDung, anhDaiDien, trangThai, maNhomThuoc, maLoai } = req.body;
    try {
        const pool = await connectDB();
        await pool.request()
            .input('maThuoc', sql.VarChar, maThuoc)
            .input('tenThuoc', sql.NVarChar, tenThuoc)
            .input('giaBan', sql.Float, giaBan)
            .input('soLuong', sql.Int, soLuong)
            .input('dangBaoChe', sql.NVarChar, dangBaoChe)
            .input('qCDongGoi', sql.NVarChar, qCDongGoi)
            .input('congDung', sql.NVarChar, congDung)
            .input('anhDaiDien', sql.NVarChar, anhDaiDien)
            .input('trangThai', sql.NVarChar, trangThai)
            .input('maNhomThuoc', sql.VarChar, maNhomThuoc)
            .input('maLoai', sql.VarChar, maLoai)
            .query('UPDATE Thuoc SET TenThuoc = @tenThuoc, GiaBan = @giaBan, SoLuong = @soLuong, DangBaoChe = @dangBaoChe, QCDongGoi = @qCDongGoi, CongDung = @congDung, AnhDaiDien = @anhDaiDien, TrangThai = @trangThai, MaNhomThuoc = @maNhomThuoc, MaLoai = @maLoai WHERE MaThuoc = @maThuoc');
        
        return res.status(200).json({ message: 'Cập nhật thuốc thành công' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Lỗi khi cập nhật thuốc' });
    }
};

export default {
    getLoaiSuDung,
    getNhomThuoc,
    getThanhPhan,
    addThanhPhan,
    getThuoc,
    addThuoc,
    updateThuoc,
    addThuocThanhPhan,
    addDanhMucAnh
};
