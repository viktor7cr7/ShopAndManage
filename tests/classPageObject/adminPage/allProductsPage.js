export class AllProductsPage {
  constructor(page) {
    this.page = page;
    this.filtersForm = page.locator('.filters-form');
    this.inputSearch = page.locator('#filter-search');
    this.filterCategory = page.locator('#filter-category');
    this.filterStatus = page.locator('#filter-status');
    this.sortPrice = page.locator('#sort-price');
    this.btnResetFilters = page.locator('.reset-btn');
    this.productsContainer = page.locator('.products');
    this.btnPrev = page.locator('.prev-btn');
    this.btnNext = page.locator('.next-btn');
    this.btnPage = page.locator('.page-btn');
    this.productItem = page.locator('.product-item');
  }

  async navigate() {
    return this.page.goto('/dashboard/admin/all-products');
  }

  getFiltersForm() {
    return this.filtersForm;
  }

  getInputSearch() {
    return this.inputSearch;
  }

  getFilterCategory() {
    return this.filterCategory;
  }

  getFilterStatus() {
    return this.filterStatus;
  }

  getSortPrice() {
    return this.sortPrice;
  }

  getBtnResetFilters() {
    return this.btnResetFilters;
  }

  getProductContainer() {
    return this.productsContainer;
  }

  getBtnPrev() {
    return this.btnPrev;
  }

  getBtnNext() {
    return this.btnNext;
  }

  getBtnPage() {
    return this.btnPage;
  }

  getProductItem() {
    return this.productItem;
  }
}
