import { body, validationResult } from 'express-validator';
import { BadRequestError } from '../errors/customError.js';

const withValidationErrors = (validationValues) => {
    return [
        validationValues,
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                const errorMessage = errors.array().map((error) => error.msg);
                throw new BadRequestError(errorMessage);
            }
            next();
        },
    ];
};

export const validateRegisterUser = withValidationErrors([
    body('email')
        .isEmail()
        .withMessage('Пожалуйста, введите корректный email')
        .notEmpty()
        .withMessage('Email обязателен для заполнения'),
    body('password')
        .isLength({ min: 8 })
        .withMessage('Пароль должен содержать минимум 8 символов')
        .notEmpty()
        .withMessage('Пароль обязателен для заполнения'),
    body('name')
        .isLength({ min: 2 })
        .withMessage('Имя должно содержать минимум 2 символа')
        .notEmpty()
        .withMessage('Имя обязателно для заполнения'),
]);

export const validateLoginUser = withValidationErrors([
    body('email')
        .isEmail()
        .withMessage('Пожалуйста, введите корректный email')
        .notEmpty()
        .withMessage('Email обязателен для заполнения'),
    body('password')
        .isLength({ min: 8 })
        .withMessage('Пароль должен содержать минимум 8 символов')
        .notEmpty()
        .withMessage('Пароль обязателен для заполнения'),
]);

export const validateUserAdminRegister = withValidationErrors([
    body('email')
        .isEmail()
        .withMessage('Пожалуйста, введите корректный email')
        .notEmpty()
        .withMessage('Email обязателен для заполнения'),
    body('password')
        .isLength({ min: 8 })
        .withMessage('Пароль должен содержать минимум 8 символов')
        .notEmpty()
        .withMessage('Пароль обязателен для заполнения'),
    body('name')
        .isLength({ min: 2 })
        .withMessage('Имя должно содержать минимум 2 символа')
        .notEmpty()
        .withMessage('Имя обязателно для заполнения'),
]);

export const validateUserAdminSystemLogin = withValidationErrors([
    body('email')
        .isEmail()
        .withMessage('Пожалуйста, введите корректный email')
        .notEmpty()
        .withMessage('Email обязателен для заполнения'),
    body('password')
        .isLength({ min: 8 })
        .withMessage('Пароль должен содержать минимум 8 символов')
        .notEmpty()
        .withMessage('Пароль обязателен для заполнения'),
]);

export const validateCreateAdminProduct = withValidationErrors([
    body('name')
        .isLength({ min: 2 })
        .withMessage('Имя товара должно содержать не менее двух символов')
        .notEmpty()
        .withMessage('Имя товара обязательно для заполнения'),
    body('price').notEmpty().withMessage('Цена обязательна для заполнения'),
    body('category')
        .notEmpty()
        .withMessage('Категория обязательна для заполнения'),
]);

