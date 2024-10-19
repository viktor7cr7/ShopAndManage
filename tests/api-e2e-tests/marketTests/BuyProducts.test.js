import { expect, test } from 'playwright/test';
import { loginUser } from '../../utils/auth';
import { dbConnect, dbConnectAdmin } from '../../../backend/dbConnect';

test.describe('Покупка товаров', () => {
  test('Покупка товара (через Stripe)', async ({ request }) => {
    const cookies = await loginUser('test-email@mail.ru', 'BETejEmm321');
    const cookieHeader = cookies.join('; ');
    const getProducts = await request.get('/api/v1/products', {
      headers: {
        Cookie: cookieHeader,
      },
    });

    const { products } = await getProducts.json();

    const itemsProduct = products.reduce((acc, product, index) => {
      if (index >= 3) return acc;
      const formatItem = {
        product_id: product.product_id,
        name: product.name,
        price: product.new_price,
        quantity: 2,
      };
      acc.push(formatItem);
      return acc;
    }, []);

    const postBuyProducts = await request.post(
      '/api/v1/create-checkout-session',
      {
        data: {
          items: itemsProduct,
          paymentMethod: 'Credit Card',
        },
        headers: {
          Cookie: cookieHeader,
        },
      },
    );

    expect(postBuyProducts.status()).toBe(200);

    const { session } = await postBuyProducts.json();
    const { infoQuntityAndIdProduct, orderId, type } = session.metadata;
    const idProducts = JSON.parse(infoQuntityAndIdProduct)
      .map((product) => product.product_id)
      .join(',');

    const priceProducts = await dbConnectAdmin.any(`
        select p.stock_quantity, p.product_id, p.price as old_price, case
when d.percentage is not null THEN ROUND(p.price * (1 - d.percentage / 100),2)
else p.price
end AS new_price
from products p 
LEFT JOIN discounts d ON p.product_id = d.product_id AND NOW() >= d.start_date AND NOW() <= d.end_date
where p.product_id IN (${idProducts}) ORDER BY p.product_id`);

    const quantityProduct = products.map((product) => product.stock_quantity);

    const totalAmount = priceProducts.reduce((acc, dataProduct) => {
      acc += dataProduct.new_price * 2;
      return acc;
    }, 0);

    const totalPriceConvertToDollar = (totalAmount / 87.9).toFixed(2);
    const dataWebhook = {
      type: 'checkout.session.completed',
      data: {
        object: {
          metadata: {
            orderId,
            type,
            infoQuntityAndIdProduct,
          },
        },
      },
    };

    const postWebhook = await request.post('/api/v1/webhook', {
      data: dataWebhook,
      headers: {
        Cookie: cookieHeader,
      },
    });
    expect(postWebhook.status()).toBe(200);

    const { total_price, status } = await dbConnect.one(
      'SELECT total_price, status from orders where order_id = $1',
      [orderId],
    );

    expect(+total_price).toBe(+totalPriceConvertToDollar);
    expect(status).toBe('paid');

    const checkChangeQuantity = await dbConnectAdmin.any(
      `SELECT product_id, stock_quantity from products where product_id IN (${idProducts}) ORDER BY product_id`,
    );

    checkChangeQuantity.forEach((product, index) => {
      expect(product.stock_quantity).toBe(quantityProduct[index] - 2);
    });
  });

  test('Покупка товара (баланс юзера)', async ({ request }) => {
    const cookies = await loginUser('test-email@mail.ru', 'BETejEmm321');
    const cookieHeader = cookies.join('; ');
    const getProducts = await request.get('/api/v1/products', {
      headers: {
        Cookie: cookieHeader,
      },
    });

    const { products } = await getProducts.json();

    const getInfoUser = await request.get('/api/v1/current-user', {
      headers: {
        Cookie: cookieHeader,
      },
    });

    const { user } = await getInfoUser.json();

    const itemsProduct = products.reduce((acc, product, index) => {
      if (index >= 3) return acc;
      const formatItem = {
        product_id: product.product_id,
        name: product.name,
        price: product.new_price,
        quantity: 2,
      };
      acc.push(formatItem);
      return acc;
    }, []);

    console.log(itemsProduct);
    const startBalance = await dbConnect.one(
      'SELECT amount from balances where user_id = $1',
      user.id,
    );
    console.log(startBalance);
    const response = await request.post('/api/v1/create-checkout-session', {
      data: {
        items: itemsProduct,
        paymentMethod: 'Balance',
      },
      headers: {
        Cookie: cookieHeader,
      },
    });

    expect(response.status()).toBe(200);

    const { msg } = await response.json();
    expect(msg).toBe('Успех');

    const priceProducts = await dbConnectAdmin.any(`
        select p.stock_quantity, p.product_id, p.price as old_price, case
when d.percentage is not null THEN ROUND(p.price * (1 - d.percentage / 100),2)
else p.price
end AS new_price
from products p 
LEFT JOIN discounts d ON p.product_id = d.product_id AND NOW() >= d.start_date AND NOW() <= d.end_date
where p.product_id IN (28,29,30) ORDER BY p.product_id`);

    const quantityProduct = products.map((product) => product.stock_quantity);

    const totalAmount = priceProducts.reduce((acc, dataProduct) => {
      acc += dataProduct.new_price * 2;
      return acc;
    }, 0);
    console.log('total amount' + totalAmount);
    const totalPriceConvertToDollar = (totalAmount / 87.9).toFixed(2);

    const { max: orderId } = await dbConnect.one(
      'SELECT MAX(order_id) from orders',
    );
    console.log(orderId);
    const { total_price, status } = await dbConnect.one(
      'SELECT total_price, status from orders where order_id = $1',
      [orderId],
    );
    console.log(total_price);
    console.log(totalPriceConvertToDollar);
    expect(+total_price).toBe(+totalPriceConvertToDollar);
    expect(status).toBe('paid');

    const checkChangeQuantity = await dbConnectAdmin.any(
      `SELECT product_id, stock_quantity from products where product_id IN (28,29,30) ORDER BY product_id`,
    );

    checkChangeQuantity.forEach((product, index) => {
      expect(product.stock_quantity).toBe(quantityProduct[index] - 2);
    });

    const currentBalance = await dbConnect.one(
      'SELECT amount from balances where user_id = $1',
      user.id,
    );

    expect(+currentBalance.amount).toBe(+startBalance.amount - totalAmount);
  });
});
