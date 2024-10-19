export class LandingPage {
  constructor(page) {
    this.page = page;
    this.titleShop = page.locator('.title-shop');
    this.titleAdminPanel = page.locator('.title-admin-panel');
    this.adminLoginButton = page.locator('#admin-login-button');
    this.userLoginButton = page.locator('#user-login-button');
    this.userEmailField = page.locator('#shop-email');
    this.adminEmailField = page.locator('#admin-email');
    this.userPasswordField = page.locator('#shop-password');
    this.adminPasswordField = page.locator('#admin-password');
    this.userRegisterLink = page.locator('#user-register');
    this.adminRegisterLink = page.locator('#admin-register');
    this.userForgotLink = page.locator('#user-forgot-password');
    this.adminForgotLink = page.locator('#admin-forgot-password');
  }

  getRegisterUserLink() {
    return this.userRegisterLink;
  }

  getRegisterAdminLink() {
    return this.adminRegisterLink;
  }

  getForgotUserLink() {
    return this.userForgotLink;
  }

  getForgotAdminLink() {
    return this.adminForgotLink;
  }

  getTitleShop() {
    return this.titleShop;
  }

  getTitleAdminPanel() {
    return this.titleAdminPanel;
  }

  async navigate() {
    await this.page.goto('/');
  }

  async loginUser(email, password) {
    await this.userEmailField.fill(email);
    await this.userPasswordField.fill(password);
    await this.userLoginButton.click();
  }

  async loginAdmin(email, password) {
    await this.adminEmailField.fill(email);
    await this.adminPasswordField.fill(password);
    await this.adminLoginButton.click();
  }
}
