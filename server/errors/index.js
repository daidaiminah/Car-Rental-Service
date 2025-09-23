class CustomAPIError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}

class BadRequestError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}

class UnauthenticatedError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}

class UnauthorizedError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = 403; // 403 Forbidden is typically used for unauthorized access
  }
}

class ForbiddenError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = 403;
  }
}

class NotFoundError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
}

class ConflictError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = 409;
  }
}

export {
  CustomAPIError,
  BadRequestError,
  UnauthenticatedError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError
};
