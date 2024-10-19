export class DashboardPage {
  constructor(page) {
    this.page = page;
    this.dashboardTitle = page.locator('.logo-text');
    this.logoutBtn = page.locator('.logout-btn');
    this.dropdownLogoutBtn = page.locator('.dropdown-btn');
  }

  async navigate() {
    return this.page.goto('/dashboard/admin/add-product');
  }

  getDashboardTitle() {
    return this.dashboardTitle;
  }

  getLogoutBtn() {
    return this.logoutBtn;
  }

  getDropDownLogoutBtn() {
    return this.dropdownLogoutBtn;
  }
}
