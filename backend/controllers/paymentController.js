import stripe from 'stripe';
import { BadRequestError, ErrorFromDataBase } from '../errors/customError.js';
import { StatusCodes } from 'http-status-codes';
import { dbConnect, dbConnectAdmin } from '../dbConnect.js';
import { DOLLAR_EXCHANGE_RATE } from '../utils/constants.js';
const stripe2 = new stripe(
    'sk_test_51OxrJFP4TSzvaJ7HxOxxXCKRCtw7Q3RlGjl7Ey8Z9xDaTVJ1bsMhuJwHjxJ800rjNnPBZWHjVQJYOgZoE8TGAOGT00JlGum9Ww'
);


export async function buyProducts(req, res, next) {
    const { items, paymentMethod } = req.body;
    const { userId } = req.user;
    let infoQuntityAndIdProduct = [];
    if (!items || items.length === 0) {
        return next(new BadRequestError('Нет товаров для покупки'));
    }
    let totalPriceDatabase = 0
    for (let product of items) {
        const { product_id, price, quantity } = product;
        let productAndQuantity = {
            product_id: product_id,
            quantity: quantity,
        };
        totalPriceDatabase += +price * quantity
        infoQuntityAndIdProduct.push(productAndQuantity);
        const infoProduct = await dbConnectAdmin.oneOrNone(
            'select p.product_id, p.price AS old_price, stock_quantity, CASE WHEN d.percentage IS NOT NULL THEN ROUND(p.price - (p.price * (d.percentage / 100)),2) ELSE p.price END AS new_price, d.percentage, d.start_date, d.end_date FROM products p LEFT JOIN discounts d ON p.product_id = d.product_id AND NOW() BETWEEN d.start_date AND d.end_date WHERE p.product_id = $1;',
            [product_id]
        );


        if (!infoProduct || !infoProduct.product_id) {
            return next(
                new BadRequestError(`Товара с id ${product_id} не существует`)
            );
        }

        if (infoProduct.stock_quantity < quantity) {
            return next(
                new BadRequestError(
                    `Товар с id ${product_id} меньше в наличии чем в запросе`
                )
            );
        }
    }

    async function createOrder(items, userId, totalPrice) {
        try {
            if (paymentMethod === 'Balance') {
                const checkBalance = await dbConnect.one('SELECT amount from balances where user_id = $1', [userId])
                if (+checkBalance.amount < totalPrice) {
                    return next(new BadRequestError('Недостаточно средств'))
                } 
            }

            const orderId = await dbConnect.tx(async (t) => {
                const order = await t.one(
                    'INSERT INTO orders (user_id, total_price, status) VALUES ($1, $2, $3) RETURNING order_id',
                    [userId, Number((totalPrice) / DOLLAR_EXCHANGE_RATE).toFixed(2), 'unpaid']
                );

                const queries = items.map((item) => {
                    const result = Math.round(+item.price) / DOLLAR_EXCHANGE_RATE
                    return t.none(
                        'INSERT INTO order_items (order_id, product_id, product_name, quantity, price) VALUES ($1, $2, $3, $4, $5)',
                        [
                            order.order_id,
                            item.product_id,
                            item.name,
                            item.quantity,
                            Number((item.price) / DOLLAR_EXCHANGE_RATE).toFixed(2)
                        ]
                    );
                });

                await t.batch(queries);
                return order.order_id;
            });
            return orderId;
        } catch (error) {
            throw new ErrorFromDataBase(error.message);
        }
    }

    const orderId = await createOrder(items, userId, totalPriceDatabase, next);


    switch(paymentMethod) {
        case 'Credit Card':
            const session = await stripe2.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: items.map((item) => ({
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: item.name,
                            description: item.description,
                        },
                        unit_amount:  Math.round((item.price * 100) / DOLLAR_EXCHANGE_RATE),
                    },
                    quantity: item.quantity,
                })),
                mode: 'payment',
                success_url:  process.env.ORIGIN_URL ? `${process.env.ORIGIN_URL}/dashboard/user/orders` : 'http://localhost:5173/dashboard/user/orders',
                cancel_url: process.env.ORIGIN_URL ? `${process.env.ORIGIN_URL}/dashboard/user/all-products` : 'http://localhost:5173/dashboard/user/all-products',
                metadata: {
                    orderId: orderId,
                    infoQuntityAndIdProduct: JSON.stringify(infoQuntityAndIdProduct),
                    type: 'products_buy',
                },
            });
            res.status(StatusCodes.OK).json({ session });
            break;
            case 'Balance':
                    const totalCost = items.reduce((acc, item) => acc + (item.totalPrice || item.price * item.quantity), 0)
                    await dbConnect.tx(async (t) => {
                    await t.none('UPDATE balances SET amount = amount - $1 where user_id = $2', [totalCost, userId])
                    await t.query(
                        'UPDATE orders SET status = $1 where order_id = $2',
                        ['paid', orderId]
                    );
                })

                await dbConnectAdmin.tx(async (t) => {
                    await t.none(
                        'CREATE TEMP TABLE temp_product_update (product_id INT, quantity INT)'
                    );
                    const insertQuery =
                        'INSERT INTO temp_product_update (product_id, quantity) VALUES ($1, $2)';
                    const queries = infoQuntityAndIdProduct.map(
                        (item) => {
                            return t.none(insertQuery, [
                                item.product_id,
                                item.quantity,
                            ]);
                        }
                    );

                    await t.batch(queries);
                    await t.none(
                        'UPDATE products SET stock_quantity = stock_quantity - tpu.quantity FROM temp_product_update tpu WHERE products.product_id = tpu.product_id'
                    );

                    await t.none('DROP TABLE temp_product_update');
                });
                res.status(StatusCodes.OK).json({msg: 'Успех', success_url: process.env.ORIGIN_URL ? `${process.env.ORIGIN_URL}/dashboard/user/orders` : 'http://localhost:5173/dashboard/user/orders'});
                break;
    }
}

