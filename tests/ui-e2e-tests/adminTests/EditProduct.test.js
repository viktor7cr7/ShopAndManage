import { expect, test } from 'playwright/test';
import { EditPage } from '../../classPageObject/userPage/editPage';
import { AllProductsPage } from '../../classPageObject/adminPage/allProductsPage';
import { createProduct } from '../../utils/createUIProduct';
import { deleteProduct } from '../../utils/CRUDProduct';

test('Редактирование товара', async () => {
  try {
    const { page, valueName, close } = await createProduct();
    const editPage = new EditPage(page);
    const allProductPage = new AllProductsPage(page);
    const btnPages = allProductPage.getBtnPage();

    const newValueName = '6.5" Смартфон IIIF150 Air1 Pro 128 ГБ Черный';
    const newValueDescription =
      'Смартфон IIIF150 Air1 Pro 128 ГБ создан для активных пользователей, которые нуждаются в функциональном и защищенном устройстве. Корпус соответствует стандартам IP68, IP69K и MIL-STD-810G, что гарантирует устойчивость к повреждениям и неблагоприятным климатическим факторам. Смартфон не боится попадания пыли и воды. На экране установлено закаленное стекло для защиты от появления царапин.Панель 6.5 дюйма IPS (2400x1080 пикселей) обеспечивает реалистичное изображение. Аппаратные компоненты гарантируют отзывчивость системы при запуске программ, сервисов, интернет-страниц, мультимедийного контента. Камера 48+20+2 Мп с тройной LED-вспышкой и автофокусом создает реалистичные снимки. Модуль ночного видения позволяет делать четкие фото и видео в темноте. Спереди установлена камера 16 Мп для селфи и общения. Режим SOS позволяет отправлять на заданный номер сигнал с текстом спасения и координатами. Одного заряда аккумулятора достаточно до 500 часов работы IIIF150 Air1 Pro в режиме ожидания.';
    const newValueQunatity = '1500';
    const newValueCategory = 'Книги';
    const newValuePathImg = './tests/testData/imgUserPanel/updateAvatar.jpg';
    const newValuePrice = '132600';
    await btnPages.nth(1).click();
    await page.waitForURL(/page=2/);

    const addingProduct = allProductPage.getProductItem().locator(`text=${valueName}`).locator('../../..');
    const btnEditProduct = await addingProduct.locator('.edit-btn');
    await btnEditProduct.click();

    const inputName = editPage.getInputName();
    await inputName.fill(newValueName);

    const inputDescription = editPage.getInputDescription();
    await inputDescription.fill(newValueDescription);

    const selectCategory = editPage.getSelectCategory();
    await selectCategory.selectOption({ label: newValueCategory });

    const inputQuantity = editPage.getInputQuantity();
    await inputQuantity.fill(newValueQunatity);

    const inputPrice = editPage.getInputPrice();
    await inputPrice.fill(newValuePrice);

    await page.setInputFiles('#product_img', newValuePathImg);

    const btnSaveChanges = editPage.getBtnSubmit();
    await btnSaveChanges.click();
    page.waitForURL(/dashboard\/admin\/all-products/);

    const toastifyNotification = page.locator('.Toastify__toast-body').nth(1);
    await expect(toastifyNotification).toBeVisible();
    expect(await toastifyNotification.innerText()).toBe('Данные успешно обновлены');

    await btnPages.nth(1).click();
    await page.waitForURL(/page=2/);

    const updateProduct = page.locator(`text=${newValueName}`).locator('../../..');
    const updateValueName = updateProduct.locator('.product-name');
    expect(await updateValueName.innerText()).toBe(newValueName);

    const updateValuePrice = updateProduct.locator('.product-price');
    expect((await updateValuePrice.innerText()).trim()).toBe(`${newValuePrice} RUB`);

    const updateValueQuantity = updateProduct.locator('.product-quantity');
    expect(await updateValueQuantity.innerText()).toBe(`Quantity: ${newValueQunatity}`);

    const updateValueCategory = updateProduct.locator('.product-category');
    expect(await updateValueCategory.innerText()).toBe(newValueCategory);

    const btnUpdateProduct = updateProduct.locator('.edit-btn');
    await btnUpdateProduct.click();
    
    await page.waitForURL(/edit-product/);

    expect(await inputDescription.inputValue()).toBe(newValueDescription);

    await deleteProduct('6.5" Смартфон IIIF150 Air1 Pro 128 ГБ Черный');

    await close();
  } catch (error) {
    await deleteProduct('6.5" Смартфон IIIF150 Air1 Pro 128 ГБ Черный');
  }
});
