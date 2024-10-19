import {test, expect} from "playwright/test";
import { deleteAdminByEmail } from "../../utils/dbUtils";

test.describe('Авторизация аккаунта', () => {

    test('Успешная авторизация', async ({ request  }) => {
  
      const dataRegiser = {
          email: 'test-Login@gmail.com',
          password: 'HDSIhgisd@',
        };
    
    let response
    let responseBody
  
    response = await request.post('/api/v1/auth/admin/login', {
        data: dataRegiser,
      });

    expect(response.status()).toBe(200)

    responseBody = await response.json()
    expect(responseBody.msg).toBe("Успешный вход")

    })

    test('Вход с несуществующим email', async ({ request  }) => {
  
        const dataRegiser = {
            email: 'test-Login2@gmail.com',
            password: 'HDSIhgisd@',
          };
      
      let response
      let responseBody
    
      response = await request.post('/api/v1/auth/admin/login', {
          data: dataRegiser,
        });
  
      expect(response.status()).toBe(401)
  
      responseBody = await response.json()
      expect(responseBody.msg).toBe("Неверные данные!")
  
      })

      test('Вход с невалидным email', async ({ request  }) => {
  
        const dataRegiser = {
            email: 'test-Logingmail.com',
            password: 'HDSIhgisd@',
          };
      
      let response
      let responseBody
    
      response = await request.post('/api/v1/auth/admin/login', {
          data: dataRegiser,
        });
  
      expect(response.status()).toBe(400)
  
      responseBody = await response.json()
      expect(responseBody.msg).toBe("Пожалуйста, введите корректный email")
  
      })

      test('Вход с пустым email', async ({ request  }) => {
  
        const dataRegiser = {
            email: '',
            password: 'HDSIhgisd@',
          };
      
      let response
      let responseBody
    
      response = await request.post('/api/v1/auth/admin/login', {
          data: dataRegiser,
        });
  
      expect(response.status()).toBe(400)
  
      responseBody = await response.json()
      expect(responseBody.msg).toMatch(/Email обязателен для заполнения/)
  
      })

      test('Вход с невалидным паролем', async ({ request  }) => {
  
        const dataRegiser = {
            email: 'test-Login@gmail.com',
            password: 'HDSIhgisd',
          };
      
      let response
      let responseBody
    
      response = await request.post('/api/v1/auth/admin/login', {
          data: dataRegiser,
        });
  
      expect(response.status()).toBe(401)
  
      responseBody = await response.json()
      expect(responseBody.msg).toBe("Неверные данные!")
  
      })

      test('Вход с коротким паролем', async ({ request  }) => {
  
        const dataRegiser = {
            email: 'test-Login@gmail.com',
            password: 'HDSIhg',
          };
      
      let response
      let responseBody
    
      response = await request.post('/api/v1/auth/admin/login', {
          data: dataRegiser,
        });
  
      expect(response.status()).toBe(400)
  
      responseBody = await response.json()
      expect(responseBody.msg).toBe("Пароль должен содержать минимум 8 символов")
  
      })

      test('Вход с пустым паролем', async ({ request  }) => {
  
        const dataRegiser = {
            email: 'test-Login@gmail.com',
            password: '',
          };
      
      let response
      let responseBody
    
      response = await request.post('/api/v1/auth/admin/login', {
          data: dataRegiser,
        });
  
      expect(response.status()).toBe(400)
  
      responseBody = await response.json()
      expect(responseBody.msg).toMatch(/Пароль обязателен для заполнения/)
  
      })

      test('Вход с неподтвержденным email', async ({ request  }) => {

        const dataRegiser = {
          name: 'Aleksey',
          email: 'test-gmail@gmail.com',
          password: 'HDSIhgisd@',
        };
        
        try {
      
  
  let response
  let responseBody


 response = await request.post('/api/v1/auth/admin/register', {
  data: dataRegiser,
});

expect(response.status()).toBe(201);

responseBody = await response.json();

expect(responseBody.msg).toBe('Успешная регистрация! Подтвердите адрес электронной почты!');

response = await request.post('/api/v1/auth/admin/login', {
      data: dataRegiser,
  });

  expect(response.status()).toBe(400)

  responseBody = await response.json()
  expect(responseBody.msg).toBe('Подтвердите адрес электронной почты!')

  await deleteAdminByEmail(dataRegiser.email)
        } catch (error) {
          await deleteAdminByEmail(dataRegiser.email)
        }
  
    })
  
})