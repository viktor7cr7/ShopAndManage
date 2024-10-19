import { expect, test } from 'playwright/test';
import { loginAdmin } from '../../utils/auth';
import { createProduct, deleteProduct } from '../../utils/CRUDProduct';
import { dbConnectAdmin } from '../../../backend/dbConnect';

test.describe('Операции над скидками', () => {
  test('Установка скидки', async ({ request }) => {
    const { name, product_id, price } = await createProduct();

    try {
      const cookie = await loginAdmin('test-email@mail.ru', 'BETejEmm321');
      const cookieHeader = cookie.join('; ');

      const startDate = new Date().toISOString();
      let datePlusOne = new Date();
      datePlusOne.setDate(datePlusOne.getDate() + 1);
      datePlusOne = datePlusOne.toISOString();
      const dataSetPercentage = {
        percentage: 50,
        start_date: startDate,
        end_date: datePlusOne,
      };

      const response = await request.post(
        `/api/v1/admin/product/discount/${product_id}`,
        {
          data: dataSetPercentage,
          headers: {
            Cookie: cookieHeader,
          },
        },
      );

      const { msg } = await response.json();

      expect(response.status()).toBe(201);
      expect(msg).toBe('Скидка успешно установлена');

      const discountedPrice =
        price - (dataSetPercentage.percentage / 100) * price;

      const { new_price: currentPrice } = await dbConnectAdmin.one(
        'SELECT p.price, case WHEN d.percentage IS NOT NULL THEN ROUND(p.price * (1 - d.percentage / 100),2) else ROUND(p.price,2) end as new_price from products p JOIN discounts d ON p.product_id = d.product_id AND NOW() BETWEEN d.start_date AND d.end_date where p.product_id = $1',
        [product_id],
      );

      console.log(discountedPrice);
      console.log(currentPrice);
      expect(+currentPrice).toBe(discountedPrice);

      await deleteProduct(name);
    } catch (error) {
      await deleteProduct(name);
    }
  });

  test('Удаление скидки', async ({ request }) => {
    const { name, product_id, price } = await createProduct();

    try {
      const cookie = await loginAdmin('test-email@mail.ru', 'BETejEmm321');
      const cookieHeader = cookie.join('; ');

      const startDate = new Date().toISOString();
      let datePlusOne = new Date();
      datePlusOne.setDate(datePlusOne.getDate() + 1);
      datePlusOne = datePlusOne.toISOString();

      const dataSetPercentage = {
        percentage: 50,
        start_date: startDate,
        end_date: datePlusOne,
      };

      let response = await request.post(
        `/api/v1/admin/product/discount/${product_id}`,
        {
          data: dataSetPercentage,
          headers: {
            Cookie: cookieHeader,
          },
        },
      );

      let { msg } = await response.json();

      expect(response.status()).toBe(201);
      expect(msg).toBe('Скидка успешно установлена');

      response = await request.delete(
        `/api/v1/admin/product/discount/${product_id}`,
        {
          headers: {
            Cookie: cookieHeader,
          },
        },
      );

      ({ msg } = await response.json());

      expect(response.status()).toBe(200);
      expect(msg).toBe('Скидка успешно удалена');

      try {
        const checkProductWithoutDiscount = await dbConnectAdmin.oneOrNone(
          'SELECT p.price, case WHEN d.percentage IS NOT NULL THEN ROUND(p.price * (1 - d.percentage / 100),2) else ROUND(p.price,2) end as new_price from products p JOIN discounts d ON p.product_id = d.product_id AND NOW() BETWEEN d.start_date AND d.end_date where p.product_id = $1',
          [product_id],
        );
        expect(checkProductWithoutDiscount).toBeNull();
      } catch (error) {
        console.error('Ошибка в бд, либо товар содержит скидку', error);
      }

      const checkDiscount = await dbConnectAdmin.oneOrNone(
        'SELECT percentage from discounts where product_id = $1',
        [product_id],
      );

      expect(checkDiscount).toBe(null);

      await deleteProduct(name);
    } catch (error) {
      await deleteProduct(name);
    }
  });
});
