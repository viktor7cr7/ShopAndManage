import { expect, test } from 'playwright/test';
import { authCookieAndNewContextUser } from '../../utils/authCookieAndNewContext';
import { createProduct } from '../../utils/createUIProduct';
import { BuyProducts } from '../../classPageObject/userPage/buyProducts';
import { OrdersPage } from '../../classPageObject/userPage/OrdersPage';
import { deleteProduct } from '../../utils/CRUDProduct';
import { updateBalance } from '../../utils/updateBalanceUser';

test('Добавление рейтинга продукту', async () => {
  try {
    await updateBalance();

    const { valueName, close } = await createProduct();

    const { page } = await authCookieAndNewContextUser();

    const buyProductsPage = new BuyProducts(page);
    await buyProductsPage.navigate();

    const btnPages = buyProductsPage.getPageBtn();
    await btnPages.nth(1).click();

    const productItems = buyProductsPage.getProductContainer();
    const addingProduct = await productItems.locator(`text=${valueName}`).locator('../../../..');
    expect(addingProduct).toBeVisible();

    const btnBuyProduct = await addingProduct.locator('text=Buy Now');
    await btnBuyProduct.click();

    const modalBuyProduct = page.locator('.modal-buy:visible');
    await expect(modalBuyProduct).toBeVisible();

    const selectPaymentMethods = modalBuyProduct.locator('#payment-method');
    await selectPaymentMethods.selectOption({ label: 'Balance' });

    const modalBtnBuyProduct = modalBuyProduct.locator('.action-buy');
    await modalBtnBuyProduct.click();

    await page.waitForURL(/dashboard\/user\/orders/);

    const ordersPage = new OrdersPage(page);

    const orderItems = ordersPage.getOrderItem().last();

    const btnDetailsOrder = orderItems.locator('.order-detail');
    await btnDetailsOrder.click();

    await page.waitForSelector('.item-content');

    const starRating = page.locator('.star-rating');
    const freeStarRating = starRating.locator('label');

    await freeStarRating.nth(2).click();

    let toastifyNotification = page.locator('.Toastify__toast-body');
    await expect(toastifyNotification).toBeVisible();
    expect(await toastifyNotification.innerText()).toBe('Спасибо за отзыв!');

    const filledStars = await starRating.locator('.rating-set').count();
    expect(filledStars).toBe(3);

    await freeStarRating.nth(2).click();
    toastifyNotification = page.locator('.Toastify__toast-body').nth(1);
    expect(await toastifyNotification.innerText()).toBe('Вы уже оценивали данный заказ');

    await deleteProduct();

    await close();
  } catch (error) {
    await deleteProduct();
  }
});
