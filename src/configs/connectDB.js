require('dotenv').config();
import sql from 'mssql';

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    options: {
        encrypt: true, // for azure
        trustServerCertificate: true, // change to true for local dev / self-signed certs
        characterSet: 'utf8',
    }
};

async function connectDB() {
    try {
        let pool = await sql.connect(config);
        return pool;
    } catch (err) {
        console.log('Database Connection Failed! Bad Config: ', err);
        throw err;
    }
}

module.exports = {
    connectDB,
}