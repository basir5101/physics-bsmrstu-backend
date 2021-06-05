const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { studentRoute } = require('./routes/student/studentRoute');
require('dotenv').config();

const app = express();
// middleware
app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send('Welcome to physics-bsmrstu');
});

// connect to mongodb
mongoose
    .connect(process.env.DATABASE, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
    })
    .then(() => console.log('DB Connected'));
// routes
app.use('/student', studentRoute);

// starting server

try {
    app.listen(process.env.PORT || 3000, () => {
        console.log(
            `Server Started on ${process.env.PORT}. Visit http://localhost:${process.env.PORT}`
        );
    });
} catch (err) {
    console.log('Creating Server');
}
