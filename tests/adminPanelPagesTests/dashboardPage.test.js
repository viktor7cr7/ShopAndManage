import { expect, chromium, test } from 'playwright/test';
import { setBrowserAdminCookies } from '../utils/setCookies';
import { DashboardPage } from '../classPageObject/adminPage/dashboardPage';

test.describe('Проверка Dashboard', () => {
  let browser;
  let page;
  let context;

  test.beforeEach(async () => {
    browser = await chromium.launch();
    context = await browser.newContext();

    const email = 'test-email@mail.ru';
    const password = 'BETejEmm321';

    await setBrowserAdminCookies(context, email, password);

    page = await context.newPage();
  });

  test.afterEach(async () => {
    await browser.close();
  });

  test('Проверка отображения элементов Dashboard', async () => {
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.navigate();
    await expect(page).toHaveURL(/dashboard\/admin\/add-product/);

    const dashboardTitle = dashboardPage.getDashboardTitle();
    await expect(dashboardTitle).toBeVisible();
    expect(await dashboardTitle.innerText()).toBe('Dashboard');

    const dashboardLogoutBtn = dashboardPage.getLogoutBtn();
    await expect(dashboardLogoutBtn).toBeVisible();

    const dropDownLogout = dashboardPage.getDropDownLogoutBtn();
    await expect(dropDownLogout).toBeHidden();

    await dashboardLogoutBtn.click();
    await expect(dropDownLogout).toBeVisible();
  });
});
