// The 4 parameters (err, req, res, next) tell Express this is an Error Handler
const errorHandler = (err, req, res, next) => {
    // If the error doesn't have a status code yet, default to 500 (Internal Server Error)
    err.statusCode = err.statusCode || 500;
    // Default the status to 'error' if it isn't set
    err.status = err.status || 'error';

    // DEVELOPMENT MODE: Give us all the details so we can debug!
    if (process.env.NODE_ENV === 'development') {
        res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack // This is the exact file and line number where it broke
        });
    } 
    // PRODUCTION MODE: Hide the exact code details from the public
    else if (process.env.NODE_ENV === 'production') {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    }
};

// Export the net so our server can use it
module.exports = (err, req, res, next) => {
  // ⭐ FIX: If err.statusCode is undefined, default to 500 (Internal Server Error)
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Professional SDE tip: Log the error to your console so you can see WHAT failed
  console.error('ERROR 💥:', err);

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    // Include stack trace only in development mode
    stack: err.stack
  });
};