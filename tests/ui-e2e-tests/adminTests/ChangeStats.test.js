import { expect, test } from 'playwright/test';
import { createProduct } from '../../utils/createUIProduct';
import { BuyProducts } from '../../classPageObject/userPage/buyProducts';
import { authCookieAndNewContext, authCookieAndNewContextUser } from '../../utils/authCookieAndNewContext';
import { StatsPage } from '../../classPageObject/adminPage/statsPage';
import { deleteProduct } from '../../utils/CRUDProduct';
import { updateBalance } from '../../utils/updateBalanceUser';

test('Изменение данных в статистике при покупке товара', async () => {
  try {
    await updateBalance();

    const { valueName, close } = await createProduct();

    let { page } = await authCookieAndNewContextUser();

    const buyProductsPage = new BuyProducts(page);
    await buyProductsPage.navigate();
    await page.waitForURL(/user\/all-products/);
    await page.screenshot({ path: 'tests/screenshots/debug.png' });
    const btnPages = buyProductsPage.getPageBtn();
    await btnPages.nth(1).click();
    await page.waitForURL(/page=2/);

    await page.waitForSelector('.product-containter');
    const productItems = buyProductsPage.getProductContainer();
    
    const addingProduct = await productItems.locator(`text=${valueName}`).locator('../../../..');

    expect(addingProduct).toBeVisible();

    const btnBuyProduct = await addingProduct.locator('text=Buy Now');
    await btnBuyProduct.click();

    const modalBuyProduct = page.locator('.modal-buy:visible');
    await expect(modalBuyProduct).toBeVisible();
    const selectMethods = modalBuyProduct.locator('#payment-method');

    await expect(selectMethods).toBeVisible();
    await selectMethods.selectOption({ label: 'Balance' });

    const modalBtnBuyProduct = modalBuyProduct.locator('.action-buy');
    await modalBtnBuyProduct.click();
    await page.waitForURL(/user\/orders/);

    (({ page } = await authCookieAndNewContext()));

    const statsPage = new StatsPage(page);
    await statsPage.navigate();
    await page.waitForURL(/dashboard\/admin\/stats/);

    const soldCount = statsPage.getHeaderContainer().locator('.count');
    await expect(soldCount).toHaveText('1', { timeout: 3000 });

    const countOfSoldInChart = statsPage.getStatsContainer().locator('tspan').last();
    await expect(countOfSoldInChart).toHaveText('1', { timeout: 3000 });

    await deleteProduct();

    await close();
  } catch (error) {
    await deleteProduct();
  }
});
