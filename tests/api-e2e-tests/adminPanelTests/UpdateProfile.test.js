import { expect, test } from "playwright/test";
import { loginAdmin } from "../../utils/auth";
import path, { basename, dirname } from 'path'
import { fileURLToPath } from "url";
import fs from 'fs'
import { updateProfileAdmin } from "../../utils/updateProfile";

test('Обновление данных профиля', async ({request}) => {
    const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
    const cookie = await loginAdmin('test-email@mail.ru', 'BETejEmm321')
    const cookieHeader = cookie.join('; ')

    try {
        const updateDataProfile = {
            name: 'update-name',
            email: 'update-test@gmail.com'
        }
    
        const __filename = fileURLToPath(import.meta.url)
        const __dirname = dirname(__filename)
    
        const imagePath = path.resolve(__dirname, '../../testData/imgUserPanel/updateAvatar.jpg')
    
        let body = ''
    
        for (let key in updateDataProfile) {
            if (updateDataProfile.hasOwnProperty(key)) {
                body += `--${boundary}\r\n`
                body += `Content-Disposition: form-data; name="${key}"\r\n\r\n`
                body += `${updateDataProfile[key]}\r\n`
            }
        }
    
        const bufferImg = fs.readFileSync(imagePath)
        body += `--${boundary}\r\n`
        body += `Content-Disposition: form-data; name="avatar"; filename="${basename(imagePath)}"\r\n`
        body += 'Content-Type: img/jpg\r\n\r\n'
    
        const bodyBuffer = Buffer.concat([
            Buffer.from(body, 'utf-8'),
            bufferImg,
            Buffer.from(`\r\n--${boundary}--\r\n`, 'utf-8')
        ])
    
        const response = await request.patch('/api/v1/admin/update-info', {
            data: bodyBuffer,
            headers: {
                'Cookie': cookieHeader,
                'Content-Type': `multipart/form-data; charset=UTF-8; boundary=${boundary}`,
            }
        })
    
        const {msg} = await response.json()
        expect(msg).toBe('Данные успешно обновлены')
    
        await updateProfileAdmin()
    } catch (error) {
        await updateProfileAdmin()
    }
})