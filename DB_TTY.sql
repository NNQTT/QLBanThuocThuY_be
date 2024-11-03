use master 
go
alter database DB_TTY set single_user with rollback immediate

drop database DB_TTY
go

CREATE DATABASE DB_TTY
GO
USE DB_TTY
GO

CREATE TABLE NhomThuoc (
    MaNhomThuoc VARCHAR(5) NOT NULL,
    TenNhom NVARCHAR(255),
	CONSTRAINT PK_NhomThuoc PRIMARY KEY (MaNhomThuoc),
);

CREATE TABLE LoaiSuDung (
    MaLoai VARCHAR(5) NOT NULL,
	TenLoai NVARCHAR(255),
	CONSTRAINT PK_LoaiSuDung PRIMARY KEY (MaLoai),
);

CREATE TABLE Thuoc (
    MaThuoc VARCHAR(20) NOT NULL,
    TenThuoc NVARCHAR(255),
    GiaBan FLOAT,
    DangBaoChe NVARCHAR(255),
    QCDongGoi NVARCHAR(255),
    CongDung NVARCHAR(255),
    AnhDaiDien NVARCHAR(255),
    TrangThai NVARCHAR(50),
    MaNhomThuoc VARCHAR(5),
	MaLoai VARCHAR(5),
	CONSTRAINT PK_Thuoc PRIMARY KEY (MaThuoc),
    CONSTRAINT FK_Thuoc_NhomThuoc FOREIGN KEY (MaNhomThuoc) REFERENCES NhomThuoc(MaNhomThuoc),
	CONSTRAINT FK_Thuoc_LoaiSuDung FOREIGN KEY (MaLoai) REFERENCES LoaiSuDung(MaLoai)
);

CREATE TABLE DanhMucHinhAnh (
    MaThuoc VARCHAR(20),
	TenHinhAnh VARCHAR(255),
	CONSTRAINT PK_DanhMucHinhAnh PRIMARY KEY (MaThuoc, TenHinhAnh),
	CONSTRAINT FK_DanhMucHinhAnh_Thuoc FOREIGN KEY (MaThuoc) REFERENCES Thuoc(MaThuoc)
);

CREATE TABLE ThanhPhan (
    MaTP INT IDENTITY NOT NULL,
    TenThanhPhan NVARCHAR(255),
	CONSTRAINT PK_ThanhPhan PRIMARY KEY (MaTP)
);

CREATE TABLE ThuocThanhPhan (
    MaThuoc VARCHAR(20) NOT NULL,
    MaTP INT NOT NULL,
	CONSTRAINT Thuoc_ThanhPhan PRIMARY KEY (MaThuoc, MaTP),
    CONSTRAINT FK_ThuocTP_Thuoc FOREIGN KEY (MaThuoc) REFERENCES Thuoc(MaThuoc),
    CONSTRAINT FK_ThuocTP_ThanhPhan FOREIGN KEY (MaTP) REFERENCES ThanhPhan(MaTP)
);

CREATE TABLE KhachHang (
    TenTaiKhoan NVARCHAR(255) NOT NULL,
    MatKhau NVARCHAR(255),
    Email NVARCHAR(255),
	CONSTRAINT PK_KhachHang PRIMARY KEY (TenTaiKhoan),
);

CREATE TABLE GioHang (
    MaGioHang VARCHAR(10) NOT NULL,
    TrangThai NVARCHAR(50),
	TenTaiKhoan NVARCHAR(255),
    CONSTRAINT PK_GioHang PRIMARY KEY (MaGioHang),
    CONSTRAINT FK_GioHang_KhachHang FOREIGN KEY (TenTaiKhoan) REFERENCES KhachHang(TenTaiKhoan),
);

