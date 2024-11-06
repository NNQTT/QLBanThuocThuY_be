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
        const { id } = req.params;
        const pool = await connectDB();

        console.log("product id: ", id);
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

const getProductRelated = async (req, res) => {
    try {
        const {maloai, manhomthuoc} = req.query;
        const pool = await connectDB();
        console.log('MaLoai: ', maloai);
        const result = await pool.request()
            .input('MaLoai', sql.VarChar, maloai)
            .input('MaNhomThuoc', sql.VarChar, manhomthuoc)
            .query('SELECT * FROM Thuoc WHERE MaLoai = @MaLoai or MaNhomThuoc = @MaNhomThuoc');

        return res.status(200).json({data: result.recordset});
        
    } catch (error) {
        console.log(error);
        return res.status(500).send('Internal Server Error');
        
    }
}

const getProductsByName = async (req, res) =>{
    let {query} = req.query;
    console.log('query: ', query);
    if(!query){
        return res.status(400).json({message: 'Please enter name or use'});
    }
    try {
        let pool = await connectDB();
        let result = await pool.request()
            .input('query', sql.NVarChar, `%${query}%`)
            .query('SELECT * FROM Thuoc WHERE TenThuoc LIKE @query OR CongDung LIKE @query');
        console.log(result);
        res.status(200).json(result.recordset)
    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal Server Error");
    }
}

const getProductsSortedByPrice = async (req, res) =>{
    try {
        let {giaBan} = req.query;
        let pool = await connectDB();
        let result;
        if(giaBan == -1){
            result = await pool.request().query('SELECT * FROM Thuoc ORDER BY GiaBan DESC');
        }
        else{
            result = await pool.request().query('SELECT * FROM Thuoc ORDER BY GiaBan ASC');
        }
        res.status(200).json(result.recordset);
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: 'Internal Server Error'})
    }
}

const getProductsFilteredByPrice = async (req, res) =>{
    try {
        let {giaBan} = req.query;
        console.log('giá bán: ', giaBan);
        let pool = await connectDB();
        let result;
        if(giaBan < 20000){
            result = await pool.request().query('SELECT * FROM Thuoc WHERE GiaBan < 20000');
        }
        else if(giaBan >= 20000 && giaBan < 50000){
            result = await pool.request().query('SELECT * FROM Thuoc WHERE GiaBan >= 20000 AND GiaBan < 50000');
        }
        else if(giaBan >= 50000 && giaBan < 100000){
            result = await pool.request().query('SELECT * FROM Thuoc WHERE GiaBan >= 50000 AND GiaBan < 1000000');
        }
        else if(giaBan >= 100000 && giaBan < 200000){
            result = await pool.request().query('SELECT * FROM Thuoc WHERE GiaBan >= 100000 AND GiaBan < 2000000');
        }
        else{
            result = await pool.request().query('SELECT * FROM Thuoc WHERE GiaBan > 200000');
        }
        console.log(result);
        res.status(200).json(result.recordset);
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: 'Internal Server Error'})
    }
}
module.exports = {
    getProducts,
    getProductById,
    getProductsByName,
    getProductsSortedByPrice,
    getProductsFilteredByPrice,
    getProductRelated
}