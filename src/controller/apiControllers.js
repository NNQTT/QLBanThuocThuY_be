import e from 'express';
import { connectDB } from '../configs/connectDB';
import axios from "axios";

let getTest = async (req, res) =>{
    try {
        res.send('Hello World');
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    getTest,
}