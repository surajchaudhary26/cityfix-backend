class AppError extends Error {
    constructor(message, statusCode) {
        // 'super' calls the built-in JavaScript Error, passing it our message
        super(message); 

        // Now we attach our custom status code (e.g., 404, 400)
        this.statusCode = statusCode;
        
        // If the code starts with a 4 (like 404), mark it as a 'fail'. Otherwise, it's an 'error'.
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';

        // We capture the stack trace so we can see exactly which line of code caused the bug
        Error.captureStackTrace(this, this.constructor);
    }
}

// Export it so other files can use it
module.exports = AppError;