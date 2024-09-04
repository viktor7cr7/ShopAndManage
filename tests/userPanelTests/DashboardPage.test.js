import { expect, test, chromium } from "playwright/test";
import { setBrowserCookies } from "../utils/setCookies";
import { DashboardPage } from "../pages/userPage/dashboardPage";


test.describe.skip('Проверка Dashboard', () => {
    let browser
    let context
    let page

    test.beforeEach(async () => {

        browser = await chromium.launch()
        context = await browser.newContext()

        const email = 'victor@mail.ru';
        const password = 'BETejEmm321';

        await setBrowserCookies(context, email, password)

        page = await context.newPage()
    })

    test.afterEach(async () => {
        await browser.close()
      })

    test('Проверка отображения элементов Dashboard', async () => {

        const dashboardPage = new DashboardPage(page)
        await dashboardPage.navigate()
        await page.waitForURL(/dashboard\/user\/all-products/)

        const dashboardTitle = dashboardPage.getDashboardTitle()
        expect(await dashboardTitle.innerText()).toBe('Dashboard')

        const balanceBtn = dashboardPage.getBalanceBtn()
        await expect(balanceBtn).toBeVisible()

        const addFundsBtn = balanceBtn.locator('.add-funds-btn')
        expect(await addFundsBtn.count()).toBe(0)

        await balanceBtn.click()
        expect(addFundsBtn).toBeVisible()

        const cartBtn = dashboardPage.getCartBtn()
        await expect(cartBtn).toBeVisible()

        const dashboardLogoutBtn = dashboardPage.getLogoutBtn()
        await expect(dashboardLogoutBtn).toBeVisible()

        const dropDownLogout = page.locator('.dropdown')
        await expect(dropDownLogout).toBeHidden()

        await dashboardLogoutBtn.click()
        await expect(dropDownLogout).toBeVisible()

    })

    test('Проверка отображения элементов корзины', async () => {

        const dashboardPage = new DashboardPage(page)
        await dashboardPage.navigate()
        await page.waitForURL(/dashboard\/user\/all-products/)

        const cartBtn = dashboardPage.getCartBtn()
        await cartBtn.click()

        const modalCart = dashboardPage.getCartModal()
        await expect(modalCart).toBeVisible()

        const titleCart = modalCart.locator('.title-cart')
        await expect(titleCart).toBeVisible()
        expect(await titleCart.innerText()).toBe('Cart')

        const contentCart = modalCart.locator('.content-cart')
        await expect(contentCart).toBeVisible()

        const totalCost = modalCart.locator('.cart-totalCost')
        await expect(totalCost).toBeVisible()

        const selectPaymentMethod = modalCart.locator('#selectPayment')
        await expect(selectPaymentMethod).toBeVisible()
        expect(await selectPaymentMethod.inputValue()).toBe('Credit Card')
        await selectPaymentMethod.selectOption({label: 'Balance'})
        expect(await selectPaymentMethod.inputValue()).toBe('Balance')

        const buyBtn = modalCart.locator('.buy-btn')
        await expect(buyBtn).toBeVisible()

    })


})