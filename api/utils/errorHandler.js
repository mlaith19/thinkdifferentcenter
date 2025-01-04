const handleError = (error) => {
  let errorMessage = 'Something went wrong';
  let statusCode = 500;
  let errorDetails = {};

  // Map error types to their respective handlers
  const errorHandlers = {
    SequelizeUniqueConstraintError: () => {
      statusCode = 400; // Bad request for unique constraint errors
      errorMessage = 'Duplicate entry error';
      errorDetails = {
        field: error.errors[0].path,
        value: error.errors[0].value,
        message: error.errors[0].message,
      };
    },
    SequelizeValidationError: () => {
      statusCode = 400;
      errorMessage = 'Validation error';
      errorDetails = error.errors.map(err => ({
        field: err.path,
        message: err.message,
      }));
    },
    SequelizeDatabaseError: () => {
      statusCode = 500;
      errorMessage = 'Database error';
      errorDetails = { message: error.message };
    },
    ValidationError: () => {
      statusCode = 400;
      errorMessage = 'Validation error';
      errorDetails = { message: error.message };
    },
    SyntaxError: () => {
      statusCode = 400;
      errorMessage = 'Bad request syntax';
      errorDetails = { message: error.message };
    },
    default: () => {
      // Catch generic JavaScript errors
      statusCode = 500;
      errorMessage = error.message || errorMessage;
      errorDetails = { stack: error.stack };
    },
  };

  // Use the appropriate handler based on the error type
  const handler = errorHandlers[error.name] || errorHandlers.default;
  handler();

  // Make error response object uniform and reusable
  return {
    statusCode,
    errorMessage,
    errorDetails,
  };
};

module.exports = { handleError };