CREATE TABLE HoaDon (
    MaDonHang VARCHAR(10) NOT NULL,
    DienThoai NVARCHAR(50),
    DiaChi NVARCHAR(255),
    TrangThaiHD NVARCHAR(50),
	NgayLap DATE,
    TongTien FLOAT,
	MaGioHang VARCHAR(10),
	CONSTRAINT PK_HoaDon PRIMARY KEY (MaDonHang),
    CONSTRAINT FK_HoaDon_GioHang FOREIGN KEY (MaGioHang) REFERENCES GioHang(MaGioHang)
);

CREATE TABLE ChiTietGioHang (
    MaGioHang VARCHAR(10) NOT NULL,
	MaThuoc VARCHAR(20) NOT NULL,
    SoLuong INT,
    ThanhTien FLOAT,
	CONSTRAINT PK_ChiTietGioHang PRIMARY KEY (MaGioHang, MaThuoc),
    CONSTRAINT FK_ChiTietGioHang_GioHang FOREIGN KEY (MaGioHang) REFERENCES GioHang(MaGioHang),
	CONSTRAINT FK_ChiTietGioHang_Thuoc FOREIGN KEY (MaThuoc) REFERENCES Thuoc(MaThuoc)
);

CREATE TABLE QuanTri (
    TenTaiKhoan NVARCHAR(255) NOT NULL,
    MatKhau NVARCHAR(255),
    Email NVARCHAR(255),
	CONSTRAINT PK_QuanTri PRIMARY KEY (TenTaiKhoan),
);

CREATE TABLE LichSuThuoc (
    MaThemSuaThuoc INT IDENTITY NOT NULL,
    NgayCapNhat DATETIME,
	MaThuoc VARCHAR(20),
	TenTaiKhoan NVARCHAR(255),
	CONSTRAINT PK_LichSuThuoc PRIMARY KEY (MaThemSuaThuoc),
    CONSTRAINT FK_LichSuThuoc_Thuoc FOREIGN KEY (MaThuoc) REFERENCES Thuoc(MaThuoc),
	CONSTRAINT FK_LichSuThuoc_QuanTri FOREIGN KEY (TenTaiKhoan) REFERENCES QuanTri(TenTaiKhoan)
);

INSERT INTO NHOMTHUOC VALUES ('N1', N'Chế phẩm sinh học' );
INSERT INTO NHOMTHUOC VALUES ('N2', N'Dược phẩm' );
INSERT INTO NHOMTHUOC VALUES ('N3', N'Vaccine' );
INSERT INTO NHOMTHUOC VALUES ('N4', N'Hóa chất thú y' );
INSERT INTO NHOMTHUOC VALUES ('N5', N'Vi sinh vật' );

INSERT INTO LOAISUDUNG VALUES ('GC', N'Gia cầm' );
INSERT INTO LOAISUDUNG VALUES ('GS', N'Gia súc' );
INSERT INTO LOAISUDUNG VALUES ('TC', N'Thú cưng' );
INSERT INTO LOAISUDUNG VALUES ('TS', N'Thuỷ sản' );