export async function addFundsUseStripe(req, res, next) {
    const { amount } = req.body;
    const { userId } = req.user;
    const amountConvertRuble = Number(amount * DOLLAR_EXCHANGE_RATE).toFixed(2)
    if (!amount) return next( new BadRequestError('Сумма не должна быть пустой'));
    const balanceId = await dbConnect.one(
        'SELECT balance_id from balances where user_id = $1',
        [userId]
    );
    const addFunds = await dbConnect.one(
        'INSERT INTO transaction_balances (balance_id, amount, status) VALUES ($1, $2, $3) RETURNING transaction_balances_id',
        [balanceId.balance_id, amountConvertRuble, 'unpaid']
    );

    try {
        const session = await stripe2.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'Balance Top Up',
                        },
                        unit_amount: amount * 100,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: process.env.ORIGIN_URL ? `${process.env.ORIGIN_URL}/dashboard/user/transaction` : 'http://localhost:5173/dashboard/user/transaction',
            cancel_url: process.env.ORIGIN_URL ? `${process.env.ORIGIN_URL}/dashboard/user/add-funds` : 'http://localhost:5173/dashboard/user/add-funds',
            metadata: {
                userId,
                type: 'balance_top_up',
                id_transaction: addFunds.transaction_balances_id,
                amountConvertRuble,
            },
        });
        res.status(StatusCodes.OK).json({ session });
    } catch (error) {
        throw new Error(
            `Error creating balance top-up session: ${error.message}`
        );
    }
}

export async function webHook(req, res, next) {
    const event = req.body;
    console.log(event)
    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object;
            const orderId = session.metadata.orderId;
            const typePayment = session.metadata.type;
            const infoQuntityAndIdProduct =
                session.metadata.infoQuntityAndIdProduct;
            const transactionId = session.metadata.id_transaction;
            const amountAddFunds = session.metadata.amountConvertRuble;
            const userId = session.metadata.userId;
            console.log(orderId)
            console.log(typePayment)
            console.log(infoQuntityAndIdProduct)
            try {
                if (typePayment === 'products_buy') {
                    await dbConnect.query(
                        'UPDATE orders SET status = $1 where order_id = $2',
                        ['paid', orderId]
                    );

                    await dbConnectAdmin.tx(async (t) => {
                        await t.none(
                            'CREATE TEMP TABLE temp_product_update (product_id INT, quantity INT)'
                        );
                        const insertQuery =
                            'INSERT INTO temp_product_update (product_id, quantity) VALUES ($1, $2)';
                        const queries = JSON.parse(infoQuntityAndIdProduct).map(
                            (item) => {
                                return t.none(insertQuery, [
                                    item.product_id,
                                    item.quantity,
                                ]);
                            }
                        );

                        await t.batch(queries);
                        await t.none(
                            'UPDATE products SET stock_quantity = stock_quantity - tpu.quantity FROM temp_product_update tpu WHERE products.product_id = tpu.product_id'
                        );

                        await t.none('DROP TABLE temp_product_update');
                    });
                }

                if (typePayment === 'balance_top_up') {
                    console.log('sin in balance top up')
                    await dbConnect.none(
                        'UPDATE balances SET amount = amount + $1 where user_id = $2',
                        [+amountAddFunds, userId]
                    );
                    await dbConnect.none(
                        'UPDATE transaction_balances SET amount = $1, status = $2 where transaction_balances_id = $3',
                        [amountAddFunds, 'paid', transactionId]
                    );
                }
            } catch (error) {
                return next(new ErrorFromDataBase(error.message));
            }
            break;
    }
    res.json({ received: true });
}
