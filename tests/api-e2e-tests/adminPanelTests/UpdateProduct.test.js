import { expect, test } from "playwright/test";
import fs from 'fs'
import path, {basename, dirname} from "path";
import { fileURLToPath } from "url";
import { createProduct } from "../../utils/CRUDProduct";
import { loginAdmin } from "../../utils/auth";
import { deleteProduct } from "../../utils/CRUDProduct";
import { dbConnectAdmin } from "../../../backend/dbConnect";

test('Обновление данных товара', async ({request}) => {

    const dataUpdateProduct = {
        name: 'Тестовый товар',
        price: 250000,
        description: 'Описание тестового товара',
        category: 'Книги',
        stock_quantity: 100
    }

    try {
        const {product_id} = await createProduct()

        const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';

    
        const __filename = fileURLToPath(import.meta.url)
        const __dirname = dirname(__filename)
        const imagePath = path.resolve(__dirname, '../../testData/imgUserPanel/updateAvatar.jpg')
    
        if (!fs.existsSync(imagePath)) {
            console.error('Файл не найден:', imagePath);
            process.exit(1); // выходим, если файл не найден
        }
    
    
        let body = ''
    
        for (const key in dataUpdateProduct) {
            if (dataUpdateProduct.hasOwnProperty(key)) {
                body += `--${boundary}\r\n`
                body += `Content-Disposition: form-data; name="${key}"\r\n\r\n`
                body += `${dataUpdateProduct[key]}\r\n`
            }
        }
    
        const imageContent = fs.readFileSync(imagePath)
        body += `--${boundary}\r\n`
        body += `Content-Disposition: form-data; name="file"; filename="${basename(imagePath)}"\r\n`
        body += `Content-Type: img/jpg\r\n\r\n`
    
        const bodyBuffer = Buffer.concat([
            Buffer.from(body, 'utf-8'),
            imageContent,
            Buffer.from(`\r\n--${boundary}--\r\n`, 'utf-8')
        ])
    
        const cookies = await loginAdmin('test-email@mail.ru', 'BETejEmm321');
        const cookieHeader = cookies.join('; ');
    
        const response = await request.patch(`/api/v1/admin/product/${product_id}`, {
            data: bodyBuffer,
            headers: {
                'Cookie': cookieHeader,
                'Content-Type': `multipart/form-data; charset=UTF-8; boundary=${boundary}`
            }
        })
        const {msg} = await response.json()
        expect(msg).toBe('Данные успешно обновлены')
    
        const {name, price, stock_quantity, description, category, image_url} = await dbConnectAdmin.one('SELECT product_id, name, price, stock_quantity, description, category, image_url from products where name = $1', dataUpdateProduct.name)
    
        expect(name).toBe(dataUpdateProduct.name)
        expect(price).toBe(dataUpdateProduct.price)
        expect(stock_quantity).toBe(dataUpdateProduct.stock_quantity)
        expect(description).toBe(dataUpdateProduct.description)
        expect(category).toBe(dataUpdateProduct.category)
        expect(image_url).toBeTruthy()
        expect(image_url).toMatch(/https:\/\/res.cloudinary.com/)
    
        await deleteProduct(dataUpdateProduct.name)
    } catch (error) {
        await deleteProduct(dataUpdateProduct.name)
    }
})