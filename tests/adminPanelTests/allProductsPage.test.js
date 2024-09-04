import { expect, test, chromium } from "playwright/test";
import { setBrowserAdminCookies } from "../utils/setCookies";
import { AllProductsPage } from "../pages/adminPage/allProductsPage";

test.describe.skip('Проверка страницы покупки товаров', () => {

    let browser;
    let context;
    let page;
  
    test.beforeEach(async () => {
      browser = await chromium.launch();
      context = await browser.newContext();

      const email = 'victor@mail.ru';
      const password = 'BETejEmm321';
  
      await setBrowserAdminCookies(context, email, password);

      page = await context.newPage();
    });

    test.afterEach(async () => {
      await browser.close()
    });

  test('Проверка загрузки страницы All Products', async () => {
    
    const allProductsPage = new AllProductsPage(page)
    await allProductsPage.navigate()
    await expect(page).toHaveURL(/dashboard\/admin\/all-products/)

    const filtersForm = allProductsPage.getFiltersForm()
    await expect(filtersForm).toBeVisible()

    const inputSearch = allProductsPage.getInputSearch()
    await expect(inputSearch).toBeVisible()

    const filterCategory = allProductsPage.getFilterCategory()
    await expect(filterCategory).toBeVisible()

    const filterStatus = allProductsPage.getFilterStatus()
    await expect(filterStatus).toBeVisible()

    const sortPrice = allProductsPage.getSortPrice()
    await expect(sortPrice).toBeVisible()

    const btnResetFilters = allProductsPage.getBtnResetFilters()
    await expect(btnResetFilters).toBeVisible()

    const containerProducts = allProductsPage.getProductContainer()
    await expect(containerProducts).toBeVisible()

    const itemProducts = containerProducts.locator('.product-item')
    console.log(itemProducts)
    for (let i = 0; i < await itemProducts.count(); i++) {
        await expect(itemProducts.nth(i)).toBeVisible()
    }

    const btnPrev = allProductsPage.getBtnPrev()
    await expect(btnPrev).toBeVisible()

    const btnNext = allProductsPage.getBtnNext()
    await expect(btnNext).toBeVisible()

    const btnPages = allProductsPage.getBtnPage()

    for (let i = 0; i < await btnPages.count(); i++) {
        await expect(btnPages.nth(i)).toBeVisible()
    }
  })

  test('Фильтрация товаров по поиску (Search)', async () => {
    
    const allProductsPage = new AllProductsPage(page)
    await allProductsPage.navigate()
    await expect(page).toHaveURL(/dashboard\/admin\/all-products/)

    const inputSearch = allProductsPage.getInputSearch()
    await expect(inputSearch).toBeVisible()

    await inputSearch.fill('Смартфон')

                         //Смартфон в формате percent-encoding 
    await page.waitForURL(/search=%D0%A1%D0%BC%D0%B0%D1%80%D1%82%D1%84%D0%BE%D0%BD/);
    const currentUrl = page.url();
    const decodedUrl = decodeURIComponent(currentUrl);
    
    expect(decodedUrl).toContain('search=Смартфон');

    const matches = await page.$$eval('.product-name', products => products.map((product) => product.textContent.toLowerCase())
    .every(product => product.includes('смартфон')))

    expect(matches).toBe(true)

  })

  test('Фильтрация товаров по категории (Category)', async () => {
    
    const allProductsPage = new AllProductsPage(page)
    await allProductsPage.navigate()
    await expect(page).toHaveURL(/dashboard\/admin\/all-products/)

    const categoryFilter = allProductsPage.getFilterCategory()
    await expect(categoryFilter).toBeVisible()

    await categoryFilter.selectOption({ label: 'Электроника' })
    //Электроника в формате percent-encoding 
    await page.waitForURL(/productCategory=%D0%AD%D0%BB%D0%B5%D0%BA%D1%82%D1%80%D0%BE%D0%BD%D0%B8%D0%BA%D0%B0/);
    const currentUrl = page.url();
    const decodedUrl = decodeURIComponent(currentUrl);

    expect(decodedUrl).toContain('&productCategory=Электроника');
    

    const matches = await page.$$eval('.product-category', products => products.map((product) => product.textContent.toLowerCase())
    .every(product => product.includes('электроника')))

    expect(matches).toBe(true)

  })

  test('Фильтрация товаров по статусу (в наличии) (Status = Avaliable)', async () => {
    
    const allProductsPage = new AllProductsPage(page)
    await allProductsPage.navigate()
    await expect(page).toHaveURL(/dashboard\/admin\/all-products/)

    const statusFilter = allProductsPage.getFilterStatus()
    await expect(statusFilter).toBeVisible()

    await statusFilter.selectOption({ label: 'available' })

    await page.waitForURL(/productStatus=available/);

    const currentUrl = page.url();
    expect(currentUrl).toContain('&productStatus=available');
    
    const matches = await page.$$eval('.product-status', products => products.map((product) => product.textContent.toLowerCase())
    .every(product => product.includes('available')))

    expect(matches).toBe(true)

  })

  test('Фильтрация товаров по статусу (не в наличии) (Status = Ended)', async () => {
    
    const allProductsPage = new AllProductsPage(page)
    await allProductsPage.navigate()
    await expect(page).toHaveURL(/dashboard\/admin\/all-products/)

    const statusFilter = allProductsPage.getFilterStatus()
    await expect(statusFilter).toBeVisible()

    await statusFilter.selectOption({ label: 'ended' })

    await page.waitForURL(/productStatus=ended/);

    const currentUrl = page.url();
    expect(currentUrl).toContain('&productStatus=ended');
    
    const matches = await page.$$eval('.product-status', products => products.map((product) => product.textContent.toLowerCase())
    .every(product => product.includes('ended stock')))

    expect(matches).toBe(true)

  })

  test('Сортировка товаров по цене (Price по возрастанию)', async () => {
    
    const allProductsPage = new AllProductsPage(page)
    await allProductsPage.navigate()
    await expect(page).toHaveURL(/dashboard\/admin\/all-products/)

    const sortPrice = allProductsPage.getSortPrice()
    await expect(sortPrice).toBeVisible()

    await sortPrice.selectOption({ label: 'asc' })

    await page.waitForURL(/sort=asc/);

    const currentUrl = page.url();
    expect(currentUrl).toContain('&sort=asc');

    const itemsProduct = allProductsPage.getProductContainer().locator('.product-item')
    let priceItems = []
    for (let i = 0; i < await itemsProduct.count(); i++) {
        const priceText = await itemsProduct.nth(i).locator('.product-price').isVisible({timeout: 500}) ?  await itemsProduct.nth(i).locator('.product-price').textContent() : await itemsProduct.nth(i).locator('.fa-percentage').textContent()
        
        const convertPriceToInteger = +priceText.replace(/[^0-9]/g, '')
        priceItems.push(convertPriceToInteger)
    }
    
        function isArraySortedAscending(arr) {
            return arr.every((element, index) => {
                if (index === 0) return true
                return element >= arr[index - 1]
            })
        }

        expect(isArraySortedAscending(priceItems)).toBe(true)
  })

  test('Сортировка товаров по цене (Price по убыванию)', async () => {
    
    const allProductsPage = new AllProductsPage(page)
    await allProductsPage.navigate()
    await expect(page).toHaveURL(/dashboard\/admin\/all-products/)

    const sortPrice = allProductsPage.getSortPrice()
    await expect(sortPrice).toBeVisible()

    await sortPrice.selectOption({ label: 'desc' })

    await page.waitForURL(/sort=desc/);

    const currentUrl = page.url();
    expect(currentUrl).toContain('&sort=desc');

    const itemsProduct = allProductsPage.getProductContainer().locator('.product-item')
    let priceItems = []
    for (let i = 0; i < await itemsProduct.count(); i++) {
        const priceText = await itemsProduct.nth(i).locator('.product-price').isVisible({timeout: 500}) ?  await itemsProduct.nth(i).locator('.product-price').textContent() : await itemsProduct.nth(i).locator('.fa-percentage').textContent()
        
        const convertPriceToInteger = +priceText.replace(/[^0-9]/g, '')
        priceItems.push(convertPriceToInteger)
    }
    
        function isArraySortedDescending(arr) {
            return arr.every((element, index) => {
                if (index + 1 < arr.length) {
                return element >= arr[index + 1]
                }

                return true
            })
        }

        expect(isArraySortedDescending(priceItems)).toBe(true)
  })

  test('Сброс фильтров', async () => {
    
    const allProductsPage = new AllProductsPage(page)
    await allProductsPage.navigate()
    await expect(page).toHaveURL(/dashboard\/admin\/all-products/)

    const sortPrice = allProductsPage.getSortPrice()
    await expect(sortPrice).toBeVisible()
    await sortPrice.selectOption({ label: 'desc' })

    const inputSearch = allProductsPage.getInputSearch()
    await expect(inputSearch).toBeVisible()
    await inputSearch.fill('Смартфон')

    const categoryFilter = allProductsPage.getFilterCategory()
    await expect(categoryFilter).toBeVisible()
    await categoryFilter.selectOption({ label: 'Электроника' })

    const statusFilter = allProductsPage.getFilterStatus()
    await expect(statusFilter).toBeVisible()
    await statusFilter.selectOption({ label: 'available' })

    const btnResetFilters = allProductsPage.getBtnResetFilters()
    await btnResetFilters.click()

    await page.waitForURL('http://localhost:5173/dashboard/admin/all-products');

  })

  test('Пагинация страниц', async () => {
    
    const allProductsPage = new AllProductsPage(page)
    await allProductsPage.navigate()
    await expect(page).toHaveURL(/dashboard\/admin\/all-products/)

    const btnNext = allProductsPage.getBtnNext()
    await btnNext.click()

    await page.waitForURL(/page=2/)

    const pageBtn = allProductsPage.getBtnPage()
    const countPageBtn = await pageBtn.count()
    await expect(pageBtn.nth(0)).toBeVisible()
    await expect(pageBtn.nth(1)).toBeVisible()
    expect(countPageBtn).toBe(2)

    await expect(pageBtn.nth(1)).toHaveClass(/active/)

    let productItems = allProductsPage.getProductContainer().locator('.product-item')

    for (let i = 0; i < await productItems.count(); i++ ) {
        const productItem = productItems.nth(i)
        await expect(productItem).toBeVisible()
    }

    await pageBtn.nth(0).click()
    await page.waitForURL(/page=1/)

    productItems = allProductsPage.getProductContainer().locator('.product-item')

    for (let i = 0; i < await productItems.count(); i++ ) {
        const productItem = productItems.nth(i)
        await expect(productItem).toBeVisible()
    }
    
    await pageBtn.nth(1).click()
    await page.waitForURL(/page=2/)

  })

  test('Отображение и проверка содержимого модального окна управления скидками', async () => {
    
    const allProductsPage = new AllProductsPage(page)
    await allProductsPage.navigate()
    await expect(page).toHaveURL(/dashboard\/admin\/all-products/)

    const btnNext = allProductsPage.getProductContainer().locator('.product-item')
    const btnOpenModalSetDiscount = btnNext.nth(0).locator('.discount-btn')

    await btnOpenModalSetDiscount.click()

    const modalDiscount = page.locator('.modal-discount')
    await expect(modalDiscount).toBeVisible()

    const formTitle = modalDiscount.locator('.form-title')
    await expect(formTitle).toBeVisible()

    const inputDiscountPercentage = modalDiscount.locator('#percentage')
    await expect(inputDiscountPercentage).toBeVisible()

    const inputStartDate = modalDiscount.locator('.start-date') 
    await expect(inputStartDate).toBeVisible()
    await inputStartDate.click()

    const containerDatePicker = await modalDiscount.locator('.react-datepicker__month-container')
    await expect(containerDatePicker).toBeVisible()
    await inputDiscountPercentage.click({position: {x: 25, y: 10}})
    expect(await containerDatePicker.count()).toBe(0)
    
    const inputEndDate = modalDiscount.locator('.end-date')
    await expect(inputEndDate).toBeVisible()
    await inputEndDate.click()
    await expect(containerDatePicker).toBeVisible()
    await inputDiscountPercentage.click({position: {x: 25, y: 10}})
    expect(await containerDatePicker.count()).toBe(0)

    const saveBtn = modalDiscount.locator('.save-btn')
    await expect(saveBtn).toBeVisible()

    const deleteBtn = modalDiscount.locator('.delete-btn')
    await expect(deleteBtn).toBeVisible()

    const closeBtn = modalDiscount.locator('.close')
    await expect(closeBtn).toBeVisible()
    await closeBtn.click()
    expect(await modalDiscount.count()).toBe(0)
  })
})