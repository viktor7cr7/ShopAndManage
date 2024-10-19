export class TransactionsPage {
  constructor(page) {
    this.page = page;
    this.sortId = page.locator('tr > th:nth-child(1)');
    this.sortAmount = page.locator('tr > th:nth-child(2)');
    this.sortStatus = page.locator('tr > th:nth-child(3)');
    this.createdAt = page.locator('tr > th:nth-child(4)');
    this.tableBody = page.locator('tbody');
  }

  async navigate() {
    return this.page.goto('/dashboard/user/transaction');
  }

  getSortId() {
    return this.sortId;
  }

  getSortAmount() {
    return this.sortAmount;
  }

  getSortStatus() {
    return this.sortStatus;
  }

  getSortCreatedAt() {
    return this.createdAt;
  }

  getTableBody() {
    return this.tableBody;
  }
}
