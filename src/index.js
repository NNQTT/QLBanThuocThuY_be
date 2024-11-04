import express from 'express'
import session from 'express-session'
var cors = require('cors')
import initApiRoutes from './route/api'
import initProductRoute from './route/product'
import cookieParser from 'cookie-parser'
import initAdminRoute from './route/admin'
import initCartRoute from './route/cart'

require('dotenv').config();
let port = process.env.PORT || 8080;

const app = express()
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))

//config to use req.body
app.use(express.urlencoded({ extended: true }));
app.use(express.text({ type: '/' }));
app.use(express.json());
app.use(cookieParser());

//config session
app.set('trust proxy', 1) // trust first proxy
app.use(session({
    secret: 'mysecretkey',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

initApiRoutes(app)
initProductRoute(app)
initAdminRoute(app);
initCartRoute(app);

app.listen(port, () => {
    //callback
    console.log("Backend Nodejs is running on the port: " + port);
})