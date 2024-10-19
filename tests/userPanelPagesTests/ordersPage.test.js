import { expect, test, chromium } from 'playwright/test';
import { setBrowserCookies } from '../utils/setCookies';
import { OrdersPage } from '../classPageObject/userPage/OrdersPage';

test.describe('Проверка страницы Orders', () => {
  let browser;
  let context;
  let page;

  test.beforeEach(async () => {
    browser = await chromium.launch();
    context = await browser.newContext();

    const email = 'test-email@mail.ru';
    const password = 'BETejEmm321';

    await setBrowserCookies(context, email, password);

    page = await context.newPage();
  });

  test.afterEach(async () => {
    await browser.close();
  });

  test('Загрузка страницы Orders', async () => {
    const ordersPage = new OrdersPage(page);
    await ordersPage.navigate();

    const formFilters = ordersPage.getFormFilters();
    await expect(formFilters).toBeVisible();

    const ordersItem = ordersPage.getOrderItem();

    for (let i = 0; i < (await ordersItem.count()); i++) {
      const orderItem = ordersItem.nth(i);
      await expect(orderItem).toBeVisible();

      const orderId = orderItem.locator('.order-id');
      await expect(orderId).toBeVisible();

      const orderStatus = orderItem.locator('.order-status');
      await expect(orderStatus).toBeVisible();

      const orderPrice = orderItem.locator('.order-price');
      await expect(orderPrice).toBeVisible();

      const orderCreated = orderItem.locator('.order-created');
      await expect(orderCreated).toBeVisible();

      const orderDetailLink = orderItem.locator('.order-detail');
      await expect(orderDetailLink).toBeVisible();
    }
  });

  test('Фильтрация ордеров по поиску (ID)', async () => {
    const ordersPage = new OrdersPage(page);
    await ordersPage.navigate();

    const formFilters = ordersPage.getFormFilters();
    await expect(formFilters).toBeVisible();

    const filterById = formFilters.locator('#search');
    await expect(filterById).toBeVisible();

    await filterById.fill('185');

    const allOrdersMatch = await page.$$eval('.order-id', (elements) =>
      elements
        .map((item) => {
          const clearText = +item.textContent.replace(/[^0-9]/g, '');
          return clearText;
        })
        .every((orderId) => orderId === 185),
    );

    expect(allOrdersMatch).toBe(true);
  });

  test('Сортировка ордеров по цене (Price по возрастанию)', async () => {
    const ordersPage = new OrdersPage(page);
    await ordersPage.navigate();

    const formFilters = ordersPage.getFormFilters();
    await expect(formFilters).toBeVisible();

    const sortByPrice = formFilters.locator('#price');
    await expect(sortByPrice).toBeVisible();

    await sortByPrice.selectOption({ label: 'asc' });

    const allOrdersMatch = await page.$$eval('.order-price', (elements) =>
      elements.map((item) => {
        const clearText = +item.textContent.replace(/[^0-9]/g, '');
        return clearText;
      }),
    );

    function isArraySortedAscending(arr) {
      return arr.every((value, index) => {
        if (index === 0) return true;
        return value >= arr[index - 1];
      });
    }

    expect(isArraySortedAscending(allOrdersMatch)).toBe(true);
  });

  test('Сортировка ордеров по цене (Price по убыванию)', async () => {
    const ordersPage = new OrdersPage(page);
    await ordersPage.navigate();

    const formFilters = ordersPage.getFormFilters();
    await expect(formFilters).toBeVisible();

    const sortByPrice = formFilters.locator('#price');
    await expect(sortByPrice).toBeVisible();

    await sortByPrice.selectOption({ label: 'desc' });

    const allOrdersMatch = await page.$$eval('.order-price', (elements) =>
      elements.map((item) => {
        const clearText = +item.textContent.replace(/[^0-9]/g, '');
        return clearText;
      }),
    );

    function isArraySortedDescending(arr) {
      return arr.every((value, index) => {
        if (index + 1 < arr.length) {
          return value >= arr[index + 1];
        }
        return true;
      });
    }

    expect(isArraySortedDescending(allOrdersMatch)).toBe(true);
  });

  test('Сортировка ордеров по дате создания (Created по возрастанию)', async () => {
    const ordersPage = new OrdersPage(page);
    await ordersPage.navigate();

    const formFilters = ordersPage.getFormFilters();
    await expect(formFilters).toBeVisible();

    const sortByCreationDate = formFilters.locator('#createdAt');
    await expect(sortByCreationDate).toBeVisible();

    await sortByCreationDate.selectOption({ label: 'asc' });

    const allOrdersMatch = await page.$$eval('.order-created', (elements) =>
      elements.map((item) => {
        const clearText = item.textContent.replace(/[^0-9/]/g, '').replace(/\//g, '.');
        const convertToMs = new Date(clearText).getTime();
        return convertToMs;
      }),
    );

    function isArraySortedAscending(arr) {
      return arr.every((value, index) => {
        if (index === 0) return true;

        return value >= arr[index - 1];
      });
    }

    expect(isArraySortedAscending(allOrdersMatch)).toBe(true);
  });

  test('Сортировка ордеров по дате создания (Created по убыванию)', async () => {
    const ordersPage = new OrdersPage(page);
    await ordersPage.navigate();

    const formFilters = ordersPage.getFormFilters();
    await expect(formFilters).toBeVisible();

    const sortByCreationDate = formFilters.locator('#createdAt');
    await expect(sortByCreationDate).toBeVisible();

    await sortByCreationDate.selectOption({ label: 'desc' });

    const allOrdersMatch = await page.$$eval('.order-created', (elements) =>
      elements.map((item) => {
        const clearText = item.textContent.replace(/[^0-9/]/g, '').replace(/\//g, '.');
        const convertToMs = new Date(clearText).getTime();
        return convertToMs;
      }),
    );

    function isArraySortedDescending(arr) {
      return arr.every((value, index) => {
        if (index + 1 < arr.length) {
          return value >= arr[index + 1];
        }

        return true;
      });
    }

    expect(isArraySortedDescending(allOrdersMatch)).toBe(true);
  });

  test('Фильтрация ордеров по статусу paid (Оплачен)', async () => {
    const ordersPage = new OrdersPage(page);
    await ordersPage.navigate();

    const formFilters = ordersPage.getFormFilters();
    await expect(formFilters).toBeVisible();

    const filteringByPaymentStatus = formFilters.locator('#status');
    await expect(filteringByPaymentStatus).toBeVisible();

    await filteringByPaymentStatus.selectOption({ label: 'paid' });

    const allOrdersMatch = await page.$$eval('.order-status', (elements) =>
      elements
        .map((item) => {
          const clearText = item.textContent.replace(/Status: /, '');
          return clearText;
        })
        .every((status) => status === 'paid'),
    );

    expect(allOrdersMatch).toBe(true);
  });

  test('Фильтрация ордеров по статусу unpaid (Не оплачен)', async () => {
    const ordersPage = new OrdersPage(page);
    await ordersPage.navigate();

    const formFilters = ordersPage.getFormFilters();
    await expect(formFilters).toBeVisible();

    const filteringByPaymentStatus = formFilters.locator('#status');
    await expect(filteringByPaymentStatus).toBeVisible();

    await filteringByPaymentStatus.selectOption({ label: 'unpaid' });

    const allOrdersMatch = await page.$$eval('.order-status', (elements) =>
      elements
        .map((item) => {
          const clearText = item.textContent.replace(/Status: /, '');
          return clearText;
        })
        .every((status) => status === 'unpaid'),
    );

    expect(allOrdersMatch).toBe(true);
  });
});
