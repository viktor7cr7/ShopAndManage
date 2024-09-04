import { expect,test } from "playwright/test";
import { authCookieAndNewContextUser } from "../../utils/authCookieAndNewContext";
import { DashboardPage } from "../../pages/userPage/dashboardPage";
import { AddFundsPage } from "../../pages/userPage/addFundsPage";
import { TransactionsPage } from "../../pages/userPage/transactionsPage";

    test.skip('Пополнение баланса', async () => {

        const page = await authCookieAndNewContextUser()
        const addFundsPage = new AddFundsPage(page)
        const dashboardPage = new DashboardPage(page)
        await addFundsPage.navigate()
        
        const amountValue = '500'

        let startBalanceUser = await dashboardPage.getBalanceBtn().textContent()
        startBalanceUser = startBalanceUser.replace(/[^0-9.]/g, '').split('.')[0]

        await addFundsPage.navigate()

        const btnCartPaymentMethod = addFundsPage.getPaymentMethods() 
        await btnCartPaymentMethod.click()

        const inputQuantity = addFundsPage.getAmountInput()
        await inputQuantity.fill(amountValue)

        const textTotalPriceReplenishment = await addFundsPage.getTotalPrice().textContent()
        const totalPriceReplenishment = textTotalPriceReplenishment.replace(/[^0-9.]/g, '').split('.')[0]

        const btnToPayment = addFundsPage.getBtnToPayment()
        await btnToPayment.click()

        await page.waitForURL(/checkout\.stripe\.com/)

        const textCurrentAmountStripe = await page.locator('.CurrencyAmount').textContent()
        const totalPriceStripe = textCurrentAmountStripe.replace(/[^0-9.]/g, '').split('.')[0]
        expect(totalPriceReplenishment).toBe(totalPriceStripe)

        const stripeEmailInput = page.locator('#email')
        await stripeEmailInput.fill('victor@gmail.com')

        const stripeCartInput = page.locator('#cardNumber')
        await stripeCartInput.fill('4242 4242 4242 4242')

        const stripeCartExpireInput = page.locator('#cardExpiry')
        await stripeCartExpireInput.fill('0130')

        const stripeCartCVCInput = page.locator('#cardCvc')
        await stripeCartCVCInput.fill('343')

        const stripeBillingNameInput = page.locator('#billingName')
        await stripeBillingNameInput.fill('test')

        const stripePostalCodeInput = page.locator('#billingPostalCode')
        await stripePostalCodeInput.fill('5354533')

        const btnSubmitBuy = page.locator('.SubmitButton-IconContainer')
        await btnSubmitBuy.click()

        await page.waitForURL(/dashboard\/user\/transaction/)

        const transactionsPage = new TransactionsPage(page)
        const tableTransactions = transactionsPage.getTableBody().locator('tr').last()

        const textAmountTransaction = await tableTransactions.locator('td:nth-child(2)').textContent()
        const amountTransaction = textAmountTransaction.replace(/[^0-9]/g, '')
        expect(+amountTransaction).toBe(+amountValue * 87.90)

        const statusTransaction = await tableTransactions.locator('td:nth-child(3)').textContent()
        expect(statusTransaction).toBe('paid')

        const currentBalance = dashboardPage.getBalanceBtn()

        let textCurrentBalanceUser = await currentBalance.textContent()
        textCurrentBalanceUser = textCurrentBalanceUser.replace(/[^0-9]/g, '')

        expect(+textCurrentBalanceUser).toBe(+startBalanceUser + (amountValue * 87.90))

    })