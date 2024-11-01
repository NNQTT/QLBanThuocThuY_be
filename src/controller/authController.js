require('dotenv').config();
import { connectDB } from "../configs/connectDB";
import axios from "axios";
import bcrypt from "bcrypt";
import sql from "mssql";
const jwt = require('jsonwebtoken');

const signup = async (req, res) => {
    try {
        const { tentaikhoan, matkhau, email, confirmpass } = req.body;
        const pool = await connectDB();

        const result = await pool.request()
            .input('email', sql.VarChar, email)
            .query('SELECT * FROM KhachHang WHERE Email = @email');

        if (result.recordset.length > 0) {
            return res.status(400).json({
                message: 'Email already used',
                success: false
            });
        } else {
            if (matkhau === confirmpass) {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(matkhau, salt);

                await pool.request()
                    .input('tentaikhoan', sql.NVarChar, tentaikhoan)
                    .input('hashedPassword', sql.NVarChar, hashedPassword)
                    .input('email', sql.NVarChar, email)
                    .query('INSERT INTO KhachHang (TenTaiKhoan, MatKhau, Email) VALUES (@tentaikhoan, @hashedPassword, @email)');

                return res.status(200).json({
                    message: 'Signup success',
                    success: true
                });
            } else {
                return res.status(404).json({
                    message: 'Password not match',
                    success: false
                });
            }
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: 'Internal Server Error',
            success: false
        });
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
        if (!email) {
            return res.status(404).json({ message: 'Email is required', success: false });
        }
        if (!matkhau) {
            return res.status(404).json({ message: 'Password is required', success: false });
        }
        if (result.recordset.length === 0) {
            return res.status(400).json({ message: 'Email not found', success: false });
        }
        const validPass = await bcrypt.compare(matkhau, result.recordset[0].MatKhau);
        if (!validPass) {
            return res.status(400).json({ message: 'Password invalid', success: false });
        }
        // create an access token
        const payload = {
            email: result.recordset[0].Email,
            tentaikhoan: result.recordset[0].TenTaiKhoan
        }
        const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.JWT_EXPIRE });

        // return res.status(200).json({ message: 'Login success', success: true });
        return res.status(200).json({ accessToken, user: { email: result.recordset[0].Email, tentaikhoan: result.recordset[0].TenTaiKhoan }, message: 'Login success', success: true });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Internal Server Error', success: false });
    }
}

const getListUser = async (req, res) => {
    try {
        const pool = await connectDB();
        const result = await pool.request()
            .query('SELECT Email, TenTaiKhoan FROM KhachHang');
        return res.status(200).json(result.recordset);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

const authenticationLogin = async (req, res) => {
  
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; 

    console.log(">>> Token:", token);

    if (!token) return res.status(400).json({ message: 'Invalid Token' });

    try {
        const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        if (!decode) return res.status(400).json({ message: 'Invalid Token' });
        return res.status(200).json({ message: 'Valid Token', data: decode });
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(400).json({ message: 'Token Expired' });
        }
        return res.status(400).json({ message: 'Invalid Token' });
    }
};

const loginAdmin = async (req, res) => {
    try {
        const { email, matkhau } = req.body;
        const pool = await connectDB();
        const result = await pool.request()
            .input('email', sql.VarChar, email)
            .query('SELECT * FROM QuanTri WHERE Email = @email');

        const validPass = await bcrypt.compare(matkhau, result.recordset[0].MatKhau);

        if (result.recordset.length === 0 || !validPass) {
            return res.status(404).json({ message: 'Email or password invalid!', success: false });
        }
        return res.status(200).json({ message: 'Login success', success: true });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Internal Server Error', success: false });
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
    loginAdmin,
    getListUser,
    authenticationLogin
}