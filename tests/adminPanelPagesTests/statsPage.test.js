import { expect, test, chromium } from 'playwright/test';
import { setBrowserAdminCookies } from '../utils/setCookies';
import { StatsPage } from '../classPageObject/adminPage/statsPage';

test.describe('Страницы Stats', () => {
  let page;
  let browser;
  let context;

  test.beforeEach(async () => {
    browser = await chromium.launch();
    context = await browser.newContext();

    const email = 'test-email@mail.ru';
    const password = 'BETejEmm321';

    setBrowserAdminCookies(context, email, password);

    page = await context.newPage();
  });

  test.afterEach(async () => {
    await browser.close();
  });

  test('Загрузка страницы Stats', async () => {
    const statsPage = new StatsPage(page);
    await statsPage.navigate();
    await page.waitForURL(/dashboard\/admin\/stats/);

    const headerContainer = statsPage.getHeaderContainer();
    await expect(headerContainer).toBeVisible();

    const statsContainer = statsPage.getStatsContainer();
    await expect(statsContainer).toBeVisible();
  });
});
