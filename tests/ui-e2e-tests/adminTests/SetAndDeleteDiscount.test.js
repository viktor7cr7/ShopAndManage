import { AllProductsPage } from '../../classPageObject/adminPage/allProductsPage';
import { createProduct } from '../../utils/createUIProduct';
import { expect, test } from 'playwright/test';
import { deleteProduct } from '../../utils/CRUDProduct';

test('Добавление и удаление скидки', async () => {
  try {
    const { page, valueName, close } = await createProduct();

    const allProductPage = new AllProductsPage(page);
    const btnPages = allProductPage.getBtnPage();
    const percentageValue = '50';

    await btnPages.nth(1).click();
    await page.waitForURL(/page=2/);

    const addingProduct = allProductPage.getProductItem().locator(`text=${valueName}`).locator('../../..');
    const productPrice = await addingProduct.locator('.product-price').innerText();

    const btnChangeDiscount = addingProduct.locator('.discount-btn');
    await btnChangeDiscount.click();

    const modalDiscount = page.locator('.modal-discount');

    await expect(modalDiscount).toBeVisible();

    const percentageInput = modalDiscount.locator('#percentage');
    await expect(percentageInput).toBeVisible();
    await percentageInput.fill(percentageValue);

    const inputDatePickerEndDate = modalDiscount.locator('.end-date');
    await inputDatePickerEndDate.click();
    await expect(inputDatePickerEndDate).toBeVisible();
    await inputDatePickerEndDate.fill('2024/08/24');

    const btnSaveDiscount = modalDiscount.locator('.save-btn');
    await expect(btnChangeDiscount).toBeVisible();
    await btnSaveDiscount.click();

    page.waitForURL(/dashboard\/admin\/all-products/);

    let toastifyNotification = page.locator('.Toastify__toast-body').nth(1);
    await expect(toastifyNotification).toBeVisible();
    expect(await toastifyNotification.innerText()).toBe('Скидка успешно установлена');
    
    await btnPages.nth(1).click();
    await page.waitForURL(/page=2/);

    const oldPrice = addingProduct.locator('.no_activity_price');
    expect(await oldPrice.innerText()).toBe(productPrice);

    const newPrice = addingProduct.locator('.fa-percentage');
    expect(await newPrice.innerText()).toBe(' 80000 RUB');

    const valuePercentage = addingProduct.locator('.set-discount');
    expect(await valuePercentage.innerText()).toBe(percentageValue);

    await btnChangeDiscount.click();

    const btnDeleteDiscount = modalDiscount.locator('.delete-btn');
    await btnDeleteDiscount.click();

    page.waitForURL(/dashboard\/admin\/all-products/);
    toastifyNotification = page.locator('.Toastify__toast-body').nth(2);
    await expect(toastifyNotification).toBeVisible();

    expect(await toastifyNotification.innerText()).toBe('Скидка успешно удалена');
    await btnPages.nth(1).click();
    await page.waitForURL(/page=2/);

    expect(productPrice).toBe(' 160000 RUB');

    await deleteProduct();

    await close();
  } catch (error) {
    await deleteProduct();
  }
});
