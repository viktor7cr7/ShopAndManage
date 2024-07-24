import { StatusCodes } from 'http-status-codes';
import { dbConnect, dbConnectAdmin } from '../dbConnect.js';
import { BadRequestError, ErrorFromDataBase } from '../errors/customError.js';
import cloudinary from 'cloudinary'
import {promises as fs} from 'fs'

export async function createProduct(req, res, next) {
  const { name, price, description, category, stock_quantity} = req.body;
  const { authorId, authorName } = req.user;
  const dataImage= {}
  if (req.file) {
    const response = await cloudinary.v2.uploader.upload(req.file.path)
    await fs.unlink(req.file.path)
    dataImage.imgProduct = response.secure_url
    dataImage.imgProductPublicId = response.public_id
}


if (req.file && dataImage.avatarPublicId) {
    await cloudinary.v2.uploader.destroy(updateUser.avatarPublicId)
}
  try {
    const product = await dbConnectAdmin.one(
      'INSERT INTO products(name, price, description, category, author_name, image_url,stock_quantity, author_id ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING name, price, description, category, author_name, image_url, stock_quantity, author_id',
      [
        name,
        price,
        description,
        category,
        authorName,
        dataImage.imgProduct,
        stock_quantity || 0,
        authorId
      ]
    );
    if (product) {
      res.status(StatusCodes.CREATED).json({ msg: 'Товар успешно добавлен' });
    }
  } catch (error) {
    return next(new ErrorFromDataBase(error.message));
  }
}

export async function updateProduct(req, res, next) {
  const { name, price, description, category, stock_quantity} =
    req.body;
  const { id } = req.params;
  let fields = [];
  let values = [];
  let dataImage = {}
  let query = 'UPDATE products SET ';

  if (req.file) {
    const response = await cloudinary.v2.uploader.upload(req.file.path)
    await fs.unlink(req.file.path)
    dataImage.imgProduct = response.secure_url
    dataImage.imgProductPublicId = response.public_id
    fields.push('image_url = $' + (fields.length + 1))
    values.push(dataImage.imgProduct)
  }

  if (name) {
    fields.push('name = $' + (fields.length + 1));
    values.push(name);
  }

  if (price) {
    fields.push('price = $' + (fields.length + 1));
    values.push(price);
  }

  if (description) {
    fields.push('description = $' + (fields.length + 1));
    values.push(description);
  }

  if (category) {
    fields.push('category = $' + (fields.length + 1));
    values.push(category);
  }

  if (stock_quantity) {
    fields.push('stock_quantity = $' + (fields.length + 1));
    values.push(stock_quantity);
  }


  if (fields.length === 0) {
    return next(new BadRequestError('Нет данных для обновления'));
  }

  query +=
    fields.join(', ') +
    ` WHERE product_id = $` +
    (fields.length + 1) +
    ' RETURNING *';
  values.push(id);

  try {
    const updateProduct = await dbConnectAdmin.oneOrNone(query, values);
    if (updateProduct) {
      res.status(StatusCodes.OK).json({ msg: 'Данные успешно обновлены' });
    }
  } catch (error) {
    return next(new ErrorFromDataBase(error.message));
  }
}

export async function deleteProduct(req, res, next) {
  const { id } = req.params;

  try {
    const deleteProduct = await dbConnectAdmin.result(
      'DELETE from products where product_id = $1',
      [id]
    );
    if (deleteProduct) {
      res.status(StatusCodes.OK).json({ msg: 'Товар успешно удалён' });
    }
  } catch (error) {
    return next(new ErrorFromDataBase(error.message));
  }
}

export async function getAllProduct(req, res, next) {
  const { authorId } = req.user;
  const { sort, search, productCategory, productStatus } = req.query;
  const sortValue = {
      asc: 'ORDER BY new_price ASC',
      desc: 'ORDER BY new_price DESC',
  };


  let orderBy = '';
  let filters = [];
  if (sort) {
      orderBy = sortValue[sort];
  }

  if (search) {
      filters.push(`p.name ILIKE '%${search}%'`)
  }
  
  if (productCategory && productCategory !== 'all') {
      filters.push(`p.category = '${productCategory}'`)
  }

  if (authorId ) {
    filters.push(`p.author_id = '${authorId}'`)
  }

  if (productStatus && productStatus !== 'all') {
    filters.push(`p.status = '${productStatus}'`)
  }

  const filtersQuery = filters.length > 0 ? 'WHERE ' + filters.join(' AND ') : '';
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 10
  const skip = (page - 1) * limit


  try {
    const result = await dbConnectAdmin.one(
      `WITH filtered_products AS (
        SELECT 
          p.product_id, p.author_name, p.author_id, p.name, p.description, p.category, p.stock_quantity, p.status, p.rating, p.created_at, d.percentage, p.price AS old_price, 
          CASE 
            WHEN d.percentage IS NOT NULL THEN ROUND(p.price * (1 - d.percentage / 100), 2) 
            ELSE p.price 
          END AS new_price, d.start_date, d.end_date
        FROM products p
        LEFT JOIN discounts d ON p.product_id = d.product_id AND NOW() >= d.start_date AND NOW() <= d.end_date
        ${filtersQuery}
        ${orderBy}
      )
      SELECT 
        (SELECT COUNT(*) FROM filtered_products) AS total_products,
        json_agg(fp.*) AS products
      FROM (
        SELECT *, ROW_NUMBER() OVER() AS row_number
        FROM filtered_products
      ) AS fp
      WHERE fp.row_number > $2 AND fp.row_number <= $2 + $1`,
      [limit, skip]
    );

    const totalProducts = result.total_products;
    const products = result.products || [];
    const numOfPages = Math.ceil(totalProducts / limit);

    res.status(StatusCodes.OK).json({ totalProducts, numOfPages, currentPage: page, products });
  
  } catch(error) {
    return next(new ErrorFromDataBase(error.message))
  }
}

