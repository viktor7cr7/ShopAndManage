import { dbConnect, dbConnectAdmin } from '../dbConnect.js';
import {
    BadRequestError,
    ErrorFromDataBase,
    UnauthenticatedError,
} from '../errors/customError.js';
import { comparePassword, hashPasswords } from '../utils/passwordUtils.js';
import { StatusCodes } from 'http-status-codes';
import { createJWT } from '../utils/tokenUtils.js';
import crypto from 'crypto'
import sendVerificationEmail from '../utils/sendVerificationEmail.js';
import hashString from '../utils/createHash.js';
import sendResetPassswordEmail from '../utils/sendResetPassword.js';


export async function createUser(req, res, next) {
    const { email, password, name } = req.body;

    const hashedPassword = await hashPasswords(password);
    const verificationToken = crypto.randomBytes(40).toString('hex');
    const origin = process.env.ORIGIN_URL ? `${process.env.ORIGIN_URL}/verify-email/user` : 'http://localhost:5173/verify-email/user';
    try {

        const checkUser = dbConnect.oneOrNone('SELECT id, isverified from users where email = $1', [email])

        if (!checkUser) {
            return next(new BadRequestError('Пользователь с данным email уже зарегестрирован'))
        }

        const result = await dbConnect.tx(async (t) => {
            const user = await t.one(
                'INSERT INTO users (email, password, name , verificationtoken) VALUES($1, $2, $3, $4) RETURNING id, email, referral_code',
                [email, hashedPassword, name, verificationToken]
            );
            await t.none(
                'INSERT INTO balances (user_id, currency, amount) VALUES ($1, $2, $3)',
                [user.id, 'rub', 0.00]
            );
            return user
        });

        sendVerificationEmail({email, verificationToken, origin, name})
        
        res.status(StatusCodes.CREATED).json({
                msg: 'Успешная регистрация! Подтвердите адрес электронной почты!',
        })
    } catch (error) {
        return next(new ErrorFromDataBase(error.message));
    }
}

export const verifyEmailUser = async (req, res, next) => {
    const { token, email } = req.query;
    const user = await dbConnect.oneOrNone('SELECT * from users where email = $1', [email]);
    if (!user) {
      return next(new UnauthenticatedError('Verification Failed'))
    }
  
    if (user.verificationtoken !== token) {
        return next(new UnauthenticatedError('Verification Failed'))
    }

    await dbConnect.none('UPDATE users SET verificationtoken = $1, verified = $2, isverified = $3', ['', new Date(), true])
  
    res.status(StatusCodes.OK).json({ msg: 'Email Verified' });
  };

export async function loginUser(req, res, next) {
    const { email, password } = req.body;
    const user = await dbConnect.oneOrNone(
        'SELECT * from users where email=$1',
        [email]
    );
    const isValidUser =
        user && (await comparePassword(password, user.password));

        if (!isValidUser)
        return next(new UnauthenticatedError('Неверные данные!'));

    if (!user?.isverified) {
            return next(new BadRequestError('Подтвердите адрес электронной почты!'))
        }
 

    const token = createJWT({ userId: user.id, email: user.email, name:user.name });

    const oneDay = 1000 * 60 * 60 * 24;

    res.cookie('token', token, {
        httpOnly: true,
        expires: new Date(Date.now() + oneDay),
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    });

    res.status(StatusCodes.OK).json({ msg: 'Успешный вход' });
}

