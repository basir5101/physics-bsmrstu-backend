const { Router } = require('express');
const {
    studentSignup,
    studentLogin,
    studentList,
} = require('../../controllers/student/studentController');
const authMiddleware = require('../../middleware/authMiddleware');

const studentRoute = Router();

studentRoute.post('/', studentList);
studentRoute.post('/signup', studentSignup);
studentRoute.post('/login', studentLogin);

module.exports = { studentRoute };
