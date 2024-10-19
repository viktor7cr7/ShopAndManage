export class ForgotPasswordUser {
  constructor(page) {
    this.page = page;
  }

  getTitleForgotPassword() {
    return this.page.locator('h4');
  }
}
