import { expect, test, chromium } from "playwright/test";
import { setBrowserCookies } from "../utils/setCookies";
import { TransactionsPage } from "../pages/userPage/transactionsPage";

test.describe.skip('Проверка страницы Transactions', () => {

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

    test('Загрузка страницы Transactions', async () => {
        
        const transactionPage = new TransactionsPage(page)
        await transactionPage.navigate()

        await expect(page).toHaveURL(/dashboard\/user\/transaction/)

        const sortId = transactionPage.getSortId()
        await expect(sortId).toBeVisible()
        
        const sortAmount = transactionPage.getSortAmount()
        await expect(sortAmount).toBeVisible()

        const sortStatus = transactionPage.getSortStatus()
        await expect(sortStatus).toBeVisible()

        const sortCreatedAt = transactionPage.getSortCreatedAt()
        await expect(sortCreatedAt).toBeVisible()

        const tableBody = transactionPage.getTableBody()
        await expect(tableBody).toBeVisible()
    })

    test('Сортировка по айди (ID по возрастанию)', async () => {
        
        const transactionPage = new TransactionsPage(page)
        await transactionPage.navigate()

        await expect(page).toHaveURL(/dashboard\/user\/transaction/)

        const sortId = transactionPage.getSortId()
        await expect(sortId).toBeVisible()
        await sortId.click()

        const rowsId = transactionPage.getTableBody().locator('tr > td:nth-child(1)')
        let allValueId = []
        for (let i = 0; i < await rowsId.count(); i++) {

            const textId = await rowsId.nth(i).textContent()
            allValueId.push(textId)
        }

        function isArraySortedAscending(arr) {
            return arr.every((value, index) => {
                if (index === 0) return true;
                return value >= arr[index - 1];
            });
        }

        expect(isArraySortedAscending(allValueId)).toBe(true)
    })

    test('Сортировка по айди (ID по убыванию)', async () => {
        
        const transactionPage = new TransactionsPage(page)
        await transactionPage.navigate()

        await expect(page).toHaveURL(/dashboard\/user\/transaction/)

        const sortId = transactionPage.getSortId()
        await expect(sortId).toBeVisible()
        await sortId.click()
        await sortId.click()

        const rowsId = transactionPage.getTableBody().locator('tr > td:nth-child(1)')
        let allValueId = []
        for (let i = 0; i < await rowsId.count(); i++) {

            const textId = await rowsId.nth(i).textContent()
            allValueId.push(textId)
        }

        function isArraySortedDescending(arr) {
            return arr.every((value, index) => {
                    
                if (index + 1 < arr.length) {
                    return value >= arr[index + 1]
                }

                return true
            });
        }

        expect(isArraySortedDescending(allValueId)).toBe(true)
    })

    test('Сортировка по сумме транзакции (Amount по возрастанию)', async () => {
        
        const transactionPage = new TransactionsPage(page)
        await transactionPage.navigate()

        await expect(page).toHaveURL(/dashboard\/user\/transaction/)

        const sortAmount = transactionPage.getSortAmount()
        await expect(sortAmount).toBeVisible()
        await sortAmount.click()

        const rowsAmount = transactionPage.getTableBody().locator('tr > td:nth-child(2)')
        let allValueAmount = []
        for (let i = 0; i < await rowsAmount.count(); i++) {

            const amountText = await rowsAmount.nth(i).textContent()
            const transofrmAmountToInteger = +amountText.replace(/[^0-9]/g, '')
            allValueAmount.push(transofrmAmountToInteger)
        }

        function isArraySortedAscending(arr) {
            return arr.every((value, index) => {
                    
                if (index === 0) return true

                return value >= arr[index - 1]
            });
        }

        expect(isArraySortedAscending(allValueAmount)).toBe(true)
    })

    test('Сортировка по сумме транзакции (Amount по убыванию)', async () => {
        
        const transactionPage = new TransactionsPage(page)
        await transactionPage.navigate()

        await expect(page).toHaveURL(/dashboard\/user\/transaction/)

        const sortAmount = transactionPage.getSortAmount()
        await expect(sortAmount).toBeVisible()
        await sortAmount.click()
        await sortAmount.click()

        const rowsAmount = transactionPage.getTableBody().locator('tr > td:nth-child(2)')
        let allValueAmount = []
        for (let i = 0; i < await rowsAmount.count(); i++) {

            const amountText = await rowsAmount.nth(i).textContent()
            const transofrmAmountToInteger = +amountText.replace(/[^0-9]/g, '')
            allValueAmount.push(transofrmAmountToInteger)
        }

        function isArraySortedDescending(arr) {
            return arr.every((value, index) => {
                    
                if (index + 1 < arr.length) {
                    return value >= arr[index + 1]
                }
                return true
            });
        }

        expect(isArraySortedDescending(allValueAmount)).toBe(true)
    })

    test('Сортировка по статусу транзакции (Status по возрастанию)', async () => {
        
        const transactionPage = new TransactionsPage(page)
        await transactionPage.navigate()

        await expect(page).toHaveURL(/dashboard\/user\/transaction/)

        const sortStatus = transactionPage.getSortStatus()
        await expect(sortStatus).toBeVisible()
        await sortStatus.click()

        const rowsStatus = transactionPage.getTableBody().locator('tr > td:nth-child(3)')
        let allValueStatus = []
        for (let i = 0; i < await rowsStatus.count(); i++) {

            const amountText = await rowsStatus.nth(i).textContent()
            allValueStatus.push(amountText)
        }

        function isArraySortedAscending(arr) {
            return arr.every((value, index) => {
                    
                if (index === 0) return true
                
                return value >= arr[index - 1]

            });
        }

        expect(isArraySortedAscending(allValueStatus)).toBe(true)
    })

    test('Сортировка по статусу транзакции (Status по убыванию)', async () => {
        
        const transactionPage = new TransactionsPage(page)
        await transactionPage.navigate()

        await expect(page).toHaveURL(/dashboard\/user\/transaction/)

        const sortStatus = transactionPage.getSortStatus()
        await expect(sortStatus).toBeVisible()
        await sortStatus.click()
        await sortStatus.click()

        const rowsStatus = transactionPage.getTableBody().locator('tr > td:nth-child(3)')
        let allValueStatus = []
        for (let i = 0; i < await rowsStatus.count(); i++) {

            const amountText = await rowsStatus.nth(i).textContent()
            allValueStatus.push(amountText)
        }

        function isArraySortedDescending(arr) {
            return arr.every((value, index) => {
                    
                if (index + 1 < arr.length) {
                    return value >= arr[index + 1]
                }

                return true

            });
        }

        expect(isArraySortedDescending(allValueStatus)).toBe(true)
    })

    test('Сортировка по времени создания транзакции (Created At по возрастанию)', async () => {
        
        const transactionPage = new TransactionsPage(page)
        await transactionPage.navigate()

        await expect(page).toHaveURL(/dashboard\/user\/transaction/)

        const sortCreatedAt = transactionPage.getSortCreatedAt()
        await expect(sortCreatedAt).toBeVisible()
        await sortCreatedAt.click()

        const rowsCreatedAt = transactionPage.getTableBody().locator('tr > td:nth-child(4)')
        let allValueTime = []
        for (let i = 0; i < await rowsCreatedAt.count(); i++) {

            const amountText = await rowsCreatedAt.nth(i).textContent()
            const convertToMs = new Date(amountText).getTime()
            allValueTime.push(convertToMs)
        }

        function isArraySortedAscending(arr) {
            return arr.every((value, index) => {
                    
                if (index === 0) return true

                    return value >= arr[index - 1]

            });
        }

        expect(isArraySortedAscending(allValueTime)).toBe(true)
    })

    test('Сортировка по времени создания транзакции (Created At по убыванию)', async () => {
        
        const transactionPage = new TransactionsPage(page)
        await transactionPage.navigate()

        await expect(page).toHaveURL(/dashboard\/user\/transaction/)

        const sortCreatedAt = transactionPage.getSortCreatedAt()
        await expect(sortCreatedAt).toBeVisible()
        await sortCreatedAt.click()
        await sortCreatedAt.click()

        const rowsCreatedAt = transactionPage.getTableBody().locator('tr > td:nth-child(4)')
        let allValueTime = []
        for (let i = 0; i < await rowsCreatedAt.count(); i++) {

            const amountText = await rowsCreatedAt.nth(i).textContent()
            const convertToMs = new Date(amountText).getTime()
            allValueTime.push(convertToMs)
        }

        function isArraySortedDescending(arr) {
            return arr.every((value, index) => {
                    
                if (index + 1 < arr.length) {
                    return value >= arr[index + 1]
                }

                return true

            });
        }

        expect(isArraySortedDescending(allValueTime)).toBe(true)
    })
})