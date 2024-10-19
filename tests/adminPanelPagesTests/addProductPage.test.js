import { expect, chromium, test } from 'playwright/test';
import { setBrowserAdminCookies } from '../utils/setCookies';
import { AddProductPage } from '../classPageObject/adminPage/addProductPage';

test.describe('Проверка страницы Add Product', () => {
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

  test('Проверка загрузки страницы Add Product', async () => {
    const addProductPage = new AddProductPage(page);
    await addProductPage.navigate();
    await expect(page).toHaveURL(/dashboard\/admin\/add-product/);

    const formFilters = addProductPage.getFormFilters();
    await expect(formFilters).toBeVisible();

    const inputName = addProductPage.getInputName();
    await expect(inputName).toBeVisible();

    const inputPrice = addProductPage.getInputPrice();
    await expect(inputPrice).toBeVisible();

    const inputDescription = addProductPage.getInputDescription();
    await expect(inputDescription).toBeVisible();

    const selectCategory = addProductPage.getSelectCategory();
    await expect(selectCategory).toBeVisible();

    const downloadImgProduct = addProductPage.getDownloadImgProduct();
    await expect(downloadImgProduct).toBeVisible();

    const inputQuantity = addProductPage.getInputQuantity();
    await expect(inputQuantity).toBeVisible();

    const btnSubmit = addProductPage.getBtnSubmit();
    await expect(btnSubmit).toBeVisible();
  });

  test('Ввод и отображение значения элементов формы', async () => {
    const addProductPage = new AddProductPage(page);
    await addProductPage.navigate();
    await expect(page).toHaveURL(/dashboard\/admin\/add-product/);

    const inputName = addProductPage.getInputName();
    await expect(inputName).toBeVisible();
    await inputName.fill('Механическая клавиатура');
    const valueInputName = await inputName.inputValue();
    await expect(valueInputName).toBe('Механическая клавиатура');

    const inputPrice = addProductPage.getInputPrice();
    await expect(inputPrice).toBeVisible();
    await inputPrice.fill('10000');
    const valueinputPrice = await inputPrice.inputValue();
    await expect(valueinputPrice).toBe('10000');

    const inputDescription = addProductPage.getInputDescription();
    await expect(inputDescription).toBeVisible();
    const textValue =
      'Товар "Умная кофеварка" - это инновационное устройство, которое позволит вам наслаждаться идеальным кофе каждый день. Она оснащена специальной системой, которая позволяет поддерживать оптимальную температуру воды и правильное давление для приготовления кофе. Благодаря этому, вы сможете насладиться насыщенным ароматом и вкусом свежесваренного кофе в любое время. Кроме того, умная кофеварка имеет функцию программирования, которая позволяет настроить время приготовления кофе заранее, чтобы он был готов к вашему пробуждению. Компактный и стильный дизайн этого устройства позволит ему вписаться в любой интерьер вашей кухни. Приобретая умную кофеварку, вы получаете не только отличный кофе, но и удобство и комфорт в своем доме';
    await inputDescription.fill(textValue);
    const valueInputDescription = await inputDescription.inputValue();
    expect(valueInputDescription).toBe(textValue);

    const selectCategory = addProductPage.getSelectCategory();
    await expect(selectCategory).toBeVisible();
    await selectCategory.selectOption({ label: 'Электроника' });
    const valueSelectCategory = await selectCategory.inputValue();
    expect(valueSelectCategory).toBe('Электроника');

    const downloadImgProduct = addProductPage.getDownloadImgProduct();
    await expect(downloadImgProduct).toBeVisible();
    await downloadImgProduct.setInputFiles('./tests/testData/imgUserPanel/bonfire.png');
    const uploadedFileName = await page.$eval('#product_img', (input) => input.files[0].name);
    expect(uploadedFileName).toBe('bonfire.png');

    const inputQuantity = addProductPage.getInputQuantity();
    await expect(inputQuantity).toBeVisible();
    await inputQuantity.fill('10000');
    const valueInputQuantity = await inputQuantity.inputValue();
    await expect(valueInputQuantity).toBe('10000');

    const btnSubmit = addProductPage.getBtnSubmit();
    await expect(btnSubmit).toBeVisible();
  });
});
