require('dotenv').config();
import { connectDB } from "../configs/connectDB";
import bcrypt from "bcrypt";
import sql from "mssql";
const jwt = require('jsonwebtoken');

const signup = async (req, res) => {
    try {
        const { tentaikhoan, matkhau, email, confirmpass } = req.body;
        const pool = await connectDB();

        const result = await pool.request()
            .input('tentaikhoan', sql.VarChar, tentaikhoan)
            .query('SELECT * FROM KhachHang WHERE TenTaiKhoan = @tentaikhoan');

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
            .query('SELECT * FROM QuanTri WHERE TenTaiKhoan = @tentaikhoan');

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
        const { username, matkhau } = req.body;
        const pool = await connectDB();
        const result = await pool.request()
            .input('username', sql.NVarChar, username)
            .query('SELECT * FROM KhachHang WHERE TenTaiKhoan = @username');
        if (!username) {
            return res.status(404).json({ message: 'Username is required', success: false });
        }
        if (!matkhau) {
            return res.status(404).json({ message: 'Password is required', success: false });
        }
        if (result.recordset.length === 0) {
            return res.status(400).json({ message: 'Username not found', success: false });
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
        const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRE });

        // set refresh token to cookie
        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            sameSite: 'None', secure: true,
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            accessToken,
            user: { email: result.recordset[0].Email, tentaikhoan: result.recordset[0].TenTaiKhoan },
            message: 'Login success',
            success: true,
        });
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

const reloginwithrefreshtoken = async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
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
}

const authenticationLogin = async (req, res) => {

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    const refreshToken = req.cookies.jwt;
    try {
        const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        if (!decode) return res.status(400).json({ message: 'Invalid Token' });
        return res.status(200).json({ message: 'Valid Token', data: decode });
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            // return res.status(400).json({ message: 'Token Expired' });
            if (!refreshToken) return res.status(400).json({ message: 'Invalid Tokenaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' });
            try {
                const decode = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
                if (!decode) return res.status(400).json({ message: 'Invalid Token' });
                const payload = {
                    email: decode.email,
                    tentaikhoan: decode.tentaikhoan
                }
                const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.JWT_EXPIRE });
                return res.status(200).json({
                    accessToken,
                    data: payload,
                    message: 'Token Refreshed',
                    method: 'refresh'
                });
            } catch (err) {
                console.log(err);
                return res.status(400).json({ message: 'Invalid Token' });
            }
        }
        return res.status(400).json({ message: 'Invalid Token' });
    }
};

const loginAdmin = async (req, res) => {
    try {
        const { username, matkhau } = req.body;
        const pool = await connectDB();
        const result = await pool.request()
            .input('username', sql.VarChar, username)
            .query('SELECT * FROM QuanTri WHERE TenTaiKhoan = @username');

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'Username not found', success: false });
        }

        const validPass = await bcrypt.compare(matkhau, result.recordset[0].MatKhau);

        if (!validPass) {
            return res.status(404).json({ message: 'Password invalid!', success: false });
        }

        const payload = {
            email: result.recordset[0].Email,
            tentaikhoan: result.recordset[0].TenTaiKhoan
        }
        
        const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.JWT_EXPIRE });
        const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRE });

        // Log để debug
        console.log('Login response:', {
            accessToken,
            refreshToken,
            user: {
                email: result.recordset[0].Email,
                tentaikhoan: result.recordset[0].TenTaiKhoan
            }
        });

        return res.status(200).json({ 
            accessToken, 
            refreshToken, 
            user: {
                email: result.recordset[0].Email,
                tentaikhoan: result.recordset[0].TenTaiKhoan
            },
            message: 'Login success',
            success: true 
        });

    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Internal server error', success: false });
    }
};

const logout = async (req, res) => {
    req.session.destroy();
    // clear cookie
    res.clearCookie('jwt', {
        httpOnly: true,
        sameSite: 'None',
        secure: true
    });
    res.sendStatus(204);
}

const getCurrentUser = async (req, res) => {
    try {
        // Lấy token từ header
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        
        // Trả về thông tin user
        return res.status(200).json({
            tentaikhoan: decoded.tentaikhoan,
            email: decoded.email
        });
    } catch (error) {
        console.error('Get current user error:', error);
        return res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = {
    signup,
    login,
    logout,
    signupAdmin,
    loginAdmin,
    getListUser,
    authenticationLogin,
    reloginwithrefreshtoken,
    getCurrentUser
}