INSERT INTO THUOC VALUES ('HCM-X4-25', N'Terramycin Egg Formula', 57500, N'Bột', N'100g', N'Nâng cao năng suất trứng, phòng các bệnh ở gia cầm.', N'profile_pic-HCM-X4-25-Terramycin_Egg_Formula.jpg', N'Còn hàng', 'N1', 'GC');
INSERT INTO THUOC VALUES ('HCM-X4-79', N'Anticoc', 40250, N'Bột', N'100g', N'Phòng và trị bệnh cầu trùng.', N'profile_pic-HCM-X4-79-Bio-Anticoc.jpg', N'Còn hàng', 'N2', 'GC');
INSERT INTO THUOC VALUES ('HCM-X2-16', N'Iron Dextran B12', 57500, N'Dung dịch', N'100ml', N'Phòng chống thiếu máu do thiếu sắt.', N'profile_pic-HCM-X2-16-Fe-Dextran_B12.jpg', N'Tạm hết hàng', 'N2', 'GS');
INSERT INTO THUOC VALUES ('HCM-X2-164', N'Tylosin 200', 63250, N'Dung dịch tiêm', N'100ml', N'Trị viêm phổi, viêm tử cung, bệnh lepto, viêm ruột', N'profile_pic-HCM-X2-164-Tylosin-200.jpg', N'Còn hàng', 'N2', 'GS');
INSERT INTO THUOC VALUES ('HCM-X2-198', N'Tiacotin', 23000, N'Dung dịch', N'100ml', N'Trị bệnh đường hô hấp, tiêu hóa.', N'profile_pic-HCM-X2-198-Tia-K.C.jpg', N'Còn hàng', 'N2', 'GS');
INSERT INTO THUOC VALUES ('GDA-10', N'NVDC-JXA1 Strain', 31050, N'Dung dịch tiêm', N'100ml', N'Phòng bệnh lợn tai xanh', N'profile_pic-GDA-10-NVDC-JXA1-Strain.jpg', N'Còn hàng', 'N3', 'GS');
INSERT INTO THUOC VALUES ('ETT-163', N'ECO RECICORT', 115000, N'Dung dịch', N'500ml', N'Trị viêm tai ngoài, viêm da tiết bã nhờn trên chó, mèo.', N'profile_pic-ETT-163-Dental_Creme_3.jpg', N'Còn hàng', 'N2', 'TC');
INSERT INTO THUOC VALUES ('UV-65', N'RODO-UV', 172500, N'Dung dịch', N'5 lít', N'Ức chế vi khuẩn gây bệnh trong ao nuôi', N'profile_pic-UV-65-RODO-UV.jpg', N'Tạm hết hàng', 'N5', 'TS');
INSERT INTO THUOC VALUES ('ETT-165', N'ECO SUPPRESTRAL', 115000, N'Dung dịch', N'500ml', N'Giảm co bóp, ổn định tử cung, an thai trong trường hợp đe dọa sẩy thai', N'profile_pic-ETT-165-Progesterone.jpg', N'Còn hàng', 'N1', 'TC');
INSERT INTO THUOC VALUES ('SAK-118', N'Sakan - Fipro', 69000, N'Dung dịch', N'20ml', N'Diệt ve, bọ rận, bọ chét và ghẻ trên chó mèo', N'profile_pic-SAK-118-Sakan-Fipr.jpg', N'Còn hàng', 'N4', 'TC');
INSERT INTO THUOC VALUES ('SAK-169', N'HZ-PETLOVE-2', 86250, N'Dung dịch', N'20ml', N'Làm mượt lông cho chó, mèo', N'profile_pic-SAK-169-Amitraz.jpg', N'Còn hàng', 'N4', 'TC');
INSERT INTO THUOC VALUES ('SAK-185', N'FLUZAZOL', 46000, N'Dung dịch', N'50ml', N'Trị nấm gây ra trên chó, mèo.', N'profile_pic-SAK-185-Funguikur.jpg', N'Tạm hết hàng', 'N2', 'TC');
INSERT INTO THUOC VALUES ('BD.TS5-4', N'MD Selen E.W.S', 345000, N'Viên nén', N'10kg', N'Giúp tăng sản lượng đẻ trứng ở cá. Cá ương đạt tỷ lệ cao hơn, giảm hao hụt', N'profile_pic-BD.TS5-4-Selenvit-E.jpg', N'Còn hàng', 'N1', 'TS');
INSERT INTO THUOC VALUES ('BD.TS5-5', N'MD Bio Calcium', 230000, N'Dung dịch', N'5 lít', N'Thúc đẩy quá trình lột vỏ ở tôm và giúp mau cứng vỏ sau khi lột.', N'profile_pic-BD.TS5-5-MD_Bio_Calcium.jpg', N'Còn hàng', 'N1', 'TS');
INSERT INTO THUOC VALUES ('BD.TS5-19', N'MD Protect', 230000, N'Dung dịch', N'5 lít', N'Diệt các loại vi khuẩn, nấm, vi sinh động vật trong nước ao nuôi', N'profile_pic-BD.TS5-19-MD_Protect.jpg', N'Còn hàng', 'N4', 'TS');
INSERT INTO THUOC VALUES ('BN.TS2-51', N'ECO-OMICD FISH', 115000, N'Dung dịch', N'500 ml', N'Sát trùng nguồn nước nuôi trồng thủy sản', N'profile_pic-BN.TS2-51-Iodin-200.jpg', N'Còn hàng', 'N4', 'TS');
INSERT INTO THUOC VALUES ('BN.TS2-15', N'ECO-DOXYFISH POWER 20%', 39100, N'Bột', N'500g', N'Trị bệnh đỏ thân trên tôm do vi khuẩn Vibrio alginolyticus', N'profile_pic-BN.TS2-15-ECO-Doxyfish_Power_20.png', N'Còn hàng', 'N2', 'TS');
INSERT INTO THUOC VALUES ('SAK-37', N'Flormax', 49450, N'Bột', N'100g', N'Trị nhiễm trùng đường tiêu hóa, hô hấp trên heo, trâu, bò, dê, cừu.', N'profile_pic-SAK-37-Flormax.jpg', N'Còn hàng', 'N2', 'GS');
INSERT INTO THUOC VALUES ('CME-3', N'Vắc xin PRRS nhược độc chủng JXA1-R', 65550, N'Dung dịch tiêm', N'50ml', N'Phòng hội chứng rối loạn hô hấp và sinh sản (PRRS) trên heo.', N'profile_pic-CME-3-Vắc_xin_PRRS_JXA1-R.jpg', N'Còn hàng', 'N3', 'GS');
INSERT INTO THUOC VALUES ('LBF-1', N'Foot And Mouth Disease Vaccine', 39100, N'Dung dịch tiêm', N'100ml', N'Phòng bệnh Lở mồm long móng trên lợn', N'profile_pic-LBF-1-Foot_And_Mouth_Disease_Vaccine.jpg', N'Còn hàng', 'N3', 'GS');
INSERT INTO THUOC VALUES ('ETT-94', N'ECO ERYCOL 10', 402500, N'Viên nén', N'10kg', N'Trị nhiễm trùng đường tiêu hóa, hô hấp trên vịt, gà, ngan, ngỗng', N'profile_pic-ETT-94-ECO_Erycol_10.jpg', N'Còn hàng', 'N2', 'GC');
INSERT INTO THUOC VALUES ('UV-2', N'ECOLUS', 230000, N'Bột', N'5kg', N'Phân hủy nhanh chất thải, phân tôm, xác tảo và thức ăn dư thừa.', N'profile_pic-UV-2-APA-PLANKTON_FISH.jpg', N'Còn hàng', 'N5', 'TS');
INSERT INTO THUOC VALUES ('ETT-50', N'Eco – Terra egg', 34500, N'Bột', N'10g', N'Tăng trọng nhanh, giảm tỷ lệ tiêu tốn thức ăn, rút ngắn thời gian nuôi', N'profile_pic-ETT-50-Eco-Terra_egg.jpg', N'Tạm hết hàng', 'N1', 'GC');


