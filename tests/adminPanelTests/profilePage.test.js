import { expect, test, chromium } from "playwright/test";
import { setBrowserAdminCookies } from "../utils/setCookies";
import { ProfilePage } from "../pages/adminPage/profilePage";

test.describe.skip('Страницы Profile', () => {
    
    let page
    let browser
    let context

    test.beforeEach(async () => {

        browser = await chromium.launch()
        context = await browser.newContext()

        const email = 'victor@mail.ru';
        const password = 'BETejEmm321';

        setBrowserAdminCookies(context, email, password)

        page = await context.newPage()

    })

    test.afterEach(async () => {
        await browser.close()
      });

    test('Проверка загрузки страницы Profile', async () => {

        const profilePage = new ProfilePage(page)
        await profilePage.navigate()
        await page.waitForURL(/dashboard\/admin\/profile/)
        
        const downloadAvatar = profilePage.getDownloadAvatar()
        await expect(downloadAvatar).toBeVisible()

        const inputName = profilePage.getInputName()
        await expect(inputName).toBeVisible()

        const inputEmail = profilePage.getInputEmail()
        await expect(inputEmail).toBeVisible()

        const btnSaveChanges = profilePage.getBtnSaveChanges()
        await expect(btnSaveChanges).toBeVisible()
    })

    test('Ввод и отображение значения элементов формы', async () => {
        const profilePage = new ProfilePage(page)
        await profilePage.navigate()
        await page.waitForURL(/dashboard\/admin\/profile/)

        const downloadAvatar = profilePage.getDownloadAvatar()
        await expect(downloadAvatar).toBeVisible()
        await downloadAvatar.setInputFiles('/api-market/tests/testData/imgUserPanel/bonfire.png')
        const uploadedFileName = await page.$eval('#avatar', input => input.files[0].name);
        expect(uploadedFileName).toBe('bonfire.png');

        const inputName = profilePage.getInputName()
        await expect(inputName).toBeVisible()
        await inputName.fill('Jack Daniels')
        const valueInputName = await inputName.inputValue()
        expect(valueInputName).toBe('Jack Daniels')

        const inputEmail = profilePage.getInputEmail()
        await expect(inputEmail).toBeVisible()
        await inputEmail.fill('jack-daniels@gmail.com')
        const valueInputEmail = await inputEmail.inputValue()
        expect(valueInputEmail).toBe('jack-daniels@gmail.com')

    })
})