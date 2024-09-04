import { expect, test } from "playwright/test";
import { loginAdmin } from "../../utils/auth";
import fs from 'fs';
import path, {dirname} from 'path'
import FormData from "form-data";
import { fileURLToPath } from 'url';

test('Добавление товара', async ({request}) => {
    const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
    const dataAddingProduct = {
        name: 'Тестовый товар',
        price: 250000,
        description: 'Описание тестового товара',
        category: 'Книги',
        stock_quantity: 100
    }

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);

    const imagePath = path.resolve(__dirname, '../../testData/imgUserPanel/bonfire.png');

    if (!fs.existsSync(imagePath)) {
        console.error('Файл не найден:', imagePath);
        process.exit(1); // Выходим, если файл не найден
    }

    // Формирование тела запроса
    let body = '';
    
    for (const key in dataAddingProduct) {
        if (dataAddingProduct.hasOwnProperty(key)) {
            body += `--${boundary}\r\n`;
            body += `Content-Disposition: form-data; name="${key}"\r\n\r\n`;
            body += `${dataAddingProduct[key]}\r\n`;
        }
    }

    // Добавление файла к телу запроса
    const imageContent = fs.readFileSync(imagePath);
    body += `--${boundary}\r\n`;
    body += `Content-Disposition: form-data; name="file"; filename="${path.basename(imagePath)}"\r\n`;
    body += `Content-Type: image/png\r\n\r\n`;

    // Преобразование тела запроса в буфер
    const bodyBuffer = Buffer.concat([
        Buffer.from(body, 'utf-8'), 
        imageContent,
        Buffer.from(`\r\n--${boundary}--\r\n`, 'utf-8')
    ]);


    // Вход в систему и получение куки
    const cookies = await loginAdmin('victor@mail.ru', 'BETejEmm321');
    const cookieHeader = cookies.join('; ');

    // Отправка запроса
    const response = await request.post('/api/v1/admin/products', {
        headers: {
            'Content-Type': `multipart/form-data; charset=UTF-8; boundary=${boundary}`,
            'Cookie': cookieHeader
        },
        data: bodyBuffer
    });

    const {msg} = await response.json()
    expect(msg).toBe('Товар успешно добавлен')

})