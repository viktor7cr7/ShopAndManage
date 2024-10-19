import { test, expect } from 'playwright/test';
import { loginUser } from '../../utils/auth';
import { dbConnect } from '../../../backend/dbConnect';

test.describe('Пополнение баланса, проверка записи транзакции', () => {
  test('Пополнение баланса', async ({ request }) => {
    const cookies = await loginUser('test-email@mail.ru', 'BETejEmm321');
    const cookieHeader = cookies.join('; ');

    const getInfoUser = await request.get('/api/v1/current-user', {
      headers: {
        Cookie: cookieHeader,
      },
    });

    const { user } = await getInfoUser.json();
    const startBalance = await dbConnect.one(
      'SELECT amount from balances where user_id = $1',
      [user.id],
    );

    const postAddFunds = await request.patch(
      '/api/v1/create-checkout-session',
      {
        data: {
          amount: 1000,
        },
        headers: {
          Cookie: cookieHeader,
        },
      },
    );

    const { session } = await postAddFunds.json();
    const { amountConvertRuble, id_transaction, type, userId } =
      session.metadata;

    const dataWebhook = {
      type: 'checkout.session.completed',
      data: {
        object: {
          metadata: {
            type,
            id_transaction,
            amountConvertRuble,
            userId,
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

    const { amount, status } = await dbConnect.one(
      'SELECT amount, status from transaction_balances where transaction_balances_id = $1',
      [id_transaction],
    );

    expect(+amount).toBe(+amountConvertRuble);
    expect(status).toBe('paid');

    const currentBalance = await dbConnect.one(
      'SELECT amount from balances where user_id = $1',
      [user.id],
    );

    expect(+currentBalance.amount).toBe(
      +startBalance.amount + +amountConvertRuble,
    );
  });
});
