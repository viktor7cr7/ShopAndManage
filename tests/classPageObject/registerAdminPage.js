export class RegisterPageAdmin {
  constructor(page) {
    this.page = page;
  }

  getTitleRegister() {
    return this.page.locator('h4');
  }
}
