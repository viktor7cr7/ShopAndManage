import { expect, test } from 'playwright/test';
import { AllProductsPage } from '../../classPageObject/adminPage/allProductsPage';
import { EditPage } from '../../classPageObject/userPage/editPage';
import { createProduct } from '../../utils/createUIProduct';
import { deleteProduct } from '../../utils/CRUDProduct';

test('Добавление товара, проверка значений на странице All Products, Edit Product', async () => {
  try {
    const { page, close } = await createProduct();

    const allProductPage = new AllProductsPage(page);
    const editPage = new EditPage(page);

    const valueName = '6.6" Смартфон Samsung Galaxy A55 5G 256 ГБ Синий';
    const valueDescription =
      'Смартфон Samsung Galaxy A55 5G 256 ГБ в синем корпусе оснащен дисплеем 6.6” с защитным покрытием Corning Gorilla Glass Victus+ от царапин. Матрица Super AMOLED сохраняет яркость и четкость изображений при любом освещении. Разрешение 2340x1080 dpi с плотностью пикселей 388 ppi устраняет эффект зернистости.Samsung Galaxy A55 5G поддерживает работу с 1 электронной и 2 физическими SIM-картами. Вы можете использовать универсальный слот для установки microSD объемом до 1 ТБ. 8-ядерный процессор Samsung Exynos 1480 с ОЗУ 8 ГБ не дает приложениям зависать, а графике тормозить. 256 ГБ памяти хватает для установки нужного софта и хранения файлов. Встроенный в экран сканер отпечатков пальцев и функция распознавания лиц создают дополнительный уровень защиты личных данных.';
    const valueQuantity = '100';
    const valueCategory = 'Электроника';
    const valuePrice = '160000';
    const toastifyNotification = page.locator('.Toastify__toast-container');

    await expect(toastifyNotification).toBeVisible();
    expect(await toastifyNotification.innerText()).toBe('Товар успешно добавлен');
    await page.waitForURL(/dashboard\/admin\/all-products/);

    const btnPages = allProductPage.getBtnPage();
    await btnPages.nth(1).click();
    await page.waitForURL(/page=2/);

    const productItems = allProductPage.getProductItem();
    const lastItem = await productItems.last();

    const nameProduct = lastItem.locator('.product-name');
    expect(await nameProduct.innerText()).toBe(valueName);

    const categoryProduct = lastItem.locator('.product-category');
    expect(await categoryProduct.innerText()).toBe(valueCategory);

    const quantityProduct = lastItem.locator('.product-quantity');
    expect(await quantityProduct.innerText()).toBe(`Quantity: ${valueQuantity}`);

    const priceProduct = lastItem.locator('.product-price');
    expect(await priceProduct.innerText()).toBe(` ${valuePrice} RUB`);

    const checkDiscountProduct = lastItem.locator('.no-discount');
    expect(await checkDiscountProduct.innerText()).toBe('Discount not set');

    const editBtn = lastItem.locator('.edit-btn');
    await editBtn.click();

    await page.waitForURL(/dashboard\/admin\/edit-product/);

    const valueNameEditPage = await editPage.getInputName().inputValue();
    expect(valueNameEditPage).toBe(valueName);

    const valueDescriptionEditPage = await editPage.getInputDescription().inputValue();
    expect(valueDescriptionEditPage).toBe(valueDescription);

    const valueQuantityEditPage = await editPage.getInputQuantity().inputValue();
    expect(valueQuantityEditPage).toBe(valueQuantity);

    const valueCategoryEditPage = await editPage.getSelectCategory().inputValue();
    expect(valueCategoryEditPage).toBe(valueCategory);

    const valuePriceEditPage = await editPage.getInputPrice().inputValue();
    expect(valuePriceEditPage).toBe(valuePrice);

    await deleteProduct();

    await close();
  } catch (error) {
    await deleteProduct();
  }
});
