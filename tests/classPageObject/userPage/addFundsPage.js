export class AddFundsPage {
  constructor(page) {
    this.page = page;
    this.header = page.locator('.block-header');
    this.paymentMethods = page.locator('.payment-methods');
    this.currentMethod = page.locator('.content-method');
    this.amountInput = page.locator('#amount');
    this.totalPrice = page.locator('.total-price');
    this.btnGoToPayment = page.locator('.action-add-funds');
    this.btnBackToSelectPayment = page.locator('.btn-back');
    this.addFundsContainer = page.locator('.add-funds');
  }

  async navigate() {
    return this.page.goto('/dashboard/user/add-funds');
  }

  getHeader() {
    return this.header;
  }

  getPaymentMethods() {
    return this.paymentMethods;
  }

  getCurrentMethod() {
    return this.currentMethod;
  }

  getAmountInput() {
    return this.amountInput;
  }

  getTotalPrice() {
    return this.totalPrice;
  }

  getBtnToPayment() {
    return this.btnGoToPayment;
  }

  getBtnBackToSelectPayment() {
    return this.btnBackToSelectPayment;
  }

  getAddFundsContainer() {
    return this.addFundsContainer;
  }
}
