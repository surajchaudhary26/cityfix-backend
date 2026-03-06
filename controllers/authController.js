const util = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/AppError');

// Helper function to create the "Digital ID Card" (JWT)
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

exports.signup = async (req, res, next) => {
  try {
    // 1. Create the new user in MongoDB
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      role: req.body.role // Optional: default is 'citizen'
    });

    // 2. Generate the Token
    const token = signToken(newUser._id);

    // 3. Send response (hide password from output)
    newUser.password = undefined;

    res.status(201).json({
      status: 'success',
      token,
      data: {user: newUser}
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1. Check if email and password exist in the request
    if (!email || !password) {
      return next(new AppError('Please provide email and password!', 400));
    }

    // 2. Find the user and explicitly select the password field
    // (Remember: we set select: false in the Model, so we must ask for it here)
    const user = await User.findOne({ email }).select('+password');

    // 3. Check if user exists AND password is correct
    // We will create the 'correctPassword' method in the next step
    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError('Incorrect email or password', 401));
    }

    // 4. If everything is okay, send token to client
    const token = signToken(user._id);

    res.status(200).json({
      status: 'success',
      token
    });
  } catch (err) {
    next(err);
  }
};

const { promisify } = require('util');
exports.protect = async (req, res, next) => {
  try {
    let token;
    // 1. Check if token exists in the headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('You are not logged in! Please log in to get access.', 401));
    }

    // 2. Verification of token
    // This checks if the secret is correct and if the token has expired
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3. Check if user still exists (Optional but professional)
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(new AppError('The user belonging to this token no longer exists.', 401));
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next();
  } catch (err) {
    next(err);
  }
};

// This middleware factory restricts access to specific roles
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // req.user was set by the 'protect' middleware right before this
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};