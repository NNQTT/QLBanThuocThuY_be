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
        const thuoc = await pool.request()
            .input('tenThanhPhan', sql.NVarChar, tenThanhPhan)
            .query('INSERT INTO ThanhPhan (TenThanhPhan) VALUES (@tenThanhPhan); SELECT * FROM ThanhPhan WHERE MATP = SCOPE_IDENTITY()');
        console.log(thuoc)

        return res.status(201).json({ message: 'Thêm thành phần thành công' , thuoc: thuoc.recordset[0] });

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
        const danhmuc = await pool.request()
            .input('maThuoc', sql.VarChar, maThuoc)
            .input('tenHinhAnh', sql.NVarChar, tenHinhAnh)
            .query('INSERT INTO DanhMucHinhAnh (MaThuoc, TenHinhAnh) VALUES (@maThuoc, @tenHinhAnh)');
        return res.status(201).json({ message: 'Thêm hình ảnh thành công' , danhmuc: danhmuc.recordset});
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
    const { maThuoc, tenThuoc, giaBan, soLuong, dangBaoChe, qcDongGoi, congDung, anhDaiDien, trangThai, maNhomThuoc, maLoai } = req.body;
    console.log(req.body)
    try {
        const pool = await connectDB();
        await pool.request()
            .input('maThuoc', sql.VarChar, maThuoc)
            .input('tenThuoc', sql.NVarChar, tenThuoc)
            .input('giaBan', sql.Float, giaBan)
            .input('soLuong', sql.Int, soLuong)
            .input('dangBaoChe', sql.NVarChar, dangBaoChe)
            .input('qcDongGoi', sql.NVarChar, qcDongGoi)
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
    try {
        const { maThuoc } = req.params;
        const { 
            TenThuoc, 
            GiaBan, 
            SoLuong, 
            DangBaoChe, 
            QCDongGoi,
            CongDung,
            AnhDaiDien,
            TrangThai,
            MaNhomThuoc,
            MaLoai,
            TenTaiKhoan
        } = req.body;

        const pool = await connectDB();
        
        // Bắt đầu transaction
        const transaction = new sql.Transaction(pool);
        
        try {
            await transaction.begin();

            // 1. Cập nhật thông tin thuốc
            await transaction.request()
                .input('maThuoc', sql.VarChar, maThuoc)
                .input('tenThuoc', sql.NVarChar, TenThuoc)
                .input('giaBan', sql.Float, GiaBan)
                .input('soLuong', sql.Int, SoLuong)
                .input('dangBaoChe', sql.NVarChar, DangBaoChe)
                .input('qcDongGoi', sql.NVarChar, QCDongGoi)
                .input('congDung', sql.NVarChar, CongDung)
                .input('anhDaiDien', sql.NVarChar, AnhDaiDien)
                .input('trangThai', sql.NVarChar, TrangThai)
                .input('maNhomThuoc', sql.VarChar, MaNhomThuoc)
                .input('maLoai', sql.VarChar, MaLoai)
                .query(`
                    UPDATE Thuoc 
                    SET 
                        TenThuoc = @tenThuoc,
                        GiaBan = @giaBan,
                        SoLuong = @soLuong,
                        DangBaoChe = @dangBaoChe,
                        QCDongGoi = @qcDongGoi,
                        CongDung = @congDung,
                        AnhDaiDien = @anhDaiDien,
                        TrangThai = @trangThai,
                        MaNhomThuoc = @maNhomThuoc,
                        MaLoai = @maLoai
                    WHERE MaThuoc = @maThuoc
                `);

            // 2. Thêm vào bảng LichSuThuoc
            await transaction.request()
                .input('maThuoc', sql.VarChar, maThuoc)
                .input('tenTaiKhoan', sql.NVarChar, TenTaiKhoan)
                .input('ngayCapNhat', sql.DateTime, new Date())
                .query(`
                    INSERT INTO LichSuThuoc (NgayCapNhat, MaThuoc, TenTaiKhoan)
                    VALUES (@ngayCapNhat, @maThuoc, @tenTaiKhoan)
                `);

            await transaction.commit();
            
            return res.status(200).json({ 
                message: 'Cập nhật thuốc thành công',
                maThuoc: maThuoc
            });

        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    } catch (error) {
        console.error('Lỗi cập nhật:', error);
        return res.status(500).json({ 
            message: 'Lỗi khi cập nhật thuốc',
            error: error.message 
        });
    }
};


const updateDanhMucAnh = async (req, res) => {
    const { maDanhMucAnh, maThuoc, tenHinhAnh } = req.body;
    try {
        if (!maDanhMucAnh || !maThuoc || !tenHinhAnh) {
            return res.status(400).json({ message: 'Mã danh mục ảnh, mã thuốc và tên hình ảnh là bắt buộc' });
        }

        const pool = await connectDB();
        const result = await pool.request()
            .input('maDanhMucAnh', sql.Int, maDanhMucAnh)
            .input('maThuoc', sql.VarChar, maThuoc)
            .input('tenHinhAnh', sql.NVarChar, tenHinhAnh)
            .query(`
                UPDATE DanhMucHinhAnh
                SET MaThuoc = @maThuoc, TenHinhAnh = @tenHinhAnh
                WHERE MaDanhMucAnh = @maDanhMucAnh
            `);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: 'Không tìm thấy danh mục ảnh để cập nhật' });
        }

        return res.status(200).json({ message: 'Cập nhật danh mục ảnh thành công' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Lỗi khi cập nhật danh mục ảnh' });
    }
};


