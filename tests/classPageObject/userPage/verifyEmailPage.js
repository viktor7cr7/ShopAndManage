export class VerifyEmailUser {
  constructor(page) {
    this.page = page;
    this.SuccessTitleVerifyEmail = page.locator('.success-verify-email');
    this.ErrorTitleVerifyEmail = page.locator('.error-verify-email');
  }

  getSuccessTitleVerifyEmail() {
    return this.SuccessTitleVerifyEmail;
  }

  getErrorTitleVerifyEmail() {
    return this.ErrorTitleVerifyEmail;
  }
}
