const express = require('express');
const dbConnect = require('./config/dbConnect');
const app = express();
const dotenv = require('dotenv').config();
const PORT = process.env.PORT || 4000;
const authRouter = require('./routes/authRoute');
const bodyParser = require('body-parser');
const { notFound, errorHander } = require('./middlewares/errorHandle');
const cookieParser = require('cookie-parser');
const productRouter = require('./routes/productRoute');
const morgan = require('morgan')
dbConnect();
app.use(morgan('dev'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser())

app.use('/api/user/',authRouter);
app.use('/api/product/',productRouter);

app.use(notFound);
app.use(errorHander);


app.listen(PORT, ()=>{
    console.log(`server is running on port ${PORT}`);
})