export async function getSingleProduct(req, res, next) {
  const { id } = req.params;

  try {
    const product = await dbConnectAdmin.oneOrNone(
      'SELECT p.author_name, p.name, p.description, p.stock_quantity, p.price AS old_price, CASE WHEN d.percentage IS NOT NULL THEN ROUND(p.price * (1 - d.percentage / 100), 2) ELSE NULL END AS new_price, d.percentage, d.start_date, d.end_date FROM products p LEFT JOIN discounts d ON p.product_id = d.product_id AND NOW() BETWEEN d.start_date AND d.end_date WHERE p.product_id = $1',
      [id]
    );
    if (!product) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: `Товара с id ${id} не существует` });
    } else {
      res.status(StatusCodes.OK).json({ product });
    }
  } catch (error) {
    return next(new ErrorFromDataBase(error.message));
  }
}

export async function setDiscountProduct(req, res, next) {
  const { percentage, start_date, end_date } = req.body;
  const { id } = req.params;
  const startDateUTC = new Date(start_date).toISOString();
  const endDateUTC = new Date(end_date).toISOString();

  if (!percentage || !start_date || !end_date) {
    return next(new BadRequestError('Укажите все обязательные атрибуты в запросе'))
  }

  try {
    const checkDiscount = await dbConnectAdmin.oneOrNone('SELECT discount_id from discounts where product_id = $1', [id])
    if (checkDiscount) {
      await dbConnectAdmin.one(
        'UPDATE discounts SET percentage = $1, start_date = $2 , end_date = $3 where product_id = $4 RETURNING *',
        [percentage, startDateUTC, endDateUTC, id]
      )
    } else {
        await dbConnectAdmin.one(
          'INSERT INTO discounts (percentage, product_id, start_date, end_date) VALUES ($1, $2, $3, $4) RETURNING *',
          [percentage, id, startDateUTC, endDateUTC]
        );
      }
    res.status(StatusCodes.CREATED).json({ msg: 'Скидка успешно установлена' });
  } catch (error) {
    return next(new ErrorFromDataBase(error.message));
  }
}

export async function updateDiscountProduct(req, res, next) {
  const { newPercentage, start_date, end_date } = req.body;
  const { id } = req.params;
  if (newPercentage === 0) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: 'Скидка не может содержать значение "0"' });
  }

  try {
    await dbConnectAdmin.oneOrNone(
      'UPDATE discounts SET percentage = $1, start_date = $2, end_date = $3 where product_id = $4',
      [newPercentage, start_date, end_date, id]
    );
    res.status(StatusCodes.OK).json({ msg: 'Скидка успешно обновлена' });
  } catch (error) {
    return next(new ErrorFromDataBase(error.message));
  }
}

export async function deleteDiscountProduct(req, res, next) {
  const { id } = req.params;

  try {
    const result = await dbConnectAdmin.oneOrNone(
      'DELETE from discounts where product_id = $1',
      [id]
    );

    res.status(StatusCodes.OK).json({ msg: 'Скидка успешно удалена' });
  } catch (error) {
    return next(new ErrorFromDataBase(error.message));
  }
}

export async function setRatingProduct(req, res, next) {
  const { rating, productId, orderId } = req.body;
  const { id } = req.params;
  const { userId } = req.user;
  if (!id || !rating)
    return next(new BadRequestError('Укажите рейтинг и айди товара'));
  try {
    const check = await dbConnect.tx(async (t) => {
      const checkOrder = await t.one(
        'SELECT user_id, status from orders where order_id IN (select order_id from order_items where order_id = $1)',
        [orderId]
      );

      if (checkOrder.status === 'unpaid')
        return next(
          new BadRequestError('Неоплаченные товары невозможно оценивать')
        );
      if (checkOrder.user_id !== userId)
        return next(
          new BadRequestError('Нельзя оставлять рейтинг для чужих ордеров')
        );

        const checkRatintItem = await t.any('select rating from review_product where order_item_id = $1 and user_id = $2', [id, userId])

        if (checkRatintItem.length > 0) {
          return next(new BadRequestError('Вы уже оценивали данный заказ'))
        }
      await t.none(
        'INSERT INTO review_product (order_item_id, rating, user_id) VALUES ($1, $2, $3)',
        [id, rating, +userId]
      );
      const avgRating = await t.oneOrNone(`select ROUND(AVG(rating), 2) from review_product rp INNER JOIN order_items oi ON rp.order_item_id = oi.item_id WHERE oi.product_id = ${productId}`)

      await dbConnectAdmin.none(`UPDATE products SET rating = $1, review_count = review_count + 1 where product_id = $2`, [avgRating.round, productId])
    });
    res.status(StatusCodes.OK).json({ msg: 'Спасибо за оценку !' });
  } catch (error) {
    return next(new ErrorFromDataBase(error.message));
  }
}