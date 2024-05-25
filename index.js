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
<<<<<<< HEAD
const blogRouter = require('./routes/blogRoute');
const prodcategoryRouter = require('./routes/prodcategoryRoute');
const blogcategoryRouter = require('./routes/blogcategoryRoute ');
const brandRouter = require('./routes/brandRoute');

dbConnect();



=======
dbConnect();
>>>>>>> 0daee0d (fist commit of backend ecommerce application website)
app.use(morgan('dev'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser())

app.use('/api/user/',authRouter);
app.use('/api/product/',productRouter);
<<<<<<< HEAD
app.use('/api/blog/',blogRouter);
app.use('/api/category/', prodcategoryRouter);
app.use('/api/blogcategory/', blogcategoryRouter);
app.use('/api/brand/', brandRouter);

=======
>>>>>>> 0daee0d (fist commit of backend ecommerce application website)

app.use(notFound);
app.use(errorHander);


app.listen(PORT, ()=>{
    console.log(`server is running on port ${PORT}`);
})