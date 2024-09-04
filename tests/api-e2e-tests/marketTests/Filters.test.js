import { expect, test } from "playwright/test";
import { loginUser } from "../../utils/auth";

test.describe('Фильтрация товаров', () => {

    test.skip('Фильтрация по поиску', async ({request}) => {

        const cookie = await loginUser('victor@mail.ru', 'BETejEmm321')
        const cookieHeader = cookie.join('; ')

        const getProductsBySearch = await request.get('/api/v1/products?search=смартфон', {
            headers: {
                'Cookie': cookieHeader
            }
        })

        expect(getProductsBySearch.status()).toBe(200)

        const {totalProducts, products} = await getProductsBySearch.json()
        expect(+totalProducts).toBe(2)
        const toMatchProducts = products.every(product => product.name.includes('Смартфон'))
        expect(toMatchProducts).toBe(true)

    })

    test.skip('Фильтрация по категории', async ({request}) => {

        const cookie = await loginUser('victor@mail.ru', 'BETejEmm321')
        const cookieHeader = cookie.join('; ')

        const getProductsBySearch = await request.get('/api/v1/products?category=Электроника', {
            headers: {
                'Cookie': cookieHeader
            }
        })

        expect(getProductsBySearch.status()).toBe(200)

        const {totalProducts, products} = await getProductsBySearch.json()
        expect(+totalProducts).toBe(9)
        const toMatchProducts = products.every(product => product.category.includes('Электроника'))
        expect(toMatchProducts).toBe(true)

    })

    test.skip('Фильтрация по ценовому диапазону', async ({request}) => {

        const cookie = await loginUser('victor@mail.ru', 'BETejEmm321')
        const cookieHeader = cookie.join('; ')

        const getProductsBySearch = await request.get('/api/v1/products?minPrice=1000&maxPrice=10000', {
            headers: {
                'Cookie': cookieHeader
            }
        })

        expect(getProductsBySearch.status()).toBe(200)

        const {totalProducts, products} = await getProductsBySearch.json()
        expect(+totalProducts).toBe(8)
        const toMatchProducts = products.every(product => +product.new_price
            <=10000 && +product.new_price >= 1000)  
        expect(toMatchProducts).toBe(true)

    })

    test.skip('Сортировка по цене (по возрастанию) ', async ({request}) => {

        const cookie = await loginUser('victor@mail.ru', 'BETejEmm321')
        const cookieHeader = cookie.join('; ')

        const getProductsBySearch = await request.get('/api/v1/products?sort=price:asc', {
            headers: {
                'Cookie': cookieHeader
            }
        })

        expect(getProductsBySearch.status()).toBe(200)

        const {products} = await getProductsBySearch.json()

        const toMatchProducts = products.every((product, index) => {
            if (index + 1 === products.length) return true
            console.log(index)
         return product.new_price <= products[index + 1].new_price
        })

        expect(toMatchProducts).toBe(true)

    })

    test.skip('Сортировка по цене (по убыванию) ', async ({request}) => {

        const cookie = await loginUser('victor@mail.ru', 'BETejEmm321')
        const cookieHeader = cookie.join('; ')

        const getProductsBySearch = await request.get('/api/v1/products?sort=price:desc', {
            headers: {
                'Cookie': cookieHeader
            }
        })

        expect(getProductsBySearch.status()).toBe(200)

        const {products} = await getProductsBySearch.json()

        const toMatchProducts = products.every((product, index) => {
            if (index + 1 === products.length) return true
            console.log(index)
            return product.new_price >= products[index + 1].new_price

        })

        expect(toMatchProducts).toBe(true)

    })

    test.skip('Сортировка по рейтингу (по возрастанию) ', async ({request}) => {

        const cookie = await loginUser('victor@mail.ru', 'BETejEmm321')
        const cookieHeader = cookie.join('; ')

        const getProductsBySearch = await request.get('/api/v1/products?sort=rating:asc&page=2', {
            headers: {
                'Cookie': cookieHeader
            }
        })

        expect(getProductsBySearch.status()).toBe(200)

        const {products} = await getProductsBySearch.json()

        const toMatchProducts = products.every((product, index) => {
            console.log(product.rating)
            if (index + 1 === products.length) return true
         return product.rating <= products[index + 1].rating
        })

        expect(toMatchProducts).toBe(true)

    })

    test.skip('Сортировка по рейтингу (по убыванию) ', async ({request}) => {

        const cookie = await loginUser('victor@mail.ru', 'BETejEmm321')
        const cookieHeader = cookie.join('; ')

        const getProductsBySearch = await request.get('/api/v1/products?sort=rating:desc&page=1', {
            headers: {
                'Cookie': cookieHeader
            }
        })

        expect(getProductsBySearch.status()).toBe(200)

        const {products} = await getProductsBySearch.json()

        const toMatchProducts = products.every((product, index) => {
        if (index + 1 === products.length) return true
         return product.rating >= products[index + 1].rating
        })

        expect(toMatchProducts).toBe(true)

    })
})