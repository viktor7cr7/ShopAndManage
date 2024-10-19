export class AddProductPage {
  constructor(page) {
    this.page = page;
    this.formFilters = page.locator('.form-filters');
    this.inputName = page.locator('#name');
    this.downloadImgProduct = page.locator('#product_img');
    this.inputPrice = page.locator('#price');
    this.inputQuantity = page.locator('#quantity');
    this.inputDescription = page.locator('#description');
    this.selectCategory = page.locator('#category');
    this.btnSubmit = page.locator('.form-btn');
  }

  async navigate() {
    console.log('Navigating to /dashboard/admin/add-product');
    await this.page.goto('/dashboard/admin/add-product');
  }

  getFormFilters() {
    return this.formFilters;
  }

  getInputName() {
    return this.inputName;
  }

  getDownloadImgProduct() {
    return this.downloadImgProduct;
  }

  getInputPrice() {
    return this.inputPrice;
  }

  getInputQuantity() {
    return this.inputQuantity;
  }

  getInputDescription() {
    return this.inputDescription;
  }

  getSelectCategory() {
    return this.selectCategory;
  }

  getBtnSubmit() {
    return this.btnSubmit;
  }
}
