export class DashboardPage {
  constructor(page) {
    this.page = page;
    this.dashboardTitle = page.locator('.logo-text');
    this.logoutBtn = page.locator('.logout-btn');
    this.balanceBtn = page.locator('.balance-btn');
    this.cartBtn = page.locator('.cart-btn');
    this.cartModal = page.locator('.modal-cart');
  }

  async navigate() {
    return this.page.goto('/dashboard/user/all-products');
  }

  getDashboardTitle() {
    return this.dashboardTitle;
  }

  getLogoutBtn() {
    return this.logoutBtn;
  }

  getBalanceBtn() {
    return this.balanceBtn;
  }

  getCartBtn() {
    return this.cartBtn;
  }

  getCartModal() {
    return this.cartModal;
  }
}
