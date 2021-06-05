const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    try {
        // let token = req.headers["authorization"];
        const token = req.header('Authorization').replace('Bearer ', '');
        if (token) {
            jwt.verify(token, process.env.secret, (err, decoded) => {
                if (err) {
                    res.status(401).json({
                        success: false,
                        message: 'Failed to authenticate token',
                        error: err,
                    });
                } else {
                    console.log(decoded);
                    next();
                }
            });
        } else {
            res.status(401).json({
                success: false,
                message: 'No token provided',
            });
        }
    } catch (err) {
        res.status(401).json({
            success: false,
            message: 'Please Login or Signup',
            error: err,
        });
    }
};