INSERT INTO DANHMUCHINHANH VALUES ('BD.TS5-19', 'pic-BD.TS5-19-MD_Protect_2.jpg' );
INSERT INTO DANHMUCHINHANH VALUES ('BD.TS5-4', 'pic-BD.TS5-4-Selenvit-E_2.jpg' );
INSERT INTO DANHMUCHINHANH VALUES ('BD.TS5-5', 'pic-BD.TS5-5-MD_Bio_Calcium.jpg' );
INSERT INTO DANHMUCHINHANH VALUES ('BN.TS2-15', 'pic-BN.TS2-15-ECO-Doxyfish_Power_20.png' );
INSERT INTO DANHMUCHINHANH VALUES ('BN.TS2-51', 'pic-BN.TS2-51-Iodin-200.jpg' );
INSERT INTO DANHMUCHINHANH VALUES ('BN.TS2-51', 'pic-BN.TS2-51-Iodin-200_1.jpg' );
INSERT INTO DANHMUCHINHANH VALUES ('BN.TS2-51', 'pic-BN.TS2-51-Iodin-200_2.jpg' );
INSERT INTO DANHMUCHINHANH VALUES ('CME-3', 'pic-CME-3-Vắc_xin_PRRS_JXA1-R_3.jpg' );
INSERT INTO DANHMUCHINHANH VALUES ('CME-3', 'pic-CME-3-Vắc_xin_PRRS_JXA1-R_2.jpg' );
INSERT INTO DANHMUCHINHANH VALUES ('ETT-163', 'pic-ETT-163-Dental_Creme_2.jpg' );
INSERT INTO DANHMUCHINHANH VALUES ('ETT-163', 'pic-ETT-163-Dental_Creme.jpg' );
INSERT INTO DANHMUCHINHANH VALUES ('ETT-165', 'pic-ETT-165-Progesterone.jpg' );
INSERT INTO DANHMUCHINHANH VALUES ('ETT-165', 'pic-ETT-165-Progesterone_2.jpg' );
INSERT INTO DANHMUCHINHANH VALUES ('ETT-50', 'pic-ETT-50-Eco-Terra_egg_2.jpg' );
INSERT INTO DANHMUCHINHANH VALUES ('ETT-94', 'pic-ETT-94-ECO_Erycol_10.jpg' );
INSERT INTO DANHMUCHINHANH VALUES ('GDA-10', 'pic-GDA-10-NVDC-JXA1-Strain.jpg' );
INSERT INTO DANHMUCHINHANH VALUES ('GDA-10', 'pic-GDA-10-NVDC-JXA1-Strain-2.jpg' );
INSERT INTO DANHMUCHINHANH VALUES ('HCM-X2-16', 'pic-Fe-HCM-X2-16-Dextran_B12_1.jpg' );
INSERT INTO DANHMUCHINHANH VALUES ('HCM-X2-16', 'pic-Fe-HCM-X2-16-Dextran_B12_2.jpg' );
INSERT INTO DANHMUCHINHANH VALUES ('HCM-X2-16', 'pic-Fe-HCM-X2-16-Dextran_B12_3.jpg' );
INSERT INTO DANHMUCHINHANH VALUES ('HCM-X2-164', 'pic-HCM-X2-164-Tylosin-200_2.jpg' );
INSERT INTO DANHMUCHINHANH VALUES ('HCM-X2-164', 'pic-HCM-X2-164-Tylosin-200_3.jpg' );
INSERT INTO DANHMUCHINHANH VALUES ('HCM-X2-198', 'pic-HCM-X2-198-Tia-K.C_2.jpg' );
INSERT INTO DANHMUCHINHANH VALUES ('HCM-X2-198', 'pic-HCM-X2-198-Tia-K.C_3.jpg' );
INSERT INTO DANHMUCHINHANH VALUES ('HCM-X4-25', 'pic-HCM-X4-25-Terramycin_Egg_Formula_2.jpg' );
INSERT INTO DANHMUCHINHANH VALUES ('HCM-X4-25', 'pic-HCM-X4-25-Terramycin_Egg_Formula_3.jpg' );
INSERT INTO DANHMUCHINHANH VALUES ('HCM-X4-79', 'pic-HCM-X4-79-Bio-Anticoc.jpg' );
INSERT INTO DANHMUCHINHANH VALUES ('LBF-1', 'pic-LBF-1-Foot_And_Mouth_Disease_Vaccine_2.jpg' );
INSERT INTO DANHMUCHINHANH VALUES ('SAK-118', 'pic-SAK-118-Sakan-Fipr_2.jpg' );
INSERT INTO DANHMUCHINHANH VALUES ('SAK-118', 'pic-SAK-118-Sakan-Fipr_3.jpg' );
INSERT INTO DANHMUCHINHANH VALUES ('SAK-169', 'pic-SAK-169-Amitraz.jpg' );
INSERT INTO DANHMUCHINHANH VALUES ('SAK-169', 'pic-SAK-169-Amitraz_2.jpg' );
INSERT INTO DANHMUCHINHANH VALUES ('SAK-185', 'pic-SAK-185-Funguikur_1.jpg' );
INSERT INTO DANHMUCHINHANH VALUES ('SAK-185', 'pic-SAK-185-Funguikur_3.jpg' );
INSERT INTO DANHMUCHINHANH VALUES ('SAK-37', 'pic-SAK-37-Flormax_2.jpg' );
INSERT INTO DANHMUCHINHANH VALUES ('UV-2', 'pic-UV-2-APA-PLANKTON_FISH.jpg' );
INSERT INTO DANHMUCHINHANH VALUES ('UV-65', 'pic-UV-65-RODO-UV_2.jpg' );
INSERT INTO DANHMUCHINHANH VALUES ('UV-65', 'pic-UV-65-RODO-UV_3.jpg' );


