import { expect, test, chromium } from 'playwright/test';
import { BuyProducts } from '../classPageObject/userPage/buyProducts';
import { setBrowserCookies } from '../utils/setCookies';

test.describe('Проверка страницы покупки товаров', () => {
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

  test('Загрузка страницы Buy Products', async () => {
    const buyProductsPage = new BuyProducts(page);
    await buyProductsPage.navigate();

    await expect(page).toHaveURL(/.*dashboard\/user\/all-products/);

    const countProductAfterFilters = buyProductsPage.getCountProductAfterFilters();
    const containerFilters = buyProductsPage.getFiltersContainer();

    await expect(countProductAfterFilters).toBeVisible();
    await expect(containerFilters).toBeVisible();
  });

  test('Фильтрация товаров по поиску (search)', async () => {
    const buyProductsPage = new BuyProducts(page);
    const countProductAfterFilters = buyProductsPage.getCountProductAfterFilters();
    await buyProductsPage.navigate();
    const filterSearch = buyProductsPage.getFilterSearch();
    await expect(filterSearch).toBeVisible();

    await filterSearch.fill('Смартфон');
    //Смартфон в формате percent-encoding
    await page.waitForURL(/search=%D0%A1%D0%BC%D0%B0%D1%80%D1%82%D1%84%D0%BE%D0%BD/);
    const currentUrl = page.url();
    const decodedUrl = decodeURIComponent(currentUrl);

    expect(decodedUrl).toContain('search=Смартфон');

    const allProductsMatch = await page.$$eval('.product-containter', (products) =>
      products.map((product) => product.textContent.toLowerCase()).every((text) => text.includes('смартфон')),
    );
    expect(allProductsMatch).toBe(true);

    const resultCount = await countProductAfterFilters.textContent();
    const match = resultCount.match(/\d+/); // Находит все цифры
    const count = match ? parseInt(match[0], 10) : 0; // Преобразование в число
    expect(count).toBe(2);
  });

  test('Фильтрация товаров по категории (Category)', async () => {
    const buyProductsPage = new BuyProducts(page);
    const countProductAfterFilters = buyProductsPage.getCountProductAfterFilters();
    await buyProductsPage.navigate();
    const categoryFilter = buyProductsPage.getFilterCategory();
    await expect(categoryFilter).toBeVisible();

    await categoryFilter.selectOption({ label: 'Электроника' });
    //Электроника в формате percent-encoding
    await page.waitForURL(/category=%D0%AD%D0%BB%D0%B5%D0%BA%D1%82%D1%80%D0%BE%D0%BD%D0%B8%D0%BA%D0%B0/);
    const currentUrl = page.url();
    const decodedUrl = decodeURIComponent(currentUrl);

    expect(decodedUrl).toContain('&category=Электроника');

    const allProductsMatch = await page.$$('.product-containter');
    expect(allProductsMatch.length).toBe(10);

    const resultCount = await countProductAfterFilters.textContent();
    const match = resultCount.match(/\d+/); // Находит все цифры
    const count = match ? parseInt(match[0], 10) : 0; // Преобразование в число
    expect(count).toBe(12);
  });

  test('Сортировка товаров по цене (Price по возрастанию)', async () => {
    const buyProductsPage = new BuyProducts(page);
    await buyProductsPage.navigate();
    const sortPrice = buyProductsPage.getSortPrice();

    await expect(sortPrice).toBeVisible();

    await sortPrice.selectOption({ label: 'asc' });

    await page.waitForURL(/Sort\+by\+price=asc/);

    const allProductsMatch = await page.$$eval('.product-price', (element) =>
      element.map((product_price) => {
        const text = product_price.textContent;

        const cleanedText = text.replace(/[^0-9,]/g, '');

        const number = parseInt(cleanedText.replace(/,/g, ''), 10);

        return number;
      }),
    );

    function isArraySortedAscending(arr) {
      return arr.every((value, index) => {
        if (index === 0) return true;
        return value >= arr[index - 1];
      });
    }

    expect(isArraySortedAscending(allProductsMatch)).toBe(true);
  });

  test('Сортировка товаров по цене (Price по убыванию)', async () => {
    const buyProductsPage = new BuyProducts(page);
    await buyProductsPage.navigate();
    const sortPrice = buyProductsPage.getSortPrice();

    await expect(sortPrice).toBeVisible();

    await sortPrice.selectOption({ label: 'desc' });

    await page.waitForURL(/Sort\+by\+price=desc/);

    const allProductsMatch = await page.$$eval('.product-price', (element) =>
      element.map((product_price) => {
        const text = product_price.textContent;

        const cleanedText = text.replace(/[^0-9,]/g, '');

        const number = parseInt(cleanedText.replace(/,/g, ''), 10);

        return number;
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

    expect(isArraySortedDescending(allProductsMatch)).toBe(true);
  });

  test('Сортировка товаров по рейтингу (Rating по возрастанию)', async () => {
    const buyProductsPage = new BuyProducts(page);
    await buyProductsPage.navigate();
    const sortRating = buyProductsPage.getSortRating();

    await expect(sortRating).toBeVisible();

    await sortRating.selectOption({ label: 'asc' });

    await page.waitForURL(/Sort\+by\+rating=asc/);

    const allProductsMatch = await page.$$eval('.product-containter', (containers) =>
      containers.map((container) => {
        const productRatingElement = container.querySelector('[data-rating]');
        const rating = productRatingElement ? Number(productRatingElement.getAttribute('data-rating')) : null;
        return rating;
      }),
    );

    function isArraySortedAscending(arr) {
      return arr.every((value, index) => {
        if (index === 0) return true;
        return value >= arr[index - 1];
      });
    }

    expect(isArraySortedAscending(allProductsMatch)).toBe(true);
  });

  test('Сортировка товаров по рейтингу (Rating по убыванию)', async () => {
    const buyProductsPage = new BuyProducts(page);
    await buyProductsPage.navigate();
    const sortRating = buyProductsPage.getSortRating();

    await expect(sortRating).toBeVisible();

    await sortRating.selectOption({ label: 'desc' });

    await page.waitForURL(/Sort\+by\+rating=desc/);

    const allProductsMatch = await page.$$eval('.product-containter', (containers) =>
      containers.map((container) => {
        const productRatingElement = container.querySelector('[data-rating]');
        const rating = productRatingElement ? Number(productRatingElement.getAttribute('data-rating')) : null;
        return rating;
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

    expect(isArraySortedDescending(allProductsMatch)).toBe(true);
  });

  test('Фильтрация товаров по диапазону цен (Range)', async () => {
    const buyProductsPage = new BuyProducts(page);
    await buyProductsPage.navigate();
    const rangeTrack = buyProductsPage.getRangeTrack();
    const getShowRange = buyProductsPage.getShowRangeBtn();
    const getHiddenRange = buyProductsPage.getHiddenRangeBtn();
    const applyBtn = buyProductsPage.getBtnApplyRange();

    await expect(getShowRange).toBeVisible();
    await expect(getShowRange).toHaveClass(/hidden-range/);

    await getShowRange.click();
    await expect(rangeTrack).toBeVisible();
    await expect(getHiddenRange).toHaveClass(/show-range/);

    const trackBox = await rangeTrack.boundingBox();

    const rigthSlider = buyProductsPage.getRigthSlider();
    await expect(rigthSlider).toBeVisible();

    const boundingRigthSlider = await rigthSlider.boundingBox();

    if (boundingRigthSlider && trackBox) {
      const startX = trackBox.x;
      const newX = startX + boundingRigthSlider.width * 0.09;
      await page.mouse.move(
        boundingRigthSlider.x + boundingRigthSlider.width / 2,
        boundingRigthSlider.y + boundingRigthSlider.height / 2,
      );
      await page.mouse.down();
      await page.mouse.move(newX, boundingRigthSlider.y + boundingRigthSlider.height / 2);
      await page.mouse.up();
    }

    await applyBtn.click();

    await page.waitForURL(/minPrice=0&maxPrice=2976/);

    const getValueRigthSlider = await page.$$eval('.track-values > div:nth-child(2)', (element) =>
      element.map((el) => +el.getAttribute('aria-valuenow')),
    );
    const allProductsMatch = await page.$$('.product-containter');

    expect(...getValueRigthSlider).toBe(2976);
    expect(allProductsMatch.length).toBe(3);
  });

  test('Сброс фильтров', async () => {
    const buyProductsPage = new BuyProducts(page);
    const sortRating = buyProductsPage.getSortRating();
    const filterSearch = buyProductsPage.getFilterSearch();
    const categoryFilter = buyProductsPage.getFilterCategory();
    const sortPrice = buyProductsPage.getSortPrice();
    const getBtnResetFilters = buyProductsPage.getBtnResetFilters();

    await buyProductsPage.navigate();

    await expect(getBtnResetFilters).toBeVisible();
    await sortRating.selectOption({ label: 'asc' });
    await sortPrice.selectOption({ label: 'desc' });
    await filterSearch.fill('products');
    await categoryFilter.selectOption({ label: 'Одежда' });

    await getBtnResetFilters.click();

    await page.waitForURL(/dashboard\/user\/all-products$/);
  });

  test('Загрузка карточки товара', async () => {
    const buyProductsPage = new BuyProducts(page);
    await buyProductsPage.navigate();

    await page.waitForSelector('.product-containter');

    const productsContainers = buyProductsPage.getProductContainer();

    for (let i = 0; i < (await productsContainers.count()); i++) {
      const product = productsContainers.nth(i);
      await expect(product).toBeVisible();

      const name = product.locator('.product-name');
      expect(name).toBeVisible();

      const price = product.locator('.product-price');
      expect(price).toBeVisible();

      const header = product.locator('.product-header');
      expect(header).toBeVisible();

      const img = product.locator('.product_img');
      expect(img).toBeVisible();
    }
  });

  test('Отображение и проверка содержимого модального окна покупки товара', async () => {
    const buyProductsPage = new BuyProducts(page);
    const modalsBuyProduct = buyProductsPage.getModalBuyProduct();
    const modalBuyProduct = modalsBuyProduct.nth(0);
    await buyProductsPage.navigate();

    await page.waitForSelector('.product-containter');

    const productsContainers = buyProductsPage.getProductContainer();
    const product = productsContainers.nth(0);

    await product.locator('.action-buy').click();

    await expect(modalBuyProduct).toBeVisible();

    const nameProduct = modalBuyProduct.locator('.name-product');
    await expect(nameProduct).toBeVisible();

    const quantityProduct = modalBuyProduct.locator('#product-quantity');
    await expect(quantityProduct).toBeVisible();
    expect(+(await quantityProduct.inputValue())).toBe(1);

    const paymentMethod = modalBuyProduct.locator('#payment-method');
    await expect(paymentMethod).toBeVisible();
    await expect(await paymentMethod.inputValue()).toBe('Credit Card');

    const resultPrice = modalBuyProduct.locator('.result');
    await expect(resultPrice).toBeVisible();

    const btnBuyProduct = modalBuyProduct.locator('.action-buy');
    await expect(btnBuyProduct).toBeVisible();

    const closeModalBuyProduct = modalBuyProduct.locator('.close-btn');
    await closeModalBuyProduct.click();

    await expect(modalBuyProduct).toBeHidden();
  });

  test('Отображение и проверка содержимого модального окна описания товара', async () => {
    const buyProductsPage = new BuyProducts(page);
    await buyProductsPage.navigate();

    const hoverElementsDescriptionProduct = buyProductsPage.getDescriptionProduct();

    const hoverElementDescriptionProduct = hoverElementsDescriptionProduct.nth(0);

    await expect(hoverElementDescriptionProduct).toBeHidden();

    const imageProduct = buyProductsPage.getProductContainer().locator('.product_img');

    await imageProduct.nth(0).hover();

    const buttonActivateModalDescription = hoverElementDescriptionProduct.locator('.button-descr');
    await expect(buttonActivateModalDescription).toBeVisible();
    await buttonActivateModalDescription.click();

    const modalsDescription = buyProductsPage.getModalDescription();
    const modalDescription = modalsDescription.nth(0);

    await expect(modalDescription).toBeVisible();

    const productName = modalDescription.locator('.product-name');
    await expect(productName).toBeVisible();

    const productId = modalDescription.locator('.product-id');
    await expect(productId).toBeVisible();

    const productContentDescription = modalDescription.locator('.descr-content');
    await expect(productContentDescription).toBeVisible();
  });

  test('Пагинация страниц', async () => {
    const buyProductsPage = new BuyProducts(page);
    await buyProductsPage.navigate();

    const nextBtn = buyProductsPage.getNextBtn();
    await expect(nextBtn).toBeVisible();

    const prevBtn = buyProductsPage.getPrevBtn();
    await expect(prevBtn).toBeVisible();

    const pageBtn = buyProductsPage.getPageBtn();
    const countPageBtn = await pageBtn.count();
    await expect(pageBtn.nth(0)).toBeVisible();
    await expect(pageBtn.nth(1)).toBeVisible();
    expect(countPageBtn).toBe(2);

    await nextBtn.click();
    await page.waitForURL(/page=2/);
    await expect(pageBtn.nth(1)).toHaveClass(/active/);

    let productItems = buyProductsPage.getProductContainer();

    for (let i = 0; i < (await productItems.count()); i++) {
      const productItem = productItems.nth(i);
      await expect(productItem).toBeVisible();
    }
    // проверка пагинации через нумерацию
    await pageBtn.nth(0).click();
    await page.waitForURL(/page=1/);

    productItems = buyProductsPage.getProductContainer();

    for (let i = 0; i < (await productItems.count()); i++) {
      const productItem = productItems.nth(i);
      await expect(productItem).toBeVisible();
    }

    await pageBtn.nth(1).click();
    await page.waitForURL(/page=2/);
  });
});
