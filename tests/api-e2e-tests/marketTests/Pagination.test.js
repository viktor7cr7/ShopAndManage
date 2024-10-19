import { expect, test } from "playwright/test";
import { loginUser } from "../../utils/auth";

test.describe('Пагинация страниц', () => {

    test('Проверка пагинации', async ({request}) => {

        const cookies = await loginUser('test-email@mail.ru', 'BETejEmm321')
        const cookieHeader = cookies.join('; ')
        let products
        let getProducts = await request.get('/api/v1/products?page=2', {
            headers: {
                'Cookie': cookieHeader
            }
        })

        expect(getProducts.status()).toBe(200);
        ({products} = await getProducts.json())

         expect(products.length).toBe(8)

        getProducts = await request.get('/api/v1/products?page=1', {
            headers: {
                'Cookie': cookieHeader
            }
        })

        expect(getProducts.status()).toBe(200);
        ({products} = await getProducts.json())

         expect(products.length).toBe(10)
    })
})