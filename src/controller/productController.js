import { connectDB } from "../configs/connectDB";
import axios from "axios";
import bcrypt from "bcrypt";
import sql from "mssql";

const getProducts = async (req, res) => {
    try {
        const pool = await connectDB();
        let pagesize = req.query.pagesize || 12;
        let page = req.query.page || 1;
        const offset = (page - 1) * pagesize;

        const result = await pool.request()
            .query(`SELECT * FROM Thuoc 
                    ORDER BY MaThuoc 
                    OFFSET ${offset} ROWS 
                    FETCH NEXT ${pagesize} ROWS ONLY`)

        const totalResult = await pool.request().query('SELECT COUNT(*) AS totalProducts FROM Thuoc');
        const totalProducts = totalResult.recordset[0].totalProducts;

        //return res.status(200).send(result.recordset);
        return res.status(200).json({
            products: result.recordset,
            totalProducts: totalProducts,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send('Internal Server Error');
    }
}

const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await connectDB();

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
        const { maloai, manhomthuoc } = req.query;
        const pool = await connectDB();
        const result = await pool.request()
            .input('MaLoai', sql.VarChar, maloai)
            .input('MaNhomThuoc', sql.VarChar, manhomthuoc)
            .query('SELECT * FROM Thuoc WHERE MaLoai = @MaLoai or MaNhomThuoc = @MaNhomThuoc');

        return res.status(200).json({ data: result.recordset });

    } catch (error) {
        console.log(error);
        return res.status(500).send('Internal Server Error');

    }
}

const getProductByLocalStorage = async (req, res) => {
    try {
        const { listproduct } = req.query;
        let listProductArray;
        try {
            listProductArray = JSON.parse(listproduct);
        } catch (error) {
            return res.status(400).send('Invalid JSON format for listproduct');
        }
        if (!Array.isArray(listProductArray)) {
            return res.status(400).send('List product is not array');
        }
        const pool = await connectDB();
        let result = [];
        for (let i = 0; i < listProductArray.length; i++) {
            let product = await pool.request()
                .input('MaThuoc', sql.VarChar, listProductArray[i])
                .query('SELECT * FROM Thuoc WHERE MaThuoc = @MaThuoc');
            result.push(product.recordset[0]);
        }
        return res.status(200).json({ data: result });

    } catch (error) {
        console.log(error);
        return res.status(500).send('Internal Server Error');

    }
}

const getAlbumProducts = async (req, res) => {
    try {
        const { mathuoc } = req.query;
        const pool = await connectDB();
        const result = await pool.request()
            .input('MaThuoc', sql.VarChar, mathuoc)
            .query('SELECT * FROM DanhMucHinhAnh WHERE MaThuoc = @MaThuoc');

            console.log(result);
        return res.status(200).json({ data: result.recordset });

    } catch (error) {
        console.log(error);
        return res.status(500).send('Internal Server Error');
    }
}

const getProductsByName = async (req, res) => {
    let { searchTerm  } = req.query;
    console.log('query: ', req.query);
    console.log('name: ', searchTerm);
    if (!searchTerm) {
        return res.status(400).json({ message: 'Please enter name or use' });
    }
    try {
        let pool = await connectDB();
        let result = await pool.request()
            .input('query', sql.NVarChar, `%${searchTerm }%`)
            .query('SELECT * FROM Thuoc WHERE TenThuoc LIKE @query OR CongDung LIKE @query');
        console.log(result);
        res.status(200).json(result.recordset)
    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal Server Error");
    }
}

