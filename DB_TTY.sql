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
	SoLuong INT,
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
    MaGioHang INT IDENTITY NOT NULL,
    TrangThai BIT,
	TenTaiKhoan NVARCHAR(255),
    CONSTRAINT PK_GioHang PRIMARY KEY (MaGioHang),
    CONSTRAINT FK_GioHang_KhachHang FOREIGN KEY (TenTaiKhoan) REFERENCES KhachHang(TenTaiKhoan),
);

CREATE TABLE HoaDon (
    MaDonHang INT IDENTITY NOT NULL,
    DienThoai NVARCHAR(50),
    DiaChi NVARCHAR(255),
    TrangThaiHD NVARCHAR(50),
	NgayLap DATE,
    TongTien FLOAT,
	MaGioHang INT,
	CONSTRAINT PK_HoaDon PRIMARY KEY (MaDonHang),
    CONSTRAINT FK_HoaDon_GioHang FOREIGN KEY (MaGioHang) REFERENCES GioHang(MaGioHang)
);

CREATE TABLE ChiTietGioHang (
    MaGioHang INT NOT NULL,
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

INSERT INTO THUOC VALUES ('HCM-X4-25', N'Terramycin Egg Formula', 57500, 50, N'Bột', N'100g', N'Nâng cao năng suất trứng, phòng các bệnh ở gia cầm.', N'profile_pic-HCM-X4-25-Terramycin_Egg_Formula.jpg', N'Còn hàng', 'N1', 'GC');
INSERT INTO THUOC VALUES ('HCM-X4-79', N'Anticoc', 40250, 20, N'Bột', N'100g', N'Phòng và trị bệnh cầu trùng.', N'profile_pic-HCM-X4-79-Bio-Anticoc.jpg', N'Còn hàng', 'N2', 'GC');
INSERT INTO THUOC VALUES ('HCM-X2-16', N'Iron Dextran B12', 57500, 10, N'Dung dịch', N'100ml', N'Phòng chống thiếu máu do thiếu sắt.', N'profile_pic-HCM-X2-16-Fe-Dextran_B12.jpg', N'Tạm hết hàng', 'N2', 'GS');
INSERT INTO THUOC VALUES ('HCM-X2-164', N'Tylosin 200', 63250, 100, N'Dung dịch tiêm', N'100ml', N'Trị viêm phổi, viêm tử cung, bệnh lepto, viêm ruột', N'profile_pic-HCM-X2-164-Tylosin-200.jpg', N'Còn hàng', 'N2', 'GS');
INSERT INTO THUOC VALUES ('HCM-X2-198', N'Tiacotin', 23000, 52, N'Dung dịch', N'100ml', N'Trị bệnh đường hô hấp, tiêu hóa.', N'profile_pic-HCM-X2-198-Tia-K.C.jpg', N'Còn hàng', 'N2', 'GS');
INSERT INTO THUOC VALUES ('GDA-10', N'NVDC-JXA1 Strain', 31050, 63, N'Dung dịch tiêm', N'100ml', N'Phòng bệnh lợn tai xanh', N'profile_pic-GDA-10-NVDC-JXA1-Strain.jpg', N'Còn hàng', 'N3', 'GS');
INSERT INTO THUOC VALUES ('ETT-163', N'ECO RECICORT', 115000, 16, N'Dung dịch', N'500ml', N'Trị viêm tai ngoài, viêm da tiết bã nhờn trên chó, mèo.', N'profile_pic-ETT-163-Dental_Creme_3.jpg', N'Còn hàng', 'N2', 'TC');
INSERT INTO THUOC VALUES ('UV-65', N'RODO-UV', 172500, 69, N'Dung dịch', N'5 lít', N'Ức chế vi khuẩn gây bệnh trong ao nuôi', N'profile_pic-UV-65-RODO-UV.jpg', N'Tạm hết hàng', 'N5', 'TS');
INSERT INTO THUOC VALUES ('ETT-165', N'ECO SUPPRESTRAL', 115000, 87, N'Dung dịch', N'500ml', N'Giảm co bóp, ổn định tử cung, an thai trong trường hợp đe dọa sẩy thai', N'profile_pic-ETT-165-Progesterone.jpg', N'Còn hàng', 'N1', 'TC');
INSERT INTO THUOC VALUES ('SAK-118', N'Sakan - Fipro', 69000, 36, N'Dung dịch', N'20ml', N'Diệt ve, bọ rận, bọ chét và ghẻ trên chó mèo', N'profile_pic-SAK-118-Sakan-Fipr.jpg', N'Còn hàng', 'N4', 'TC');
INSERT INTO THUOC VALUES ('SAK-169', N'HZ-PETLOVE-2', 86250, 25, N'Dung dịch', N'20ml', N'Làm mượt lông cho chó, mèo', N'profile_pic-SAK-169-Amitraz.jpg', N'Còn hàng', 'N4', 'TC');
INSERT INTO THUOC VALUES ('SAK-185', N'FLUZAZOL', 46000, 6, N'Dung dịch', N'50ml', N'Trị nấm gây ra trên chó, mèo.', N'profile_pic-SAK-185-Funguikur.jpg', N'Tạm hết hàng', 'N2', 'TC');
INSERT INTO THUOC VALUES ('BD.TS5-4', N'MD Selen E.W.S', 345000, 69, N'Viên nén', N'10kg', N'Giúp tăng sản lượng đẻ trứng ở cá. Cá ương đạt tỷ lệ cao hơn, giảm hao hụt', N'profile_pic-BD.TS5-4-Selenvit-E.jpg', N'Còn hàng', 'N1', 'TS');
INSERT INTO THUOC VALUES ('BD.TS5-5', N'MD Bio Calcium', 230000, 59, N'Dung dịch', N'5 lít', N'Thúc đẩy quá trình lột vỏ ở tôm và giúp mau cứng vỏ sau khi lột.', N'profile_pic-BD.TS5-5-MD_Bio_Calcium.jpg', N'Còn hàng', 'N1', 'TS');
INSERT INTO THUOC VALUES ('BD.TS5-19', N'MD Protect', 230000, 36, N'Dung dịch', N'5 lít', N'Diệt các loại vi khuẩn, nấm, vi sinh động vật trong nước ao nuôi', N'profile_pic-BD.TS5-19-MD_Protect.jpg', N'Còn hàng', 'N4', 'TS');
INSERT INTO THUOC VALUES ('BN.TS2-51', N'ECO-OMICD FISH', 115000, 90, N'Dung dịch', N'500 ml', N'Sát trùng nguồn nước nuôi trồng thủy sản', N'profile_pic-BN.TS2-51-Iodin-200.jpg', N'Còn hàng', 'N4', 'TS');
INSERT INTO THUOC VALUES ('BN.TS2-15', N'ECO-DOXYFISH POWER 20%', 39100, 63, N'Bột', N'500g', N'Trị bệnh đỏ thân trên tôm do vi khuẩn Vibrio alginolyticus', N'profile_pic-BN.TS2-15-ECO-Doxyfish_Power_20.png', N'Còn hàng', 'N2', 'TS');
INSERT INTO THUOC VALUES ('SAK-37', N'Flormax', 49450, 68, N'Bột', N'100g', N'Trị nhiễm trùng đường tiêu hóa, hô hấp trên heo, trâu, bò, dê, cừu.', N'profile_pic-SAK-37-Flormax.jpg', N'Còn hàng', 'N2', 'GS');
INSERT INTO THUOC VALUES ('CME-3', N'Vắc xin PRRS nhược độc chủng JXA1-R', 65550, 29, N'Dung dịch tiêm', N'50ml', N'Phòng hội chứng rối loạn hô hấp và sinh sản (PRRS) trên heo.', N'profile_pic-CME-3-Vac_xin_PRRS_JXA1-R.jpg', N'Còn hàng', 'N3', 'GS');
INSERT INTO THUOC VALUES ('LBF-1', N'Foot And Mouth Disease Vaccine', 39100, 78, N'Dung dịch tiêm', N'100ml', N'Phòng bệnh Lở mồm long móng trên lợn', N'profile_pic-LBF-1-Foot_And_Mouth_Disease_Vaccine.jpg', N'Còn hàng', 'N3', 'GS');
INSERT INTO THUOC VALUES ('ETT-94', N'ECO ERYCOL 10', 402500, 36, N'Viên nén', N'10kg', N'Trị nhiễm trùng đường tiêu hóa, hô hấp trên vịt, gà, ngan, ngỗng', N'profile_pic-ETT-94-ECO_Erycol_10.jpg', N'Còn hàng', 'N2', 'GC');
INSERT INTO THUOC VALUES ('UV-2', N'ECOLUS', 230000, 63, N'Bột', N'5kg', N'Phân hủy nhanh chất thải, phân tôm, xác tảo và thức ăn dư thừa.', N'profile_pic-UV-2-APA-PLANKTON_FISH.jpg', N'Còn hàng', 'N5', 'TS');
INSERT INTO THUOC VALUES ('ETT-50', N'Eco – Terra egg', 34500, 56, N'Bột', N'10g', N'Tăng trọng nhanh, giảm tỷ lệ tiêu tốn thức ăn, rút ngắn thời gian nuôi', N'profile_pic-ETT-50-Eco-Terra_egg.jpg', N'Tạm hết hàng', 'N1', 'GC');
INSERT INTO THUOC VALUES ('GOV-275', N'Iron Cox', 100000, N'Hỗn dịch tiêm', N'100ml', N'Điều trị và phòng ngừa thiếu máu do thiếu sắt, do ký sinh trùng, cầu trùng, …trên gia súc, lợn', N'profile_pic-GOV-275-Iron_Cox.jpg', N'Còn hàng', 'N2', 'GS');
INSERT INTO THUOC VALUES ('GOV-27', N'G-AMOX-LANIC', 198000, N'Hỗn dịch tiêm', N'100ml', N'Trị các bệnh đường tiêu hóa: Viêm ruột ỉa chảy phân trắng, phân vàng, phân xanh do E.coli, Salmonella, phó thương hàn, thương hàn. Trị viêm vú, viêm tử cung, mất sữa (Hội chứng M.M.A), nhiễm khuẩn da, mô mềm, áp xe, móng khớp, viêm đường tiết niệu.', N'profile_pic-GOV-27-G_AMOX_LANIC.jpg', N'Còn hàng', 'N2', 'GS');
INSERT INTO THUOC VALUES ('GOV-11', N'AMOX – COLIS', 398000, N'Bột', N'1kg', N'Phòng và trị bệnh viêm phổi địa phương trên heo (SEP), tụ huyết trùng, viêm ruột tiêu chảy do E.Coli.', N'profile_pic-GOV-11-AMOX – COLIS.jpg', N'Còn hàng', 'N2', 'GS');
INSERT INTO THUOC VALUES ('GOV-32', N'NẤM PHỔI, NẤM DIỀU CAO CẤP', 648000, N'Bột', N'1kg', N'Đặc trị nhiễm trùng huyết, hen CRD ghép nấm phổi, hen ghép nấm diều, hen ghép nấm ruột', N'profile_pic-GOV-32.lpg', N'Còn hàng', 'N2', 'GS');
INSERT INTO THUOC VALUES ('GOV-74', N'FLUMEQUIN', 125000, N'Bột', N'100g', N'Đặc trị E.coli, thương hàn, tụ huyết trùng, các dạng ỉa chảy nặng, chướng diều, khô chân, sốt cao bỏ ăn, thương hàn, tụ huyết trùng.', N'profile_pic-GOV-74-FLUMEQUIN.jpg', N'Còn hàng', 'N2', 'GC');
INSERT INTO THUOC VALUES ('GOV-55', N'TIAMULIN-PREMIX 200', 255000, N'Bột', N'100g', N'Đặc trị suyễn lợn, hen gà, hen ghép E.coli, CRD, khẹc vịt, viêm phổi màng phổi, viêm teo mũi truyền nhiễm, sưng phù đầu, tụ huyết trùng, thương hàn, viêm khớp,lỵ, tiêu chảy,…', N'profile_pic-GOV-55-TIAMULIN_PREMIX_200.jpg', N'Còn hàng', 'N2', 'GS');
INSERT INTO THUOC VALUES ('GOV-50', N'FLOR S40', 418000, N'Bột', N'1kg', N'Đặc trị viêm phổi, suyễn lợn, tụ huyết trùng, viêm teo mũi truyền nhiễm, tiêu chảy, hồng lỵ, phó thương hàn, liên cầu lợn, các bệnh kế phát của bệnh tai xanh (PRRS).', N'profile_pic-GOV-50-FLOR_S40.jpg', N'Còn hàng', 'N2', 'GS');
INSERT INTO THUOC VALUES ('GOV-89', N'FLOR S40', 716000, N'Dung dịch uống', N'1 lít', N'Đặc trị hen khẹc, hen ghép tiêu chảy, sưng phù đầu, viêm xoang mũi, tụ huyết trùng, E.coli, thương hàn, tiêu chảy phân xanh, phân trắng, phân nhớt vàng…', N'profile_pic-GOV-89-ENRO_20.jpg', N'Còn hàng', 'N2', 'GC');
INSERT INTO THUOC VALUES ('GOV-13', N'AMOXIN', 9600, N'Hỗn dịch tiêm', N'100ml', N'Đặc trị các bệnh nhiễm trùng đường tiêu hoá và hô hấp của gia cầm, viêm ruột tiêu chảy, viêm phổi, sưng phù đầu, tụ huyết trùng, viêm tử cung, viêm vú, viêm móng, thương hàn, nhiễm trùng vết thương.', N'profile_pic-GOV-13-AMOXIN,jpg', N'Còn hàng', 'N2', 'GC');
INSERT INTO THUOC VALUES ('GOV-28', N'CEF ONE', 345000, N'Hỗn dịch tiêm', N'100ml', N'Đặc trị viêm phế quản, viêm phổi, viêm phổi dính sườn, tụ liên cầu, hội chứng hô hấp sau PRRS, tiêu chảy gây ra bởi E.coli, Salmonella, các bệnh viêm vú, viêm khớp, viêm tử cung, viêm móng, viêm da, tụ huyết trùng.', N'profile_pic-GOV-28-CEF_ONE.jpg', N'Còn hàng', 'N2', 'GS');

INSERT INTO THANHPHAN VALUES ( N'Oxytetracyclin');
INSERT INTO THANHPHAN VALUES ( N'Vitamin A');
INSERT INTO THANHPHAN VALUES ( N'Vitamin C');
INSERT INTO THANHPHAN VALUES ( N'Vitamin D');
INSERT INTO THANHPHAN VALUES ( N'Vitamin E');
INSERT INTO THANHPHAN VALUES ( N'Vitamin B1');
INSERT INTO THANHPHAN VALUES ( N'Vitamin B2');
INSERT INTO THANHPHAN VALUES ( N'Ca');
INSERT INTO THANHPHAN VALUES ( N'Sulfamethoxazol');
INSERT INTO THANHPHAN VALUES ( N'Diaveridine');
INSERT INTO THANHPHAN VALUES ( N'Sắt');
INSERT INTO THANHPHAN VALUES ( N'Vitamin B12');
INSERT INTO THANHPHAN VALUES ( N'Tylosin tartrate');
INSERT INTO THANHPHAN VALUES ( N'Dexamethasone acetate');
INSERT INTO THANHPHAN VALUES ( N'Tiamulin hydrogen fumarate');
INSERT INTO THANHPHAN VALUES ( N'Colistin sulfate');
INSERT INTO THANHPHAN VALUES ( N'Virus gây bệnh lợn tai xanh chủng NVDC-JXA1 vô hoạt');
INSERT INTO THANHPHAN VALUES ( N'Rhodopseudomonas');
INSERT INTO THANHPHAN VALUES ( N'Progesterone (Medroxy Progesterone)');
INSERT INTO THANHPHAN VALUES ( N'Fipronil');
INSERT INTO THANHPHAN VALUES ( N'Amitraz');
INSERT INTO THANHPHAN VALUES ( N'Ketoconazole');
INSERT INTO THANHPHAN VALUES ( N'Fluconazol');
INSERT INTO THANHPHAN VALUES ( N'Sodium selenite');
INSERT INTO THANHPHAN VALUES ( N'Biotin');
INSERT INTO THANHPHAN VALUES ( N'Vitamin D3');
INSERT INTO THANHPHAN VALUES ( N'Calcium Pantothenate');
INSERT INTO THANHPHAN VALUES ( N'Inositol');
INSERT INTO THANHPHAN VALUES ( N'1,5 Pentanedial');
INSERT INTO THANHPHAN VALUES ( N'Benzalkonium chloride');
INSERT INTO THANHPHAN VALUES ( N'Glutaraldehyde');
INSERT INTO THANHPHAN VALUES ( N'Doxycyclin');
INSERT INTO THANHPHAN VALUES ( N'Doxycycline hyclate');
INSERT INTO THANHPHAN VALUES ( N'Virus PRRS nhược độc chủng JXA1-R');
INSERT INTO THANHPHAN VALUES ( N'Virus Lở mồm Long móng type O, chủng O');
INSERT INTO THANHPHAN VALUES ( N'Erythromycin thiocynat');
INSERT INTO THANHPHAN VALUES ( N'Bacillus subtilis');
INSERT INTO THANHPHAN VALUES ( N'Bacillus megaterium');
INSERT INTO THANHPHAN VALUES ( N'Neomycin (Sulfat)');
INSERT INTO THANHPHAN VALUES ( N'Toltrazuril');
INSERT INTO THANHPHAN VALUES ( N'Amoxicillin trihydrate');
INSERT INTO THANHPHAN VALUES ( N'Clavulanic Acid');
INSERT INTO THANHPHAN VALUES ( N'Nystatin');
INSERT INTO THANHPHAN VALUES ( N'Flumequin');
INSERT INTO THANHPHAN VALUES ( N'Florfenicol');
INSERT INTO THANHPHAN VALUES ( N'Enrofloxacin');
INSERT INTO THANHPHAN VALUES ( N'Ceftiofur hydrochlorid');

INSERT INTO ThuocThanhPhan VALUES ('HCM-X4-25', 1);
INSERT INTO ThuocThanhPhan VALUES ('HCM-X4-25', 2);
INSERT INTO ThuocThanhPhan VALUES ('HCM-X4-25', 3);
INSERT INTO ThuocThanhPhan VALUES ('HCM-X4-25', 4);
INSERT INTO ThuocThanhPhan VALUES ('HCM-X4-25', 5);
INSERT INTO ThuocThanhPhan VALUES ('HCM-X4-25', 6);
INSERT INTO ThuocThanhPhan VALUES ('HCM-X4-25', 7);
INSERT INTO ThuocThanhPhan VALUES ('HCM-X4-25', 8);
INSERT INTO ThuocThanhPhan VALUES ('HCM-X4-79', 9);
INSERT INTO ThuocThanhPhan VALUES ('HCM-X4-79', 10);
INSERT INTO ThuocThanhPhan VALUES ('HCM-X2-16', 11);
INSERT INTO ThuocThanhPhan VALUES ('HCM-X2-16', 12);
INSERT INTO ThuocThanhPhan VALUES ('HCM-X2-164', 13);
INSERT INTO ThuocThanhPhan VALUES ('HCM-X2-164', 14);
INSERT INTO ThuocThanhPhan VALUES ('HCM-X2-198', 15);
INSERT INTO ThuocThanhPhan VALUES ('HCM-X2-198', 16);
INSERT INTO ThuocThanhPhan VALUES ('GDA-10', 17);
INSERT INTO ThuocThanhPhan VALUES ('ETT-163', 17);
INSERT INTO ThuocThanhPhan VALUES ('UV-65', 18);
INSERT INTO ThuocThanhPhan VALUES ('ETT-165', 19);
INSERT INTO ThuocThanhPhan VALUES ('SAK-118', 20);
INSERT INTO ThuocThanhPhan VALUES ('SAK-169', 21);
INSERT INTO ThuocThanhPhan VALUES ('SAK-169', 22);
INSERT INTO ThuocThanhPhan VALUES ('SAK-185', 23);
INSERT INTO ThuocThanhPhan VALUES ('BD.TS5-4', 5);
INSERT INTO ThuocThanhPhan VALUES ('BD.TS5-4', 24);
INSERT INTO ThuocThanhPhan VALUES ('BD.TS5-5', 25);
INSERT INTO ThuocThanhPhan VALUES ('BD.TS5-5', 2);
INSERT INTO ThuocThanhPhan VALUES ('BD.TS5-5', 4);
INSERT INTO ThuocThanhPhan VALUES ('BD.TS5-5', 27);
INSERT INTO ThuocThanhPhan VALUES ('BD.TS5-5', 28);
INSERT INTO ThuocThanhPhan VALUES ('BD.TS5-19', 29);
INSERT INTO ThuocThanhPhan VALUES ('BN.TS2-51', 30);
INSERT INTO ThuocThanhPhan VALUES ('BN.TS2-51', 31);
INSERT INTO ThuocThanhPhan VALUES ('BN.TS2-15', 32);
INSERT INTO ThuocThanhPhan VALUES ('SAK-37', 33);
INSERT INTO ThuocThanhPhan VALUES ('SAK-37', 13);
INSERT INTO ThuocThanhPhan VALUES ('CME-3', 34);
INSERT INTO ThuocThanhPhan VALUES ('LBF-1', 35);
INSERT INTO ThuocThanhPhan VALUES ('ETT-94', 36);
INSERT INTO ThuocThanhPhan VALUES ('ETT-94', 16);
INSERT INTO ThuocThanhPhan VALUES ('UV-2', 37);
INSERT INTO ThuocThanhPhan VALUES ('UV-2', 38);
INSERT INTO ThuocThanhPhan VALUES ('ETT-50', 1);
INSERT INTO ThuocThanhPhan VALUES ('ETT-50', 39);
INSERT INTO ThuocThanhPhan VALUES ('GOV-275', 40 );
INSERT INTO ThuocThanhPhan VALUES ('GOV-27', 41 );
INSERT INTO ThuocThanhPhan VALUES ('GOV-27', 42 );
INSERT INTO ThuocThanhPhan VALUES ('GOV-11', 16 );
INSERT INTO ThuocThanhPhan VALUES ('GOV-11', 41 );
INSERT INTO ThuocThanhPhan VALUES ('GOV-32', 39 );
INSERT INTO ThuocThanhPhan VALUES ('GOV-32', 43 );
INSERT INTO ThuocThanhPhan VALUES ('GOV-74', 44 );
INSERT INTO ThuocThanhPhan VALUES ('GOV-55', 15 );
INSERT INTO ThuocThanhPhan VALUES ('GOV-50', 45 );
INSERT INTO ThuocThanhPhan VALUES ('GOV-89', 46 );
INSERT INTO ThuocThanhPhan VALUES ('GOV-13', 41 );
INSERT INTO ThuocThanhPhan VALUES ('GOV-13', 16 );
INSERT INTO ThuocThanhPhan VALUES ('GOV-28', 47 );


INSERT INTO DANHMUCHINHANH VALUES ('BD.TS5-19', 'pic-BD.TS5-19-MD_Protect_2.jpg' );
INSERT INTO DANHMUCHINHANH VALUES ('BD.TS5-4', 'pic-BD.TS5-4-Selenvit-E_2.jpg' );
INSERT INTO DANHMUCHINHANH VALUES ('BD.TS5-5', 'pic-BD.TS5-5-MD_Bio_Calcium.jpg' );
INSERT INTO DANHMUCHINHANH VALUES ('BN.TS2-15', 'pic-BN.TS2-15-ECO-Doxyfish_Power_20.png' );
INSERT INTO DANHMUCHINHANH VALUES ('BN.TS2-51', 'pic-BN.TS2-51-Iodin-200.jpg' );
INSERT INTO DANHMUCHINHANH VALUES ('BN.TS2-51', 'pic-BN.TS2-51-Iodin-200_1.jpg' );
INSERT INTO DANHMUCHINHANH VALUES ('BN.TS2-51', 'pic-BN.TS2-51-Iodin-200_2.jpg' );
INSERT INTO DANHMUCHINHANH VALUES ('CME-3', 'pic-CME-3-Vac_xin_PRRS_JXA1-R_3.jpg' );
INSERT INTO DANHMUCHINHANH VALUES ('CME-3', 'pic-CME-3-Vac_xin_PRRS_JXA1-R_2.jpg' );
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
INSERT INTO DANHMUCHINHANH VALUES ('GOV-275', 'pic-GOV-275-IronCox.jpg' );
INSERT INTO DANHMUCHINHANH VALUES ('GOV-27', 'pic-GOV-27-G_AMOX_LANIC.jpg' );
INSERT INTO DANHMUCHINHANH VALUES ('GOV-11', 'pic-GOV-11-AMOX – COLIS.jpg' );
INSERT INTO DANHMUCHINHANH VALUES ('GOV-32', 'pic-GOV-32.jpg' );
INSERT INTO DANHMUCHINHANH VALUES ('GOV-74', 'pic-GOV-74-FLUMEQUIN.jpg' );
INSERT INTO DANHMUCHINHANH VALUES ('GOV-55', 'pic-GOV-55-TIAMULIN_PREMIX_200.jpg' );
INSERT INTO DANHMUCHINHANH VALUES ('GOV-50', 'pic-GOV-50-FLOR_S40.jpg' );
INSERT INTO DANHMUCHINHANH VALUES ('GOV-89', 'pic-GOV-89-ENRO_20.jpg' );
INSERT INTO DANHMUCHINHANH VALUES ('GOV-13', 'pic-GOV-13-AMOXIN.jpg' );
INSERT INTO DANHMUCHINHANH VALUES ('GOV-28', 'pic-GOV-23-CEF_ONE.jpg' );



INSERT INTO QUANTRI VALUES (N'baongoc', N'$2b$10$5ppjIvFVeSDjXyMOEvZ/oe44YmsjohjYgPZcoMlxqCugwvZyJPSZS', N'bpbn@gmail.com' );
INSERT INTO QUANTRI VALUES (N'nhuquynh', N'$2b$10$5ppjIvFVeSDjXyMOEvZ/oe44YmsjohjYgPZcoMlxqCugwvZyJPSZS', N'npnq@gmail.com' );

INSERT INTO KHACHHANG VALUES (N'ductruong', N'$2b$10$5ppjIvFVeSDjXyMOEvZ/oe44YmsjohjYgPZcoMlxqCugwvZyJPSZS', N'cdt@gmail.com' );
INSERT INTO KHACHHANG VALUES (N'thanhtruc', N'$2b$10$5ppjIvFVeSDjXyMOEvZ/oe44YmsjohjYgPZcoMlxqCugwvZyJPSZS', N'vtttruc@gmail.com' );
INSERT INTO KHACHHANG VALUES (N'baongan', N'$2b$10$5ppjIvFVeSDjXyMOEvZ/oe44YmsjohjYgPZcoMlxqCugwvZyJPSZS', N'npbn@gmail.com' );


INSERT INTO GIOHANG(TrangThai, TenTaiKhoan) VALUES (1, N'ductruong' );				
INSERT INTO GIOHANG(TrangThai, TenTaiKhoan) VALUES (1, N'thanhtruc' );				
INSERT INTO GIOHANG(TrangThai, TenTaiKhoan) VALUES (1, N'baongan' );				
INSERT INTO GIOHANG(TrangThai, TenTaiKhoan) VALUES (1, N'thanhtruc' );				
INSERT INTO GIOHANG(TrangThai, TenTaiKhoan) VALUES (1, N'ductruong' );				
INSERT INTO GIOHANG(TrangThai, TenTaiKhoan) VALUES (1, N'baongan' );				
INSERT INTO GIOHANG(TrangThai, TenTaiKhoan) VALUES (1, N'ductruong' );				
INSERT INTO GIOHANG(TrangThai, TenTaiKhoan) VALUES (1, N'baongan' );				
INSERT INTO GIOHANG(TrangThai, TenTaiKhoan) VALUES (1, N'thanhtruc' );				
INSERT INTO GIOHANG(TrangThai, TenTaiKhoan) VALUES (1, N'baongan' );

INSERT INTO GIOHANG(TrangThai, TenTaiKhoan) VALUES (0, N'ductruong' );	


SET DATEFORMAT DMY
INSERT INTO HOADON(DienThoai, DiaChi, TrangThaiHD, NgayLap, TongTien, MaGioHang) VALUES ( N'0123632412', N'140 Lê Trọng Tấn, Tây Thạnh, Tân Phú, TP.HCM', N'Đang xử lý', '20/10/2024', 380650, '1' );										
INSERT INTO HOADON(DienThoai, DiaChi, TrangThaiHD, NgayLap, TongTien, MaGioHang) VALUES ( N'0125148697', N'46 Đỗ Nhuận, Sơn Kỳ, Tân Phú, TP.HCM', N'Đang xử lý', '21/10/2024', 437000, '2' );										
INSERT INTO HOADON(DienThoai, DiaChi, TrangThaiHD, NgayLap, TongTien, MaGioHang) VALUES ( N'0561479456', N'113-97 Đ. Trường Chinh, Tân Thới Nhất, Quận 12, TP.HCM', N'Đang xử lý', '22/10/2024', 230000, '3' );										
INSERT INTO HOADON(DienThoai, DiaChi, TrangThaiHD, NgayLap, TongTien, MaGioHang) VALUES ( N'0124758912', N'Phan Huy Ích, Phường 15, Tân Bình, TP.HCM', N'Đang xử lý', '23/10/2024', 495650, '4' );										
INSERT INTO HOADON(DienThoai, DiaChi, TrangThaiHD, NgayLap, TongTien, MaGioHang) VALUES ( N'0326548965', N'86-8 Hoàng Bật Đạt, Phường 15, Tân Bình, Hồ Chí Minh, Việt Nam', N'Đang xử lý', '24/10/2024', 195500, '5' );										
INSERT INTO HOADON(DienThoai, DiaChi, TrangThaiHD, NgayLap, TongTien, MaGioHang) VALUES ( N'0547894563', N'Hẻm 912/33 Quang Trung, Phường 8, Gò Vấp, Hồ Chí Minh, Việt Nam', N'Đang vận chuyển', '25/10/2024', 230000, '6' );										
INSERT INTO HOADON(DienThoai, DiaChi, TrangThaiHD, NgayLap, TongTien, MaGioHang) VALUES ( N'0789413562', N'277-263 Đ. Trường Chinh, Phường 14, Tân Bình, Hồ Chí Minh, Việt Nam', N'Đang vận chuyển', '26/10/2024', 402500, '7' );										
INSERT INTO HOADON(DienThoai, DiaChi, TrangThaiHD, NgayLap, TongTien, MaGioHang) VALUES ( N'0914564784', N'19 Đ. Cộng Hòa, Phường 12, Tân Bình, Hồ Chí Minh, Việt Nam', N'Đang vận chuyển', '27/10/2024', 270250, '8' );										
INSERT INTO HOADON(DienThoai, DiaChi, TrangThaiHD, NgayLap, TongTien, MaGioHang) VALUES ( N'0917564856', N'681 Đ. Phan Văn Trị, Phường 7, Gò Vấp, Hồ Chí Minh, Việt Nam', N'Đang vận chuyển', '28/10/2024', 310500, '9' );										
INSERT INTO HOADON(DienThoai, DiaChi, TrangThaiHD, NgayLap, TongTien, MaGioHang) VALUES ( N'0875641231', N'88/14 Trần Văn Quang, Phường 10, Tân Bình, Hồ Chí Minh, Việt Nam', N'Đang xử lý', '30/10/2024', 575000, '10' );										


INSERT INTO CHITIETGIOHANG VALUES ('1', 'HCM-X2-16', 2, 115000);				
INSERT INTO CHITIETGIOHANG VALUES ('1', 'UV-65', 1, 172500);				
INSERT INTO CHITIETGIOHANG VALUES ('1', 'GDA-10', 3, 93150);				
INSERT INTO CHITIETGIOHANG VALUES ('2', 'UV-65', 5, 345000);				
INSERT INTO CHITIETGIOHANG VALUES ('2', 'SAK-185', 2, 92000);				
INSERT INTO CHITIETGIOHANG VALUES ('3', 'BD.TS5-5', 1, 230000);				
INSERT INTO CHITIETGIOHANG VALUES ('4', 'SAK-185', 5, 230000);				
INSERT INTO CHITIETGIOHANG VALUES ('4', 'BN.TS2-15', 3, 117300);				
INSERT INTO CHITIETGIOHANG VALUES ('4', 'SAK-37', 3, 148350);				
INSERT INTO CHITIETGIOHANG VALUES ('5', 'LBF-1', 5, 195500);				
INSERT INTO CHITIETGIOHANG VALUES ('6', 'UV-2', 1, 230000);				
INSERT INTO CHITIETGIOHANG VALUES ('7', 'ETT-94', 1, 402500);				
INSERT INTO CHITIETGIOHANG VALUES ('8', 'ETT-50', 2, 69000);				
INSERT INTO CHITIETGIOHANG VALUES ('8', 'HCM-X4-79', 5, 201250);				
INSERT INTO CHITIETGIOHANG VALUES ('9', 'GDA-10', 10, 310500);				
INSERT INTO CHITIETGIOHANG VALUES ('10', 'ETT-163', 5, 575000);

INSERT INTO CHITIETGIOHANG VALUES ('11', 'HCM-X2-16', 2, 115000);
INSERT INTO CHITIETGIOHANG VALUES ('11', 'UV-65', 1, 172500);
INSERT INTO CHITIETGIOHANG VALUES ('11', 'GDA-10', 3, 93150);


INSERT INTO QuanTri VALUES ('ThanhTruc', '$2b$10$5ppjIvFVeSDjXyMOEvZ/oe44YmsjohjYgPZcoMlxqCugwvZyJPSZS', 'vtttruc@gmail.com');

select * from quantri
select * from KhachHang

