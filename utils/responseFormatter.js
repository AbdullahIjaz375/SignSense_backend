// utils/responseFormatter.js

/**
 * Formats and sends a JSON response with a consistent structure.
 * @param {Response} res - The Express response object.
 * @param {number} statusCode - HTTP status code.
 * @param {any} data - The response data.
 * @param {string} message - Optional message.
 */
function sendResponse(res, statusCode, data, message = '') {
  const response = {
    message,
    data,
  };

  res.status(statusCode).json(response);
}

module.exports = sendResponse;
