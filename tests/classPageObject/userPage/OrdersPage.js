export class OrdersPage {
  constructor(page) {
    this.page = page;
    this.orderItem = page.locator('.order-item');
    this.formFilters = page.locator('.orders-filter');
  }

  async navigate() {
    return this.page.goto('/dashboard/user/orders');
  }

  getOrderItem() {
    return this.orderItem;
  }

  getFormFilters() {
    return this.formFilters;
  }
}
