import { expect, test } from 'playwright/test';
import { AllProductsPage } from '../../classPageObject/adminPage/allProductsPage';
import { createProduct } from '../../utils/createUIProduct';

test('Удаление товара', async () => {
  const { page, valueName, close } = await createProduct();
  const allProductPage = new AllProductsPage(page);

  const btnPages = allProductPage.getBtnPage();
  await btnPages.nth(1).click();
  await page.waitForURL(/page=2/);

  const productsItems = allProductPage.getProductItem();
  const addingProductText = await productsItems.locator(`text=${valueName}`);

  let addingProduct = await productsItems.locator(`text=${valueName}`).locator('../../..');

  const lastItemDeleteBtn = await addingProduct.locator('.delete-btn');
  expect(await addingProductText.innerText()).toBe(valueName);
  await lastItemDeleteBtn.click();

  const toastifyNotification = page.locator('.Toastify__toast-body').nth(1);
  await expect(toastifyNotification).toBeVisible();
  expect(await toastifyNotification.innerText()).toBe('Продукт успешно удалён');

  await btnPages.nth(1).click();
  await page.waitForURL(/page=2/);
  await page.waitForSelector(`text=${valueName}`, { state: 'detached' });
  
  addingProduct = await productsItems.locator(`text=${valueName}`).locator('../../..');
  const isPresent = (await addingProduct.count()) > 0;
  expect(isPresent).toBe(false);

  await close();
});
