import { expect, test, chromium } from "playwright/test";
import { setBrowserCookies } from "../utils/setCookies";
import { ProfilePage } from "../pages/userPage/profilePage";

test.describe.skip('Проверка страницы Profile', () => {

    let browser
    let page
    let context

    test.beforeEach(async () => {

        browser = await chromium.launch()
        context = await browser.newContext()

        const email = 'victor@mail.ru';
        const password = 'BETejEmm321';
    
        await setBrowserCookies(context, email, password);
  
        page = await context.newPage();
    })

    test.afterEach(async () => {
        await browser.close()
      });

    test('Звгрузка страницы Profile',async () => {

        const profilePage = new ProfilePage(page)
        await profilePage.navigate()

        await expect(page).toHaveURL(/dashboard\/user\/profile/)

        const title = profilePage.getTitle()
        await expect(title).toBeVisible()

        const downloadAvatar = profilePage.getDownloadAvatar()
        await expect(downloadAvatar).toBeVisible()

        const emailInput = profilePage.getEmailInput()
        await expect(emailInput).toBeVisible()

        const btnSaveChanges = profilePage.getBtnSaveChanges()
        await expect(btnSaveChanges).toBeVisible()

        const headerGrades = profilePage.getGradesHeader()
        await expect(headerGrades).toBeVisible()

        const containerGrades = profilePage.getGradesContainer()
        await expect(containerGrades).toBeVisible()

        const myInfoGrades = profilePage.getMyInfoGrades()
        await expect(myInfoGrades).toBeVisible()
        
    })
})