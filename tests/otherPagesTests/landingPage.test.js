import { test, expect } from '@playwright/test';
import { LandingPage } from '../classPageObject/landingPage';
import { ProfilePage } from '../classPageObject/userPage/profilePage';
import { DashboardPage } from '../classPageObject/adminPage/dashboardPage';
import { RegisterPageUser } from '../classPageObject/userPage/registerUserPage';
import { RegisterPageAdmin } from '../classPageObject/registerAdminPage';
import { ForgotPasswordUser } from '../classPageObject/userPage/forgotPasswordUser';
import { ForgotPasswordAdmin } from '../classPageObject/forgotPasswordAdmin';

test.describe('Тестирование лендинг страницы', () => {
  test('Загрузка главной страницы (landing)', async ({ page }) => {
    const landingPage = new LandingPage(page);
    await landingPage.navigate();

    const titleShop = landingPage.getTitleShop();
    const titleAdminPanel = landingPage.getTitleAdminPanel();
    await expect(titleShop).toBeVisible();
    await expect(titleShop).toHaveText('Market Shop');
    await expect(titleAdminPanel).toBeVisible();
    await expect(titleAdminPanel).toHaveText('Admin Panel');
  });

  test('Вход юзера в систему', async ({ page }) => {
    const landingPage = new LandingPage(page);
    const profilePage = new ProfilePage(page);
    await landingPage.navigate();
    await landingPage.loginUser('test-email@mail.ru', 'BETejEmm321');

    await expect(page).toHaveURL(/.*user\/all-product/);

    const balanceUser = profilePage.getBalance();
    await expect(balanceUser).toBeVisible();
    await expect(balanceUser).toContainText('Balance');
  });

  test('Вход администратора в систему', async ({ page }) => {
    const landingPage = new LandingPage(page);
    const dashboardPage = new DashboardPage(page);
    await landingPage.navigate();
    await landingPage.loginAdmin('test-email@mail.ru', 'BETejEmm321');

    await expect(page).toHaveURL(/.*dashboard\/admin/);

    const btnLogout = dashboardPage.getLogoutBtn();
    await expect(btnLogout).toBeVisible();
  });

  test('Переход на страницу регистрации юзера', async ({ page }) => {
    const landingPage = new LandingPage(page);
    const registerPage = new RegisterPageUser(page);

    await landingPage.navigate();
    const registerButtonUser = landingPage.getRegisterUserLink();
    registerButtonUser.click();

    await expect(page).toHaveURL(/.*register\/user/);
    const titleRegisterUser = registerPage.getTitleRegister();
    await expect(titleRegisterUser).toBeVisible();
    await expect(titleRegisterUser).toHaveText('User Register');
  });

  test('Переход на страницу регистрации админа', async ({ page }) => {
    const landingPage = new LandingPage(page);
    const registerPage = new RegisterPageAdmin(page);

    await landingPage.navigate();
    const registerButtonAdmin = landingPage.getRegisterAdminLink();
    registerButtonAdmin.click();

    await expect(page).toHaveURL(/.*register\/admin/);
    const titleRegisterAdmin = registerPage.getTitleRegister();
    await expect(titleRegisterAdmin).toBeVisible();
    await expect(titleRegisterAdmin).toHaveText('Admin Register');
  });

  test('Переход на страницу восстановления пароля юзера', async ({ page }) => {
    const landingPage = new LandingPage(page);
    const forgotPage = new ForgotPasswordUser(page);

    await landingPage.navigate();
    const forgotButtonUser = landingPage.getForgotUserLink();
    forgotButtonUser.click();

    await expect(page).toHaveURL(/.*forgot-password\/user/);
    const titleForgotUser = forgotPage.getTitleForgotPassword();
    await expect(titleForgotUser).toBeVisible();
    await expect(titleForgotUser).toHaveText('Введите ваш email');
  });

  test('Переход на страницу восстановления пароля админа', async ({ page }) => {
    const landingPage = new LandingPage(page);
    const forgotPage = new ForgotPasswordAdmin(page);

    await landingPage.navigate();
    const forgotButtonAdmin = landingPage.getForgotAdminLink();
    forgotButtonAdmin.click();

    await expect(page).toHaveURL(/.*forgot-password\/admin/);
    const titleForgotAdmin = forgotPage.getTitleForgotPassword();
    await expect(titleForgotAdmin).toBeVisible();
    await expect(titleForgotAdmin).toHaveText('Введите ваш email');
  });
});
