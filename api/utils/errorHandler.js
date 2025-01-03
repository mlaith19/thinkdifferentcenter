const handleError = (error) => {
    let errorMessage = 'Something went wrong';
    let statusCode = 500;
    let errorDetails = {};
  
    // Check for specific Sequelize errors
    if (error.name === 'SequelizeUniqueConstraintError') {
      statusCode = 400; // Bad request for unique constraint errors
      errorMessage = 'Duplicate entry error';
      errorDetails = {
        field: error.errors[0].path,
        value: error.errors[0].value,
        message: error.errors[0].message,
      };
    } else if (error.name === 'SequelizeValidationError') {
      statusCode = 400;
      errorMessage = 'Validation error';
      errorDetails = error.errors.map(err => ({
        field: err.path,
        message: err.message,
      }));
    } else if (error.name === 'SequelizeDatabaseError') {
      statusCode = 500;
      errorMessage = 'Database error';
      errorDetails = { message: error.message };
    } else if (error.name === 'ValidationError') {
      statusCode = 400;
      errorMessage = 'Validation error';
      errorDetails = { message: error.message };
    } else if (error instanceof SyntaxError) {
      statusCode = 400;
      errorMessage = 'Bad request syntax';
      errorDetails = { message: error.message };
    } else if (error instanceof Error) {
      // Catch generic JavaScript errors
      statusCode = 500;
      errorMessage = error.message;
      errorDetails = { stack: error.stack };
    } else {
      // General fallback for unexpected errors
      statusCode = 500;
      errorMessage = error.message || errorMessage;
    }
  
    // Make error response object uniform and reusable
    return {
      statusCode,
      errorMessage,
      errorDetails,
    };
  };
  
  module.exports = { handleError };
  