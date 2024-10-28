import { connectDB } from "../configs/connectDB";
import axios from "axios";
import bcrypt from "bcrypt";
import sql from "mssql";

const getProducts = async (req, res) => {
    try {
        const pool = await connectDB();

        const result = await pool.request()
            .query('SELECT * FROM Thuoc');

        return res.status(200).send(result.recordset);
    } catch (err) {
        console.log(err);
        return res.status(500).send('Internal Server Error');
    }
}

const getProductById = async (req, res) => {
    try {
        const { id } = req.query;
        const pool = await connectDB();

        console.log(id);
        const result = await pool.request()
            .input('id', sql.VarChar, id)
            .query('SELECT * FROM Thuoc WHERE MaThuoc = @id');

        if (result.recordset.length === 0) {
            return res.status(404).send('Product not found MaThuoc = ' + id);
        }

        return res.status(200).send(result.recordset[0]);
    } catch (err) {
        console.log(err);
        return res.status(500).send('Internal Server Error');
    }
}

module.exports = {
    getProducts,
    getProductById
}