INSERT INTO QUANTRI VALUES (N'baongoc', N'123456789', N'bpbn@gmail.com' );
INSERT INTO QUANTRI VALUES (N'nhuquynh', N'21122003', N'npnq@gmail.com' );

INSERT INTO KHACHHANG VALUES (N'ductruong', N'cuductruong', N'cdt@gmail.com' );
INSERT INTO KHACHHANG VALUES (N'thanhtruc', N'vttt', N'vtttruc@gmail.com' );
INSERT INTO KHACHHANG VALUES (N'baongan', N'baongan', N'npbn@gmail.com' );


INSERT INTO GIOHANG VALUES ('GH0001', N'Đã thanh toán', N'ductruong' );
INSERT INTO GIOHANG VALUES ('GH0002', N'Đã thanh toán', N'thanhtruc' );
INSERT INTO GIOHANG VALUES ('GH0003', N'Đã thanh toán', N'baongan' );
INSERT INTO GIOHANG VALUES ('GH0004', N'Đã thanh toán', N'thanhtruc' );
INSERT INTO GIOHANG VALUES ('GH0005', N'Đã thanh toán', N'ductruong' );
INSERT INTO GIOHANG VALUES ('GH0006', N'Đã thanh toán', N'baongan' );
INSERT INTO GIOHANG VALUES ('GH0007', N'Đã thanh toán', N'ductruong' );
INSERT INTO GIOHANG VALUES ('GH0008', N'Đã thanh toán', N'baongan' );
INSERT INTO GIOHANG VALUES ('GH0009', N'Đã thanh toán', N'thanhtruc' );
INSERT INTO GIOHANG VALUES ('GH0010', N'Đã thanh toán', N'baongan' );


