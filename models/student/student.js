const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bycrypt = require('bcrypt');

const studentSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: [true, 'please enter your name'],
        maxLenth: 40,
    },
    email: {
        type: String,
        required: [true, 'plase enter your email'],
        unique: true,
        lowerCase: true,
        validate: [isEmail, 'please enter a valid email'],
    },
    studentId: {
        type: String,
        required: [true, 'please enter your student id'],
        unique: true,
        maxLenth: 20,
    },
    password: {
        type: String,
        required: [true, 'please enter a password'],
        minLength: [6, 'Minimum password length is 6 character'],
    },
    batch: {
        type: String,
        required: [true, 'please select your batch'],
    },
    semester: {
        type: String,
        required: [true, 'please enter your semester'],
    },
});

// fire a function before saving into database
studentSchema.pre('save', async function (next) {
    const salt = await bycrypt.genSalt();
    this.password = await bycrypt.hash(this.password, salt);
    next();
});
// static method to login user
studentSchema.statics.login = async function (email, password) {
    const student = await this.findOne({ email });
    if (student) {
        const auth = await bycrypt.compare(password, student.password);
        if (auth) {
            return student;
        }
        throw Error('incorrect password');
    }
    throw Error('incorrect email');
};

const Student = mongoose.model('students', studentSchema);
module.exports = Student;
