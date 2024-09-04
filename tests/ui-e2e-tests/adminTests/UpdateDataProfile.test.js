import { expect, test } from "playwright/test";
import { authCookieAndNewContext } from "../../utils/authCookieAndNewContext";
import { ProfilePage } from "../../pages/adminPage/profilePage";
import { updateProfileAdmin } from "../../utils/updateProfile";

test.skip('Обновление данных администратора', async () => {

    const page = await authCookieAndNewContext()

    const pageProfile = new ProfilePage(page)
    await pageProfile.navigate()
    await page.waitForURL(/dashboard\/admin\/profile/)
    const updateValueName = 'Aleksey'
    const updateValueEmail = 'aleksey-test@gmail.com'
    

    await page.setInputFiles('#avatar', '/api-market/tests/testData/imgUserPanel/updateAvatar.jpg')

    const inputEmail = pageProfile.getInputEmail()
    await inputEmail.fill(updateValueEmail)

    const inputName = pageProfile.getInputName()
    await inputName.fill(updateValueName)

    const btnSaveChanges = pageProfile.getBtnSaveChanges()
    await btnSaveChanges.click()

    const toastifyNotification = page.locator('.Toastify__toast-body')
    await expect(toastifyNotification).toBeVisible()
    expect(await toastifyNotification.innerText()).toBe('Данные успешно обновлены')

    await pageProfile.navigate()

    expect(await inputName.inputValue()).toBe(updateValueName)
    expect(await inputEmail.inputValue()).toBe(updateValueEmail)

    await updateProfileAdmin()

})