SET DATEFORMAT DMY
INSERT INTO HOADON VALUES ('DH0001', N'0123632412', N'140 Lê Trọng Tấn, Tây Thạnh, Tân Phú, TP.HCM', N'Đang xử lý', '20/10/2024', 380650, 'GH0001' );
INSERT INTO HOADON VALUES ('DH0002', N'0125148697', N'46 Đỗ Nhuận, Sơn Kỳ, Tân Phú, TP.HCM', N'Đang xử lý', '21/10/2024', 437000, 'GH0002' );
INSERT INTO HOADON VALUES ('DH0003', N'0561479456', N'113-97 Đ. Trường Chinh, Tân Thới Nhất, Quận 12, TP.HCM', N'Đang xử lý', '22/10/2024', 230000, 'GH0003' );
INSERT INTO HOADON VALUES ('DH0004', N'0124758912', N'Phan Huy Ích, Phường 15, Tân Bình, TP.HCM', N'Đang xử lý', '23/10/2024', 495650, 'GH0004' );
INSERT INTO HOADON VALUES ('DH0005', N'0326548965', N'86-8 Hoàng Bật Đạt, Phường 15, Tân Bình, Hồ Chí Minh, Việt Nam', N'Đang xử lý', '24/10/2024', 195500, 'GH0005' );
INSERT INTO HOADON VALUES ('DH0006', N'0547894563', N'Hẻm 912/33 Quang Trung, Phường 8, Gò Vấp, Hồ Chí Minh, Việt Nam', N'Đang vận chuyển', '25/10/2024', 230000, 'GH0006' );
INSERT INTO HOADON VALUES ('DH0007', N'0789413562', N'277-263 Đ. Trường Chinh, Phường 14, Tân Bình, Hồ Chí Minh, Việt Nam', N'Đang vận chuyển', '26/10/2024', 402500, 'GH0007' );
INSERT INTO HOADON VALUES ('DH0008', N'0914564784', N'19 Đ. Cộng Hòa, Phường 12, Tân Bình, Hồ Chí Minh, Việt Nam', N'Đang vận chuyển', '27/10/2024', 270250, 'GH0008' );
INSERT INTO HOADON VALUES ('DH0009', N'0917564856', N'681 Đ. Phan Văn Trị, Phường 7, Gò Vấp, Hồ Chí Minh, Việt Nam', N'Đang vận chuyển', '28/10/2024', 310500, 'GH0009' );
INSERT INTO HOADON VALUES ('DH0010', N'0875641231', N'88/14 Trần Văn Quang, Phường 10, Tân Bình, Hồ Chí Minh, Việt Nam', N'Đang xử lý', '30/10/2024', 575000, 'GH0010' );


