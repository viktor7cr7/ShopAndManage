import { expect,test } from "playwright/test";
import { loginAdmin } from "../../utils/auth";
import { createProduct } from "../../utils/CRUDProduct";
import { dbConnectAdmin } from "../../../backend/dbConnect";

test('Удаление продукта', async ({request}) => {

    const cookie = await loginAdmin('test-email@mail.ru', 'BETejEmm321')
    const cookieHeader = cookie.join('; ')

    const {product_id} = await createProduct()

    const checkAddingProduct = await dbConnectAdmin.one('SELECT * from products where product_id = $1', [product_id])
    expect(checkAddingProduct).toBeTruthy()

    const response = await request.delete(`/api/v1/admin/product/${product_id}`, {
        headers: {
            'Cookie': cookieHeader
        }
    })

    const {msg} = await response.json()
    expect(msg).toBe('Товар успешно удалён')

    const checkingProductEmpty = await dbConnectAdmin.oneOrNone('SELECT * from products where product_id = $1', [product_id])
    expect(checkingProductEmpty).toBe(null)

})