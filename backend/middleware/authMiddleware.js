import { StatusCodes } from 'http-status-codes';
import { dbConnectAdmin } from '../dbConnect.js';
import {
    ErrorFromDataBase,
    UnauthenticatedError,
    UnauthorizedError,
} from '../errors/customError.js';
import { verifyJWT } from '../utils/tokenUtils.js';

export const authenticateUser = (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        throw new UnauthenticatedError('Authentication invalid');
    }

    try {
        const { userId, email, name } = verifyJWT(token);
        req.user = { userId, email, name };
        next();
    } catch (error) {
        throw new UnauthenticatedError('Authentication invalid');
    }
};

export const authenticateAdmin = (req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
        return next(new UnauthenticatedError('Authentication invalid'))
    }

    try {
        const { authorId, authorName, email } = verifyJWT(token);
        req.user = {authorId, authorName, email };
        next();
    } catch (error) {
        throw new UnauthenticatedError('Authentication invalid');
    }
};

export const checkPermissionActionProduct = async (req, res, next) => {
    const { authorId } = req.user;
    const { id } = req.params;

    try {
        const authorIdProduct = await dbConnectAdmin.oneOrNone(
            'SELECT author_id from products where product_id = $1',
            [id]
        );

        if (!authorId) {
            return res
                .status(StatusCodes.NOT_FOUND)
                .json({ msg: `Товара с id ${id} не существует` });
        }

        if (authorId === authorIdProduct.author_id) {
            return next();
        } else {
            return next(
                new UnauthorizedError(
                    'Вы не можете изменять товары других авторов'
                )
            );
        }
    } catch (error) {
        return next(new ErrorFromDataBase(error.message));
    }
};