INSERT INTO CHITIETGIOHANG VALUES ('GH0001', 'HCM-X2-16', 2, 115000);
INSERT INTO CHITIETGIOHANG VALUES ('GH0001', 'UV-65', 1, 172500);
INSERT INTO CHITIETGIOHANG VALUES ('GH0001', 'GDA-10', 3, 93150);
INSERT INTO CHITIETGIOHANG VALUES ('GH0002', 'UV-65', 5, 345000);
INSERT INTO CHITIETGIOHANG VALUES ('GH0002', 'SAK-185', 2, 92000);
INSERT INTO CHITIETGIOHANG VALUES ('GH0003', 'BD.TS5-5', 1, 230000);
INSERT INTO CHITIETGIOHANG VALUES ('GH0004', 'SAK-185', 5, 230000);
INSERT INTO CHITIETGIOHANG VALUES ('GH0004', 'BN.TS2-15', 3, 117300);
INSERT INTO CHITIETGIOHANG VALUES ('GH0004', 'SAK-37', 3, 148350);
INSERT INTO CHITIETGIOHANG VALUES ('GH0005', 'LBF-1', 5, 195500);
INSERT INTO CHITIETGIOHANG VALUES ('GH0006', 'UV-2', 1, 230000);
INSERT INTO CHITIETGIOHANG VALUES ('GH0007', 'ETT-94', 1, 402500);
INSERT INTO CHITIETGIOHANG VALUES ('GH0008', 'ETT-50', 2, 69000);
INSERT INTO CHITIETGIOHANG VALUES ('GH0008', 'HCM-X4-79', 5, 201250);
INSERT INTO CHITIETGIOHANG VALUES ('GH0009', 'GDA-10', 10, 310500);
INSERT INTO CHITIETGIOHANG VALUES ('GH0010', 'ETT-163', 5, 575000);

select * from quantri

INSERT INTO QuanTri VALUES ('ThanhTruc', '$2b$10$5ppjIvFVeSDjXyMOEvZ/oe44YmsjohjYgPZcoMlxqCugwvZyJPSZS', 'vtttruc@gmail.com');

select * from KhachHang