export const forgotPassword = async (req, res, next) => {
    const { email } = req.body;
    if (!email) {
      return next(new BadRequestError('Укажите емайл'))
    }
  
    const user  = await dbConnect.oneOrNone(
        'SELECT * from users where email=$1',
        [email]
    );



    if (!user) {
        return next(new BadRequestError('Аккаунта с данным email нет в системе'))
    }
  
    if (user) {
      const passwordToken = crypto.randomBytes(70).toString('hex');
      const origin =  process.env.ORIGIN_URL ? `${process.env.ORIGIN_URL}/reset-password/user` : 'http://localhost:5173/reset-password/user';
      await sendResetPassswordEmail({
        name: user.name,
        email: user.email,
        token: passwordToken,
        origin,
      });
  
      const tenMinutes = 1000 * 60 * 10;
      const passwordTokenExpirationDate = new Date(Date.now() + tenMinutes);
  
      await dbConnect.none('UPDATE users SET password_token = $1, password_token_expiration_date = $2 where email = $3', [hashString(passwordToken), passwordTokenExpirationDate, email])
    }
  
    res
      .status(StatusCodes.OK)
      .json({ msg: 'Пожалуйста проверьте свою почту для сброса пароля' });
  };

  export const forgotPasswordAdmin = async (req, res, next) => {
    const { email } = req.body;
    if (!email) {
      return next(new BadRequestError('Укажите емайл'))
    }
  
    const user  = await dbConnectAdmin.oneOrNone(
        'SELECT * from users where email=$1',
        [email]
    );

    if (!user) {
        return next(new BadRequestError('Аккаунта с данным email нет в системе'))
    }
  
    if (user) {
      const passwordToken = crypto.randomBytes(70).toString('hex');
      const origin =  process.env.ORIGIN_URL ? `${process.env.ORIGIN_URL}/reset-password/admin` : 'http://localhost:5173/reset-password/admin';
      await sendResetPassswordEmail({
        name: user.name,
        email: user.email,
        token: passwordToken,
        origin,
      });
  
      const tenMinutes = 1000 * 60 * 10;
      const passwordTokenExpirationDate = new Date(Date.now() + tenMinutes);
  
      await dbConnectAdmin.none('UPDATE users SET password_token = $1, password_token_expiration_date = $2 where email = $3', [hashString(passwordToken), passwordTokenExpirationDate, email])
    }
  
    res
      .status(StatusCodes.OK)
      .json({ msg: 'Пожалуйста проверьте свою почту для сброса пароля' });
  };

  export const resetPassword = async (req, res, next) => {
    const { password, token, email } = req.body;
    if (!token || !email || !password) {
      return next(new BadRequestError('Пожалуйста укажите все значения'))
    }

    try {
        const user  = await dbConnect.oneOrNone(
            'SELECT * from users where email=$1',
            [email]
        );
    
        if (!user) {
            return next(new BadRequestError('Аккаунта с данным email нет в системе'))
        }
        if (user) {
          const currentDate = new Date();
      
          if (
            user.password_token === hashString(token) &&
            user.password_token_expiration_date > currentDate
          ) {
            const hashedPassword = await hashPasswords(password);
            await dbConnect.none('UPDATE users SET password = $1, password_token = $2, password_token_expiration_date = $3 where email = $4', [hashedPassword, null, null, email])
            res.status(StatusCodes.OK).json({msg: 'успех'});
          }

        res.status(StatusCodes.BAD_REQUEST).json({msg: 'Данные устарели'})
        }
    } catch (error) {
        return next(new ErrorFromDataBase(error.message))
    }
  };

  export const resetPasswordAdmin = async (req, res, next) => {
    const { password, token, email } = req.body;
    if (!token || !email || !password) {
      return next(new BadRequestError('Пожалуйста укажите все значения'))
    }

    try {
        const user  = await dbConnectAdmin.oneOrNone(
            'SELECT * from users where email=$1',
            [email]
        );
    
        if (!user) {
            return next(new BadRequestError('Аккаунта с данным email нет в системе'))
        }
        if (user) {
          const currentDate = new Date();
      
          if (
            user.password_token === hashString(token) &&
            user.password_token_expiration_date > currentDate
          ) {
            const hashedPassword = await hashPasswords(password);
            await dbConnectAdmin.none('UPDATE users SET password = $1, password_token = $2, password_token_expiration_date = $3 where email = $4', [hashedPassword, null, null, email])
            res.status(StatusCodes.OK).json({msg: 'Пароль успешно обновлен'});
          }

        res.status(StatusCodes.BAD_REQUEST).json({msg: 'Данные устарели, запросите восстановление пароля ещё раз'})
        }
    } catch (error) {
        return next(new ErrorFromDataBase(error.message))
    }
  };
  

export async function logoutUser(req, res, next) {
    res.cookie('token', 'logout', {
        httpOnly: true,
        expires: new Date(Date.now()),
    });
    res.status(StatusCodes.OK).json({ msg: 'Успех' });
}

export async function createAdminUser(req, res, next) {
    const { name, email, password } = req.body;
    const hashedPassword = await hashPasswords(password);
    const verificationToken = crypto.randomBytes(40).toString('hex');
    const origin = process.env.ORIGIN_URL ? `${process.env.ORIGIN_URL}/verify-email/user` : 'http://localhost:5173/verify-email/admin'
    try {
        const checkUser = await dbConnectAdmin.oneOrNone('SELECT * from users where email = $1', [email])
        if (!checkUser) {
            next(new BadRequestError('Пользователь с данным email уже зарегестрирован'));
        }
        const user = await dbConnectAdmin.one(
            'INSERT INTO users(name, email, password, verificationtoken) VALUES($1, $2, $3, $4) RETURNING name, email, password',
            [name, email, hashedPassword, verificationToken]
        );

        sendVerificationEmail({email, verificationToken, origin, name})
        
        if (user) {
            res.status(StatusCodes.CREATED).json({
                msg: 'Успешная регистрация! Подтвердите адрес электронной почты!',
            });
        }
    } catch (error) {
        next(new ErrorFromDataBase(error.message));
    }
}

export const verifyEmailAdmin = async (req, res, next) => {
    const { token, email } = req.query;
    const user = await dbConnectAdmin.oneOrNone('SELECT * from users where email = $1', [email]);
    if (!user) {
      return next(new UnauthenticatedError('Verification Failed'))
    }
  
    if (user.verificationtoken !== token) {
        return next(new UnauthenticatedError('Verification Failed'))
    }

    await dbConnectAdmin.none('UPDATE users SET verificationtoken = $1, verified = $2, isverified = $3', ['', new Date(), true])
  
    res.status(StatusCodes.OK).json({ msg: 'Успех' });
  };

export async function loginUserAdmin(req, res, next) {
    const { email, password } = req.body;
    const adminUser = await dbConnectAdmin.oneOrNone(
        'SELECT * from users where email=$1',
        [email]
    );

    const isValidUser =
    adminUser && (await comparePassword(password, adminUser.password));
    

    if (!isValidUser)
    return next(new UnauthenticatedError('Неверные данные!'));

if (!adminUser?.isverified) {
        return next(new BadRequestError('Подтвердите адрес электронной почты!'))
    }

    const token = createJWT({
        authorId: adminUser.author_id,
        authorName: adminUser.name,
        email: adminUser.email,
    });

    const oneDay = 1000 * 60 * 60 * 24;

    res.cookie('token', token, {
        httpOnly: true,
        expires: new Date(Date.now() + oneDay),
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    });

    res.status(StatusCodes.OK).json({ msg: 'Успешный вход' });
}

export async function getCurrentAdminUser (req, res)  {
    const {authorId} = req.user
    const user = await dbConnectAdmin.one('SELECT author_id, name, email, avatar from users where author_id = $1', [authorId])
    res.status(StatusCodes.OK).json({user})
}