const updateThuocThanhPhan = async (req, res) => {
    const { maThuoc, thanhPhan } = req.body;
    try {
        if (!maThuoc || !thanhPhan) {
            return res.status(400).json({ message: 'Mã thuốc và thành phần là bắt buộc' });
        }

        const pool = await connectDB();

        // Xóa tất cả thành phần cũ của thuốc
        await pool.request()
            .input('maThuoc', sql.VarChar, maThuoc)
            .query('DELETE FROM ThuocThanhPhan WHERE MaThuoc = @maThuoc');

        // Thêm lại các thành phần mới
        for (const tp of thanhPhan) {
            await pool.request()
                .input('maThuoc', sql.VarChar, maThuoc)
                .input('maTP', sql.Int, tp.maTP)
                .query(`
                    INSERT INTO ThuocThanhPhan (MaThuoc, MaTP) 
                    VALUES (@maThuoc, @maTP)
                `);
        }

        return res.status(200).json({ 
            message: 'Cập nhật thành phần thuốc thành công',
            maThuoc: maThuoc,
            thanhPhan: thanhPhan
        });

    } catch (error) {
        console.error('Lỗi cập nhật thành phần thuốc:', error);
        return res.status(500).json({ 
            message: 'Lỗi khi cập nhật thành phần thuốc',
            error: error.message 
        });
    }
};

