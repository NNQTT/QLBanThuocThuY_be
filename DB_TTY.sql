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
    MaNhomThuoc INT IDENTITY NOT NULL,
    TenNhom NVARCHAR(255),
    SoLuong INT,
	CONSTRAINT PK_NhomThuoc PRIMARY KEY (MaNhomThuoc),
);

CREATE TABLE LoaiSuDung (
    MaLoai INT IDENTITY NOT NULL,
	TenLoai NVARCHAR(255),
	CONSTRAINT PK_LoaiSuDung PRIMARY KEY (MaLoai),
);

CREATE TABLE Thuoc (
    MaThuoc INT IDENTITY NOT NULL,
    TenThuoc NVARCHAR(255),
    GiaBan FLOAT,
    DangBaoChe NVARCHAR(255),
    QCDongGoi NVARCHAR(255),
    CongDung NVARCHAR(255),
    AnhDaiDien NVARCHAR(255),
    QuyCachDongGoi NVARCHAR(255),
    TrangThai NVARCHAR(50),
    MaNhomThuoc INT,
	MaLoai INT,
	CONSTRAINT PK_Thuoc PRIMARY KEY (MaThuoc),
    CONSTRAINT FK_Thuoc_NhomThuoc FOREIGN KEY (MaNhomThuoc) REFERENCES NhomThuoc(MaNhomThuoc),
	CONSTRAINT FK_Thuoc_LoaiSuDung FOREIGN KEY (MaLoai) REFERENCES LoaiSuDung(MaLoai)
);

CREATE TABLE DanhMucHinhAnh (
	MaDanhMuc INT IDENTITY NOT NULL,
    TenDanhMuc NVARCHAR(255),
	MaThuoc INT,
	CONSTRAINT PK_DanhMucHinhAnh PRIMARY KEY (MaDanhMuc),
	CONSTRAINT FK_DanhMucHinhAnh_Thuoc FOREIGN KEY (MaThuoc) REFERENCES Thuoc(MaThuoc)
);

CREATE TABLE ThanhPhan (
    MaTP INT IDENTITY NOT NULL,
    TenThanhPhan NVARCHAR(255),
	CONSTRAINT PK_ThanhPhan PRIMARY KEY (MaTP)
);

CREATE TABLE ThuocThanhPhan (
    MaThuoc INT NOT NULL,
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
    TrangThai NVARCHAR(50),
	TenTaiKhoan NVARCHAR(255),
    CONSTRAINT PK_GioHang PRIMARY KEY (MaGioHang),
    CONSTRAINT FK_GioHang_KhachHang FOREIGN KEY (TenTaiKhoan) REFERENCES KhachHang(TenTaiKhoan),
);

CREATE TABLE HoaDon (
    MaDonHang INT IDENTITY NOT NULL,
    DienThoai NVARCHAR(50),
    DiaChi NVARCHAR(255),
    TrangThaiHD NVARCHAR(50),
    TongTien FLOAT,
	MaGioHang INT,
	CONSTRAINT PK_HoaDon PRIMARY KEY (MaDonHang),
    CONSTRAINT FK_HoaDon_GioHang FOREIGN KEY (MaGioHang) REFERENCES GioHang(MaGioHang)
);

CREATE TABLE ChiTietGioHang (
    MaGioHang INT NOT NULL,
	MaThuoc INT NOT NULL,
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
	MaThuoc INT,
	TenTaiKhoan NVARCHAR(255),
	CONSTRAINT PK_LichSuThuoc PRIMARY KEY (MaThemSuaThuoc),
    CONSTRAINT FK_LichSuThuoc_Thuoc FOREIGN KEY (MaThuoc) REFERENCES Thuoc(MaThuoc),
	CONSTRAINT FK_LichSuThuoc_QuanTri FOREIGN KEY (TenTaiKhoan) REFERENCES QuanTri(TenTaiKhoan)
);