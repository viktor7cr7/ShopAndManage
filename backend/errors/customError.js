import { StatusCodes } from 'http-status-codes';

export class BadRequestError extends Error {
    constructor(message) {
        super(message);
        this.name = 'BadRequestError';
        this.StatusCode = StatusCodes.BAD_REQUEST;
    }
}

export class ErrorFromDataBase extends Error {
    constructor(message) {
        super(message);
        this.name = 'DataBaseError';
        this.StatusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    }
}

export class UnauthenticatedError extends Error {
    constructor(message) {
        super(message);
        this.name = 'UnauthenticatedError';
        this.StatusCode = StatusCodes.UNAUTHORIZED;
    }
}

export class UnauthorizedError extends Error {
    constructor(message) {
        super(message);
        this.name = 'UnauthorizedError';
        this.StatusCode = StatusCodes.FORBIDDEN;
    }
}
