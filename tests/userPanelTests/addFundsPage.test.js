import { expect, test, chromium } from "playwright/test";
import { setBrowserCookies } from "../utils/setCookies";
import { AddFundsPage } from "../pages/userPage/addFundsPage";


test.describe.skip('Проверка страницы Add Funds', () => {

    let browser
    let page
    let context

    test.beforeEach(async () => {
        browser = await chromium.launch()
        context = await browser.newContext()

        const email = 'victor@mail.ru';
        const password = 'BETejEmm321';
    
        await setBrowserCookies(context, email, password);
  
        page = await context.newPage();
    })

    test.afterEach(async () => {
        await browser.close()
      });

    test('Загрузка страницы Add Funds', async () => {

        const addFundsPage = new AddFundsPage(page)
        addFundsPage.navigate()

        await expect(page).toHaveURL(/.*dashboard\/user\/add-funds/)

        const addFundsContainer = addFundsPage.getAddFundsContainer()
        await expect(addFundsContainer).toBeVisible()

        const header = addFundsPage.getHeader()
        await expect(header).toBeVisible()

        const paymentMethods = addFundsPage.getPaymentMethods()

        for (let i = 0; i < await paymentMethods.count; i++) {
            const paymentMethod = paymentMethods.nth(i)
            
            await expect(paymentMethod).toBeVisible()
        }
    })

    test('Загрузка элемента ввода суммы', async () => {

        const addFundsPage = new AddFundsPage(page)
        addFundsPage.navigate()
        await expect(page).toHaveURL(/.*dashboard\/user\/add-funds/)

        const paymentMethods = addFundsPage.getPaymentMethods()
        await paymentMethods.nth(0).click()

        const currentMethod = addFundsPage.getCurrentMethod()
        await expect(currentMethod).toBeVisible()

        const amountInput = addFundsPage.getAmountInput()
        await expect(amountInput).toBeVisible()
        await amountInput.fill('50')

        const totalPrice = addFundsPage.getTotalPrice()
        await expect(totalPrice).toBeVisible()

        const currentAmount = await totalPrice.locator('span:nth-child(2)').textContent()
        expect(currentAmount).toBe('$ 50.00')

        const btnGoToPayment = addFundsPage.getBtnToPayment()
        await expect(btnGoToPayment).toBeVisible()

        const btnBackToSelectPayment = addFundsPage.getBtnBackToSelectPayment()
        await expect(btnBackToSelectPayment).toBeVisible()
        await btnBackToSelectPayment.click()
        
        const addFundsContainer = addFundsPage.getAddFundsContainer()
        await expect(addFundsContainer).toBeVisible()
    })
})