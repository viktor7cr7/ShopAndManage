import { test, expect } from '@playwright/test';
import { dbConnect } from '../../../backend/dbConnect';
import { deleteUserByEmail } from '../../utils/dbUtils';

test.describe('Регистрация пользователя + активация аккаунта через письмо', () => {

  test('Успешная регистрация', async ({ request  }) => {

    const dataRegiser = {
        name: 'Aleksey',
        email: 'test-gmail@gmail.com',
        password: 'HDSIhgisd@',
      };
  
      try {
        let response
        let responseBody
        let isverified, verificationtoken;
      
         response = await request.post('/api/v1/auth/register', {
          data: dataRegiser,
        });
      
        expect(response.status()).toBe(201);
      
        responseBody = await response.json();
      
        expect(responseBody.msg).toBe('Успешная регистрация! Подтвердите адрес электронной почты!');
      
       ({isverified, verificationtoken} = await dbConnect.one('SELECT isverified, verificationtoken from users where email = $1', [dataRegiser.email]))
        expect(isverified).toBe(false)
        expect(verificationtoken).toBeTruthy()
        expect(typeof verificationtoken).toBe('string')
      
        response = await request.post(`/api/v1/auth/verify-email/user?token=${verificationtoken}&email=${dataRegiser.email}`)
        expect(response.status()).toBe(200)
        
       responseBody = await response.json();
       expect(responseBody.msg).toBe('Email Verified');
      
      ({isverified, verificationtoken} = await dbConnect.one('SELECT isverified, verificationtoken from users where email = $1', [dataRegiser.email]))
      expect(isverified).toBe(true)
      expect(verificationtoken).toBeFalsy()
      
      await deleteUserByEmail(dataRegiser.email)
      } catch (error) {
        await deleteUserByEmail(dataRegiser.email)
      }

})

  test('Регистрация с некорректным email', async ({ request }) => {

    const dataRegiser =  {
        name: 'Aleksey',
        email: 'test-gmailgmail.com',
        password: 'HDSIhgisd@',
      };

    const response = await request.post('/api/v1/auth/register', {data:dataRegiser
    })

    expect(response.status()).toBe(400)

    const responseBody = await response.json()
    expect(responseBody.msg).toBe('Пожалуйста, введите корректный email')
})

test('Регистрация с пустым email', async ({ request }) => {

    const dataRegiser =  {
        name: 'Aleksey',
        email: '',
        password: 'HDSIhgisd@',
      };

    const response = await request.post('/api/v1/auth/register', {data:dataRegiser
    })

    expect(response.status()).toBe(400)

    const responseBody = await response.json()
    expect(responseBody.msg).toMatch(/Email обязателен для заполнения/)
})

test('Регистрация с коротким паролем', async ({ request }) => {

    const dataRegiser =  {
        name: 'Aleksey',
        email: 'test-gmail@gmail.com',
        password: 'HDS',
      };

    const response = await request.post('/api/v1/auth/register', {data:dataRegiser
    })

    expect(response.status()).toBe(400)

    const responseBody = await response.json()
    expect(responseBody.msg).toBe('Пароль должен содержать минимум 8 символов')
})

test('Регистрация с пустым паролем', async ({ request }) => {

    const dataRegiser =  {
        name: 'Aleksey',
        email: 'test-gmail@gmail.com',
        password: '',
      };

    const response = await request.post('/api/v1/auth/register', {data:dataRegiser
    })

    expect(response.status()).toBe(400)

    const responseBody = await response.json()
    expect(responseBody.msg).toMatch(/Пароль обязателен для заполнения/)
})

test('Регистрация с коротким именем', async ({ request }) => {

    const dataRegiser =  {
        name: 'A',
        email: 'test-gmail@gmail.com',
        password: 'HDSIhgisd@',
      };

    const response = await request.post('/api/v1/auth/register', {data:dataRegiser
    })

    expect(response.status()).toBe(400)

    const responseBody = await response.json()
    expect(responseBody.msg).toBe('Имя должно содержать минимум 2 символа')
})

test('Регистрация с пустым именем', async ({ request }) => {

    const dataRegiser =  {
        name: '',
        email: 'test-gmail@gmail.com',
        password: 'HDSIhgisd@',
      };

    const response = await request.post('/api/v1/auth/register', {data:dataRegiser
    })

    expect(response.status()).toBe(400)

    const responseBody = await response.json()
    expect(responseBody.msg).toMatch(/Имя обязателно для заполнения/)
})

test('Регистрация аккаунта с уже зарегистрированным email', async ({ request  }) => {

    const dataRegiser = {
        name: 'Aleksey',
        email: 'test-gmail@gmail.com',
        password: 'HDSIhgisd@',
      };
  
      try {
        let response
        let responseBody
      
         response = await request.post('/api/v1/auth/register', {
          data: dataRegiser,
        });
      
        expect(response.status()).toBe(201);
      
        responseBody = await response.json();
      
        expect(responseBody.msg).toBe('Успешная регистрация! Подтвердите адрес электронной почты!');
      
        response = await request.post('/api/v1/auth/register', {
          data: dataRegiser,
        });
      
        responseBody = await response.json();
      
        expect(responseBody.msg).toBe('Пользователь с данным email уже зарегистрирован');
      
      await deleteUserByEmail(dataRegiser.email)
      } catch (error) {
        await deleteUserByEmail(dataRegiser.email)
      }

})

});