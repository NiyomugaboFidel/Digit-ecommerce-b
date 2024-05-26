const mongoose = require('mongoose');
const dbConnect = () =>{
    const conn = mongoose.connect(process.env.MONGO_DB_URL)
    .then(()=>{
        console.log('Database connected successfully');

    })
    .catch((err)=>{

       console.log('Failed to connect to db');
       throw new err.message
    })
}


module.exports = dbConnect;