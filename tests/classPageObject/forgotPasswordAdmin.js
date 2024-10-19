export class ForgotPasswordAdmin {
  constructor(page) {
    this.page = page;
  }

  getTitleForgotPassword() {
    return this.page.locator('h4');
  }
}
