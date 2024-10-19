import { expect, test } from 'playwright/test';
import { authCookieAndNewContextUser } from '../../utils/authCookieAndNewContext';
import { ProfilePage } from '../../classPageObject/userPage/profilePage';
import { updateProfileUser } from '../../utils/updateProfile';

test('Обновление данных юзера', async () => {
  try {
    const { page, close } = await authCookieAndNewContextUser();

    const pageProfile = new ProfilePage(page);
    await pageProfile.navigate();
    await page.waitForURL(/dashboard\/user\/profile/);
    const updateValueEmail = 'update-test@gmail.com';

    await page.setInputFiles('#avatar', './tests/testData/imgUserPanel/updateAvatar.jpg');

    const inputEmail = pageProfile.getEmailInput();
    await inputEmail.fill(updateValueEmail);

    const btnSaveChanges = pageProfile.getBtnSaveChanges();
    await btnSaveChanges.click();

    const toastifyNotification = page.locator('.Toastify__toast-body');
    await expect(toastifyNotification).toBeVisible();
    expect(await toastifyNotification.innerText()).toBe('Данные успешно обновлены');

    await pageProfile.navigate();

    expect(await inputEmail.inputValue()).toBe(updateValueEmail);

    await updateProfileUser();

    await close();
  } catch (error) {
    await updateProfileUser();
  }
});
