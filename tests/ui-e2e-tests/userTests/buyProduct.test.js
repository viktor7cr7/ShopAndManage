import { expect,test } from "playwright/test";
import { authCookieAndNewContextUser } from "../../utils/authCookieAndNewContext";
import { createProduct } from "../../utils/createProduct";
import { BuyProducts } from "../../pages/userPage/buyProducts";
import { OrdersPage } from "../../pages/userPage/OrdersPage";
import { DashboardPage } from "../../pages/userPage/dashboardPage";
import { deleteProduct } from "../../utils/deleteProduct";

test.describe.skip('Покупка товара', () => {

    test.afterEach(async () => {
        await deleteProduct()
    })

    test('Покупка товара при использовании Stripe ', async () => {

        const {valueName} = await createProduct()
        const page = await authCookieAndNewContextUser()
        const buyProductsPage = new BuyProducts(page)
        await buyProductsPage.navigate()

        const btnPages = buyProductsPage.getPageBtn()
        await btnPages.nth(1).click()

        const productItems = buyProductsPage.getProductContainer()
        const addingProduct = await productItems.locator(`text=${valueName}`).locator('../../../..')
        expect(addingProduct).toBeVisible()

        const btnBuyProduct = await addingProduct.locator('text=Buy Now')
        await btnBuyProduct.click()
    
        const modalBuyProduct = page.locator('.modal-buy:visible')
        await expect(modalBuyProduct).toBeVisible()

        const totalPriceText = await modalBuyProduct.locator('.result').textContent();
        const totalPrice = totalPriceText.split(',')[0].replace(/[^0-9]/g, '')
  
        const totalPriceConvertToDollar = (Number(totalPrice) / 87.90).toFixed(2).split('.')[0]

        const modalBtnBuyProduct = modalBuyProduct.locator('.action-buy')
        await modalBtnBuyProduct.click()
        await page.waitForURL(/checkout\.stripe\.com/)

        const textCurrentAmountStripe = await page.locator('.CurrencyAmount').textContent()
        const totalPriceStripe = textCurrentAmountStripe.replace(/[^0-9,.]/g, '').split('.')[0].replace(',', '')

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

        await expect(totalPriceConvertToDollar).toBe(totalPriceStripe)
        const btnSubmitBuy = page.locator('.SubmitButton-IconContainer')
        await btnSubmitBuy.click()

        await page.waitForURL(/dashboard\/user\/orders/)

        const ordersPage = new OrdersPage(page)

        const orderItems = ordersPage.getOrderItem().last()
        const textTotalPriceOrder = await orderItems.locator('.order-price').textContent()
        const totalPriceOrderItem = textTotalPriceOrder.replace(/[^0-9]/g, '')
        expect(totalPriceOrderItem).toBe(totalPrice)

        const orderStatus = await orderItems.locator('.order-status').textContent()
        expect(orderStatus).toBe('Status: paid')
    })

    test.skip('Покупка товара при использовании баланса юзера', async () => {

        const {valueName} = await createProduct()
        const page = await authCookieAndNewContextUser()
        const buyProductsPage = new BuyProducts(page)
        await buyProductsPage.navigate()
        let startBalanceUser = await page.locator('.balance-btn').textContent()
        startBalanceUser = startBalanceUser.replace(/[^0-9]/g, '')
        const btnPages = buyProductsPage.getPageBtn()
        await btnPages.nth(1).click()

        const productItems = buyProductsPage.getProductContainer()
        const addingProduct = await productItems.locator(`text=${valueName}`).locator('../../../..')
        expect(addingProduct).toBeVisible()

        const btnBuyProduct = await addingProduct.locator('text=Buy Now')
        await btnBuyProduct.click()
    
        const modalBuyProduct = page.locator('.modal-buy:visible')
        await expect(modalBuyProduct).toBeVisible()

        const selectPaymentMethods = modalBuyProduct.locator('#payment-method')
        await selectPaymentMethods.selectOption({label: 'Balance'})

        const totalPriceText = await modalBuyProduct.locator('.result').textContent();
        const totalPrice = totalPriceText.split(',')[0].replace(/[^0-9]/g, '')
       
        const modalBtnBuyProduct = modalBuyProduct.locator('.action-buy')
        await modalBtnBuyProduct.click()

        await page.waitForURL(/dashboard\/user\/orders/)

        const ordersPage = new OrdersPage(page)

        const orderItems = ordersPage.getOrderItem().last()
        const textTotalPriceOrder = await orderItems.locator('.order-price').textContent()
        const totalPriceOrderItem = textTotalPriceOrder.replace(/[^0-9]/g, '')
        expect(totalPriceOrderItem).toBe(totalPrice)

        const orderStatus = await orderItems.locator('.order-status').textContent()
        expect(orderStatus).toBe('Status: paid')
        let textCurrentBalanceUser = await page.locator('.balance-btn').textContent()
        textCurrentBalanceUser = textCurrentBalanceUser.replace(/[^0-9]/g, '')
 
       expect(+textCurrentBalanceUser).toBe(startBalanceUser - totalPriceOrderItem)
    })

    test.skip('Покупка товара из корзины при использовании Stripe ', async () => {

        const {valueName} = await createProduct()
        const page = await authCookieAndNewContextUser()
        const buyProductsPage = new BuyProducts(page)
        const dashboardPage = new DashboardPage(page)
        await buyProductsPage.navigate()

        const btnPages = buyProductsPage.getPageBtn()
        await btnPages.nth(1).click()

        const productItems = buyProductsPage.getProductContainer()
        const addingProduct = await productItems.locator(`text=${valueName}`).locator('../../../..')
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
        
        const addingProductInCart = modalCart.locator(`text=${valueName}`)
        expect(await addingProductInCart.count()).toBe(1)

        const btnEditQuantity = addingProductInCart.locator('..').locator('.edit-quantity')
        await btnEditQuantity.click()
        const quantityInput = addingProductInCart.locator('..').locator('input')
        await quantityInput.fill('5')
        const btnUpdateQuantity = addingProductInCart.locator('..').locator('.update-btn')
        await btnUpdateQuantity.click()

        const totalPriceCartText = await modalCart.locator('.cart-totalCost').textContent()
        const totalPriceCart = totalPriceCartText.replace(/[^0-9]/g, '')

        const totalPriceConvertToDollar = (Number(totalPriceCart) / 87.90).toFixed(2).split('.')[0]
        const cartBtnBuyProduct = modalCart.locator('.buy-btn')
        await cartBtnBuyProduct.click()
        await page.waitForURL(/checkout\.stripe\.com/)

        const textCurrentAmountStripe = await page.locator('.CurrencyAmount').nth(0).textContent()
        const totalPriceStripe = textCurrentAmountStripe.replace(/[^0-9,.]/g, '').split('.')[0].replace(',', '')

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

        await expect(totalPriceConvertToDollar).toBe(totalPriceStripe)
        const btnSubmitBuy = page.locator('.SubmitButton-IconContainer')
        await btnSubmitBuy.click()

        await page.waitForURL(/dashboard\/user\/orders/)

        const ordersPage = new OrdersPage(page)

        const orderItems = ordersPage.getOrderItem().last()
        const textTotalPriceOrder = await orderItems.locator('.order-price').textContent()
        const totalPriceOrderItem = textTotalPriceOrder.replace(/[^0-9]/g, '')
        expect(totalPriceOrderItem).toBe(totalPriceCart)

        const orderStatus = await orderItems.locator('.order-status').textContent()
        expect(orderStatus).toBe('Status: paid')
    })

    test.skip('Покупка товара из корзины при использовании баланса юзера', async () => {

        const {valueName} = await createProduct()
        const page = await authCookieAndNewContextUser()
        const buyProductsPage = new BuyProducts(page)
        const dashboardPage = new DashboardPage(page)
        await buyProductsPage.navigate()
        let startBalanceUser = await page.locator('.balance-btn').textContent()
        startBalanceUser = startBalanceUser.replace(/[^0-9]/g, '')
        const btnPages = buyProductsPage.getPageBtn()
        await btnPages.nth(1).click()

        const productItems = buyProductsPage.getProductContainer()
        const addingProduct = await productItems.locator(`text=${valueName}`).locator('../../../..')
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
        
        const addingProductInCart = modalCart.locator(`text=${valueName}`)
        expect(await addingProductInCart.count()).toBe(1)

        const btnEditQuantity = addingProductInCart.locator('..').locator('.edit-quantity')
        await btnEditQuantity.click()
        const quantityInput = addingProductInCart.locator('..').locator('input')
        await quantityInput.fill('5')
        const btnUpdateQuantity = addingProductInCart.locator('..').locator('.update-btn')
        await btnUpdateQuantity.click()

        const totalPriceCartText = await modalCart.locator('.cart-totalCost').textContent()
        const totalPriceCart = totalPriceCartText.replace(/[^0-9]/g, '')
        
        const selectPaymentMethodsCart = modalCart.locator('#selectPayment')
        await selectPaymentMethodsCart.selectOption({label: 'Balance'}) 

        const btnBuyCart = modalCart.locator('.buy-btn')
        await btnBuyCart.click()

        await page.waitForURL(/dashboard\/user\/orders/)

        const ordersPage = new OrdersPage(page)

        const orderItems = ordersPage.getOrderItem().last()
        const textTotalPriceOrder = await orderItems.locator('.order-price').textContent()
        const totalPriceOrderItem = textTotalPriceOrder.replace(/[^0-9]/g, '')
        expect(totalPriceOrderItem).toBe(totalPriceCart)

        const orderStatus = await orderItems.locator('.order-status').textContent()
        expect(orderStatus).toBe('Status: paid')
        let textCurrentBalanceUser = await page.locator('.balance-btn').textContent()
        textCurrentBalanceUser = textCurrentBalanceUser.replace(/[^0-9]/g, '')
        expect(+textCurrentBalanceUser).toBe(startBalanceUser - totalPriceOrderItem)
    })
})