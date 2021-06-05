const jwt = require('jsonwebtoken');
const Student = require('../../models/student/student');

// handle error
const handleError = (err) => {
    const errors = { emailOrId: '', password: '' };

    // duplicate error code
    if (err.code === 11000) {
        errors.emailOrId = 'This Email Or Id is already registered';
        return errors;
    }

    // incorrect email
    if (err.message === 'incorrect email') {
        errors.emailOrId = 'this email is not registered';
        return errors;
    }

    // incorrect password
    if (err.message === 'incorrect password') {
        errors.password = 'wrong password';
        return errors;
    }

    // validation error
    if (err.message.includes('students validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        });
    }

    return errors;
};

// create token
const maxAge = 30 * 24 * 60 * 60;

const createToken = (id) => jwt.sign({ id }, process.env.secret, {
        expiresIn: maxAge,
    });

exports.studentSignup = async (req, res) => {
    const { user, name, email, studentId, password, batch, semester } = req.body;
    try {
        const student = await Student.create({
            user,
            name,
            email,
            studentId,
            password,
            batch,
            semester,
        });
        const token = createToken(student.id);
        res.cookie('jwt', token, {
            maxAge: maxAge * 1000,
            httpOnly: true,
        });
        res.status(201).json({
            token,
            student: student.id,
        });
    } catch (err) {
        const errors = handleError(err);
        res.status(400).send(errors);
    }
};

exports.studentLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const student = await Student.login(email, password);
        const token = createToken(student.id);
        res.cookie('jwt', token, {
            maxAge: maxAge * 1000,
            httpOnly: true,
        });
        res.status(200).send({
            userId: student.id,
            token,
        });
    } catch (err) {
        const errors = handleError(err);
        res.status(400).send({ errors });
    }
};

exports.studentList = async (req, res) => {
    const filter = req.body;
    try {
        await Student.find(filter, (err, student) => {
            if (err) {
                res.status(500).json({
                    error: 'Something went wrong',
                });
            } else {
                res.status(200).json({
                    users: student,
                });
            }
        });
    } catch (err) {
        res.status(401).json({
            message: 'Something went wrong',
            error: err,
        });
    }
};
