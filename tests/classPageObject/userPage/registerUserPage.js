export class RegisterPageUser {
  constructor(page) {
    this.page = page;
    this.inputName = page.locator('#input-name');
    this.inputEmail = page.locator('#input-email');
    this.inputPassword = page.locator('#input-password');
    this.btnRegister = page.locator('#btn-register');
    this.linkLogIn = page.locator('login-link');
    this.notificationRegisterSuccessfull = page.locator('.Toastify__toast-body');
  }

  async navigate() {
    await this.page.goto('/register/user');
  }

  getTitleRegister() {
    return this.page.locator('h4');
  }

  getLinkLonIn() {
    return this.linkLogIn;
  }

  getNotificationRegisterSuccessfull() {
    return this.notificationRegisterSuccessfull;
  }

  async registerUser(name, email, password) {
    await this.inputName.fill(name);
    await this.inputEmail.fill(email);
    await this.inputPassword.fill(password);
    await this.btnRegister.click();
  }
}