const getProductsByGroup = async (req, res) => {
    let { groupName  } = req.query;
    console.log('group: ', groupName);
    let pagesize = req.query.pagesize || 12;
    let page = req.query.page || 1;
    const offset = (page - 1) * pagesize;
    try {
        let pool = await connectDB();
        let result = await pool.request()
            .input('groupName', sql.VarChar, groupName)
            .query(`SELECT * FROM Thuoc 
                    WHERE MaNhomThuoc = @groupName
                    ORDER BY MaThuoc
                    OFFSET ${offset} ROWS 
                    FETCH NEXT ${pagesize} ROWS ONLY`);
        let totalResult = await pool.request()  
            .input('groupName', sql.VarChar, groupName)
            .query('SELECT COUNT(*) AS totalProducts FROM Thuoc WHERE MaNhomThuoc = @groupName');
        const totalProducts = totalResult.recordset[0].totalProducts;
        res.status(200).json({
            products: result.recordset,
            totalProducts: totalProducts,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal Server Error");
    }
}

const getProductsSortedByPrice = async (req, res) => {
    try {
        const pool = await connectDB();
        const { sort, groupName } = req.query; 
        console.log('sort: ', sort);
        let pagesize = req.query.pagesize || 12;
        let page = req.query.page || 1;
        const offset = (page - 1) * pagesize;

        const request = pool.request();
        let query = "SELECT * FROM Thuoc";
        let countQuery = "SELECT COUNT(*) AS totalProducts FROM Thuoc";
        
        if (groupName) {
            request.input('groupName', sql.VarChar, groupName);
            query += " WHERE MaNhomThuoc = @groupName";
            countQuery += " WHERE MaNhomThuoc = @groupName";
        }
        
        query += ` ORDER BY GiaBan ${sort === '1' ? 'ASC' : 'DESC'}
                    OFFSET ${offset} ROWS 
                    FETCH NEXT ${pagesize} ROWS ONLY`;
        
        const result = await request.query(query);
        const totalResult = await request.query(countQuery);
        const totalProducts = totalResult.recordset[0].totalProducts;
        return res.status(200).json({
            products: result.recordset,
            totalProducts: totalProducts,
        });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({
            message: 'Error getting products sorted by price'
        });
    }
};

const getProductsFilteredByPrice = async (req, res) => {
    try {
        let pool = await connectDB();
        let { price, groupName } = req.query;
        console.log('price: ', price);
        let pagesize = req.query.pagesize || 12;
        let page = req.query.page || 1;
        const offset = (page - 1) * pagesize;

        const request = pool.request();
        console.log('giá bán: ', price);
        let query = "SELECT * FROM Thuoc WHERE";
        let countQuery = "SELECT COUNT(*) AS totalProducts FROM Thuoc WHERE";
        
        if (price < 20000) {
            query += " GiaBan < 20000";
            countQuery += " GiaBan < 20000";
        }
        else if (price >= 20000 && price < 50000) {
            query += " GiaBan >= 20000 AND GiaBan < 50000";
            countQuery += " GiaBan >= 20000 AND GiaBan < 50000";
            }
        else if (price >= 50000 && price < 100000) {
            query += " GiaBan >= 50000 AND GiaBan < 100000";
            countQuery += " GiaBan >= 50000 AND GiaBan < 100000";
        }
        else if (price >= 100000 && price < 200000) {
            query += " GiaBan >= 100000 AND GiaBan < 200000";
            countQuery += " GiaBan >= 100000 AND GiaBan < 200000";
        }
        else {
            query += " GiaBan > 200000";
            countQuery += " GiaBan > 200000";
        }

        if (groupName) {
            request.input('groupName', sql.VarChar, groupName);
            query += " AND MaNhomThuoc = @groupName";
            countQuery += " AND MaNhomThuoc = @groupName";
        }

        query += `  ORDER BY MaThuoc
                    OFFSET ${offset} ROWS 
                    FETCH NEXT ${pagesize} ROWS ONLY`;

        const result = await request.query(query);  
        const totalResult = await request.query(countQuery);
        const totalProducts = totalResult.recordset[0].totalProducts;
        res.status(200).json({
            products: result.recordset,
            totalProducts: totalProducts,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal Server Error' })
    }
}
module.exports = {
    getProducts,
    getProductById,
    getProductsByName,
    getProductsSortedByPrice,
    getProductsFilteredByPrice,
    getProductRelated,
    getProductByLocalStorage,
    getAlbumProducts,
    getProductsByGroup
}