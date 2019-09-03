const express = require('express');
const app = express();
const mongoose = require('mongoose')
const dotenv = require('dotenv')
//Rotas
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');

const bodyParser = require('body-parser')
dotenv.config();

//Conectar ao bd
mongoose.connect(
    process.env.DB_CONNECT,
    { useNewUrlParser: true },
    () => console.log('connected to db')
);

//Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Middleware de Rotas
app.use('/api/user', authRoute);
app.use('/api/posts', postRoute);

app.listen(4100, () => { console.log('server up and running on port 4100') });
