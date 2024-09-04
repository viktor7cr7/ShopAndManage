import { expect,test } from "playwright/test";
import { authCookieAndNewContextUser } from "../../utils/authCookieAndNewContext";
import { createProduct } from "../../utils/createProduct";
import { BuyProducts } from "../../pages/userPage/buyProducts";
import { DashboardPage } from "../../pages/userPage/dashboardPage";
import { ProfilePage } from "../../pages/userPage/profilePage";
import { deleteProduct } from "../../utils/deleteProduct";
import { dbConnect } from "../../../backend/dbConnect";

test.skip('Обновление уровня грейда до максимального', async () => {

    await dbConnect.query('TRUNCATE TABLE orders CASCADE')

    const {valueName} = await createProduct()
    const page = await authCookieAndNewContextUser()
    const buyProductsPage = new BuyProducts(page)
    const dashboardPage = new DashboardPage(page)
    const profilePage = new ProfilePage(page)
    await buyProductsPage.navigate()
   
    const btnPages = buyProductsPage.getPageBtn()
    await btnPages.nth(1).click()

    const productItems = buyProductsPage.getProductContainer()
    let addingProduct = await productItems.locator(`text=${valueName}`).locator('../../../..')
    expect(addingProduct).toBeVisible()

    const btnAddToCart = await addingProduct.locator('.add-to-cart')
    await btnAddToCart.click()

    const toastifyNotification = page.locator('.Toastify__toast-body')
    await expect(toastifyNotification).toBeVisible()
    expect(await toastifyNotification.innerText()).toBe('Товар добавлен в корзину')

    const btnOpenCart = dashboardPage.getCartBtn()
    await btnOpenCart.click()

    const modalCart = dashboardPage.getCartModal()
    await expect(modalCart).toBeVisible()
    
    const selectPaymentMethodsCart = modalCart.locator('#selectPayment')
    await selectPaymentMethodsCart.selectOption({label: 'Balance'}) 

    const btnBuyCart = modalCart.locator('.buy-btn')
    await btnBuyCart.click()

    await page.waitForURL(/dashboard\/user\/orders/)

    await profilePage.navigate()

    const progressBar = profilePage.getGradesContainer().locator('.progress-bar > div');
    const currentPercentage = await progressBar.getAttribute('percentage');
    expect(currentPercentage).toBe('320')

    const infoGragesText = profilePage.getMyInfoGrades().locator('.info-text')

    const summaryAmount = await infoGragesText.nth(0).locator('.info-value').textContent()
    expect(summaryAmount).toBe('160000 руб')

    const currentLevel = await infoGragesText.nth(1).locator('.info-value').textContent()
    expect(currentLevel).toBe('Лидер')

    const nextLevel = await infoGragesText.nth(2).locator('.info-value').textContent()
    expect(nextLevel).toBe('Максимальный уровень')

    const percentage = await infoGragesText.nth(3).locator('.info-value-discount').textContent()
    expect(percentage).toBe('25%')

    await buyProductsPage.navigate()
   
    await btnPages.nth(1).click()

    addingProduct = await productItems.locator(`text=${valueName}`).locator('../../../..')

    const textPriceProductDiscount = await addingProduct.locator('.product-price').textContent()
    const priceProductDiscount = textPriceProductDiscount.replace(/[^0-9]/g, '')

    expect(priceProductDiscount).toBe('120000')

    await deleteProduct()
})