const getThuocById = async (req, res) => {
    const { maThuoc } = req.params;
    try {
        const pool = await connectDB();
        const result = await pool.request()
            .input('maThuoc', sql.VarChar, maThuoc)
            .query(`
                SELECT DISTINCT
                    t.MaThuoc,
                    t.TenThuoc,
                    t.GiaBan,
                    t.SoLuong,
                    t.DangBaoChe,
                    t.QCDongGoi,
                    t.CongDung,
                    t.AnhDaiDien,
                    t.TrangThai,
                    t.MaNhomThuoc,
                    t.MaLoai,
                    ls.TenLoai,
                    nt.TenNhom,
                    tp.MaTP,
                    tp.TenThanhPhan,
                    dma.TenHinhAnh
                FROM Thuoc t
                LEFT JOIN LoaiSuDung ls ON t.MaLoai = ls.MaLoai
                LEFT JOIN NhomThuoc nt ON t.MaNhomThuoc = nt.MaNhomThuoc
                LEFT JOIN ThuocThanhPhan ttp ON t.MaThuoc = ttp.MaThuoc
                LEFT JOIN ThanhPhan tp ON ttp.MaTP = tp.MaTP
                LEFT JOIN DanhMucHinhAnh dma ON t.MaThuoc = dma.MaThuoc
                WHERE t.MaThuoc = @maThuoc
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ 
                message: 'Không tìm thấy thuốc',
                maThuocNhan: maThuoc 
            });
        }

        // Xử lý dữ liệu trả về để tránh duplicate
        const thuoc = {
            MaThuoc: result.recordset[0].MaThuoc,
            TenThuoc: result.recordset[0].TenThuoc,
            GiaBan: result.recordset[0].GiaBan,
            SoLuong: result.recordset[0].SoLuong,
            DangBaoChe: result.recordset[0].DangBaoChe,
            QCDongGoi: result.recordset[0].QCDongGoi,
            CongDung: result.recordset[0].CongDung,
            AnhDaiDien: result.recordset[0].AnhDaiDien,
            TrangThai: result.recordset[0].TrangThai,
            MaNhomThuoc: result.recordset[0].MaNhomThuoc,
            MaLoai: result.recordset[0].MaLoai,
            TenLoai: result.recordset[0].TenLoai,
            TenNhom: result.recordset[0].TenNhom,
            
            // Lọc và loại bỏ duplicate thành phần
            thanhPhan: [...new Map(result.recordset
                .filter(record => record.MaTP)
                .map(record => [
                    record.MaTP,
                    {
                        maTP: record.MaTP,
                        tenThanhPhan: record.TenThanhPhan
                    }
                ])).values()],

            // Lọc và loại bỏ duplicate hình ảnh
            danhMucHinhAnh: [...new Map(result.recordset
                .filter(record => record.TenHinhAnh)
                .map(record => [
                    record.TenHinhAnh,
                    { tenHinhAnh: record.TenHinhAnh }
                ])).values()]
        };

        console.log("Dữ liệu trả về:", thuoc);
        return res.status(200).json(thuoc);
        
    } catch (error) {
        console.error("Lỗi chi tiết:", error);
        return res.status(500).json({ 
            message: 'Lỗi khi lấy thông tin thuốc',
            error: error.message 
        });
    }
};

const deleteDanhMucAnh = async (req, res) => {
    const { maThuoc, tenHinhAnh } = req.params;
    try {
        if (!maThuoc || !tenHinhAnh) {
            return res.status(400).json({ message: 'Mã thuốc và tên hình ảnh là bắt buộc' });
        }

        const pool = await connectDB();
        const result = await pool.request()
            .input('maThuoc', sql.VarChar, maThuoc)
            .input('tenHinhAnh', sql.NVarChar, tenHinhAnh)
            .query(`
                DELETE FROM DanhMucHinhAnh 
                WHERE MaThuoc = @maThuoc AND TenHinhAnh = @tenHinhAnh
            `);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: 'Không tìm thấy hình ảnh để xóa' });
        }

        return res.status(200).json({ message: 'Xóa hình ảnh thành công' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Lỗi khi xóa hình ảnh' });
    }
};

const getLichSuThuoc = async (req, res) => {
    try {
        const pool = await connectDB();
        const result = await pool.request().query(`
            SELECT 
                lst.MaThemSuaThuoc, 
                lst.NgayCapNhat, 
                lst.MaThuoc,
                lst.TenTaiKhoan,
                t.TenThuoc,
                qt.TenTaiKhoan as NguoiCapNhat
            FROM LichSuThuoc lst
            JOIN Thuoc t ON lst.MaThuoc = t.MaThuoc
            JOIN QuanTri qt ON lst.TenTaiKhoan = qt.TenTaiKhoan
            ORDER BY lst.NgayCapNhat DESC
        `);
        return res.status(200).json(result.recordset);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Lỗi khi tải lịch sử thuốc" });
    }
};

const getLichSuThuocById = async (req, res) => {
    const { maThuoc } = req.params;
    try {
        const pool = await connectDB();
        const result = await pool.request()
            .input('maThuoc', sql.VarChar, maThuoc)
            .query(`
                SELECT 
                    lst.MaThemSuaThuoc, 
                    lst.NgayCapNhat, 
                    lst.MaThuoc,
                    lst.TenTaiKhoan,
                    t.TenThuoc,
                    qt.TenTaiKhoan as NguoiCapNhat
                FROM LichSuThuoc lst
                JOIN Thuoc t ON lst.MaThuoc = t.MaThuoc
                JOIN QuanTri qt ON lst.TenTaiKhoan = qt.TenTaiKhoan
                WHERE lst.MaThuoc = @maThuoc
                ORDER BY lst.NgayCapNhat DESC
            `);
        return res.status(200).json(result.recordset);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Lỗi khi tải lịch sử thuốc" });
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
    addDanhMucAnh,
    updateDanhMucAnh,
    updateThuocThanhPhan,
    getThuocById,
    deleteDanhMucAnh,
    getLichSuThuoc,
    getLichSuThuocById
};
