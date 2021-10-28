const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const postRouter = require('./router/posts')
const UserRouter = require('./router/user')



const app = express();

mongoose.connect("mongodb+srv://preet:"+ process.env.MONGO_ATLAS_PW +"@cluster0.mctoz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: true
    })
    .then(() => {
        console.log("connected to database successfully");
    })
    .catch((err) => {
        console.log(`connected to database failed: ${err}`);
    })

app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use("/images", express.static(path.join("backend/images")))


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', "*");
    res.setHeader('Access-Control-Allow-Headers',
        "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.setHeader("Access-Control-Allow-Methods",
        "GET, POST, PATCH, PUT, DELETE, OPTIONS");
    next();
})

app.use("/api/post", postRouter);
app.use("/api/user", UserRouter);

module.exports = app