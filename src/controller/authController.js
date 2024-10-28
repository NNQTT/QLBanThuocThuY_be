import { connectDB } from "../configs/connectDB";
import axios from "axios";
import bcrypt from "bcrypt";
import sql from "mssql";

const signup = async (req, res) => {
    try {
        const { tentaikhoan, matkhau, email, confirmpass } = req.body;
        const pool = await connectDB();

        const result = await pool.request()
            .input('email', sql.VarChar, email)
            .query('SELECT * FROM KhachHang WHERE Email = @email');

        if (result.recordset.length > 0) {
            return res.status(400).send('Username already exists');
        } else {
            if (matkhau === confirmpass) {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(matkhau, salt);

                await pool.request()
                    .input('tentaikhoan', sql.NVarChar, tentaikhoan)
                    .input('hashedPassword', sql.NVarChar, hashedPassword)
                    .input('email', sql.NVarChar, email)
                    .query('INSERT INTO KhachHang (TenTaiKhoan, MatKhau, Email) VALUES (@tentaikhoan, @hashedPassword, @email)');

                return res.status(200).send('Signup success');
            } else {
                return res.status(400).send('Password not match');
            }
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send('Internal Server Error');
    }
}

const signupAdmin = async (req, res) => {
    try {
        const { tentaikhoan, matkhau, email, confirmpass } = req.body;
        const pool = await connectDB();

        const result = await pool.request()
            .input('email', sql.VarChar, email)
            .query('SELECT * FROM QuanTri WHERE Email = @email');

        if (result.recordset.length > 0) {
            return res.status(400).send('Username already exists');
        } else {
            if (matkhau === confirmpass) {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(matkhau, salt);

                await pool.request()
                    .input('tentaikhoan', sql.NVarChar, tentaikhoan)
                    .input('hashedPassword', sql.NVarChar, hashedPassword)
                    .input('email', sql.NVarChar, email)
                    .query('INSERT INTO QuanTri (TenTaiKhoan, MatKhau, Email) VALUES (@tentaikhoan, @hashedPassword, @email)');

                return res.status(200).send('Signup success');
            } else {
                return res.status(400).send('Password not match');
            }
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send('Internal Server Error');
    }
}

const login = async (req, res) => {
    try {
        const { email, matkhau } = req.body;
        const pool = await connectDB();
        const result = await pool.request()
            .input('email', sql.VarChar, email)
            .query('SELECT * FROM KhachHang WHERE Email = @email');
        if (result.recordset.length === 0) {
            return res.status(400).send('Username not exists');
        }
        const validPass = await bcrypt.compare(matkhau, result.recordset[0].MatKhau);
        if (!validPass) {
            return res.status(400).send('Invalid password');
        }
        return res.status(200).send('Login success');
    } catch (err) {
        console.log(err);
        return res.status(500).send('Internal Server Error');
    }
}

const loginAdmin = async (req, res) => {
    try {
        const { email, matkhau } = req.body;
        const pool = await connectDB();
        const result = await pool.request()
            .input('email', sql.VarChar, email)
            .query('SELECT * FROM QuanTri WHERE Email = @email');
        if (result.recordset.length === 0) {
            return res.status(400).send('Username not exists');
        }
        const validPass = await bcrypt.compare(matkhau, result.recordset[0].MatKhau);
        if (!validPass) {
            return res.status(400).send('Invalid password');
        }
        return res.status(200).send('Login success');
    } catch (err) {
        console.log(err);
        return res.status(500).send('Internal Server Error');
    }
}

const logout = (req, res) => {
    req.session.destroy();
    res.status(200).json({ message: "Logout success" });
}

module.exports = {
    signup,
    login,
    logout,
    signupAdmin,
    loginAdmin
}