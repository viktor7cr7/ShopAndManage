export class LoginUserPage {
  constructor(page) {
    this.page = page;
    this.titleLogin = page.locator('h4');
  }

  getTitleLogin() {
    return this.titleLogin;
  }
}
