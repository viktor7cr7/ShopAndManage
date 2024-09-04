import { StatusCodes } from 'http-status-codes';
import { dbConnect, dbConnectAdmin } from '../dbConnect.js';
import { BadRequestError, ErrorFromDataBase } from '../errors/customError.js';
import cloudinary from 'cloudinary'
import {promises as fs} from 'fs'

export async function getAllUserProducts(req, res, next) {
  const { sort, search, category,  minPrice, maxPrice } = req.query;
  let orderBy = '';
  let filters = [];
  if (sort) {
    const sortParams = sort.split(',').map(param => {
      const [field, direction] = param.split(':');
      if (direction) {
        return `${field} ${direction.toUpperCase()}`;
      }
      return null;
    }).filter(Boolean);
    orderBy = sortParams.length > 0 ? `ORDER BY ${sortParams.join(', ')}` : '';
  }

  if (search) {
      filters.push(`p.name ILIKE '%${search}%'`)
  }
  
  if (category && category !== 'All') {
      filters.push(`p.category = '${category}'`)
  }


  const rangeFilter = minPrice && maxPrice ? `AND new_price BETWEEN ${minPrice} AND ${maxPrice}` : '';
  const filtersQuery = filters.length > 0 ? 'WHERE ' + filters.join(' AND ') : '';
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 10
  const skip = (page - 1) * limit

  try {
    const result = await dbConnectAdmin.one(
      `WITH filtered_products AS (
        SELECT 
          p.product_id, p.author_name, p.author_id, p.name, p.description, p.category, p.stock_quantity, p.status, p.rating, p.created_at, d.percentage, p.image_url, p.price AS old_price, 
          CASE 
            WHEN d.percentage IS NOT NULL THEN ROUND(p.price * (1 - d.percentage / 100),2)
            ELSE ROUND(p.price,2)
          END AS new_price, d.start_date, d.end_date
        FROM products p
        LEFT JOIN discounts d ON p.product_id = d.product_id AND NOW() >= d.start_date AND NOW() <= d.end_date
        ${filtersQuery}
        ${orderBy || 'ORDER BY p.product_id'}
      )
      SELECT 
        (SELECT COUNT(*) FROM filtered_products WHERE 1=1 ${rangeFilter}) AS total_products,
        json_agg(fp.*) AS products
      FROM (
        SELECT *, ROW_NUMBER() OVER() AS row_number
        FROM filtered_products
        WHERE 1=1 ${rangeFilter}
      ) AS fp
      WHERE fp.row_number > $2 AND fp.row_number <= $1 + $2`,
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

export async function getSingleUserProducts(req, res, next) {
    const { id } = req.params;

    try {
        const product = await dbConnectAdmin.any(
            `select p.product_id, p.price AS old_price, stock_quantity,
        CASE
            WHEN d.percentage IS NOT NULL THEN ROUND(p.price - (p.price * (d.percentage / 100)),2)
            ELSE p.price
        END AS new_price,
        d.percentage,
        d.start_date,
        d.end_date
    FROM products p
        LEFT JOIN
        discounts d ON p.product_id = d.product_id
        AND NOW() BETWEEN d.start_date AND d.end_date
        where p.product_id = $1;`,
            [id]
        );
        if (product.length === 0) {
            res.status(StatusCodes.NOT_FOUND).json({
                msg: `Страницы с товаром ${id} не существует`,
            });
        }
        const ratingProduct = await dbConnect.any(
            `SELECT ROUND(AVG(rating),2), COUNT(rating), oi.product_name, oi.product_id from review_product rp
        JOIN order_items oi
        ON rp.order_item_id = oi.item_id
        where oi.product_id = $1
        GROUP BY product_name, oi.product_id`,
            [id]
        );
        res.status(StatusCodes.OK).json({ product, ratingProduct });
    } catch (error) {
        return next(new ErrorFromDataBase(error.message));
    }
}


export async function getOrders(req, res, next) {
    const {userId} = req.user

    try {
        const orders = await dbConnect.any(`
        select oi.item_id, oi.order_id, oi.product_id, oi.product_name, oi.quantity, oi.price, o.total_price, o.status, o.created_at
        from order_items oi
        INNER JOIN
        orders o
        ON o.order_id = oi.order_id where o.user_id = $1`, [userId] )

        res.status(StatusCodes.OK).json({orders})
    } catch (error) {
        return next(new ErrorFromDataBase(error.message))
    }
}

export async function getItems(req,res,next) {
    const {id} = req.params

    try {
       const itemsQuery = await dbConnect.any(`
    select oi.order_id, oi.item_id, oi.product_name, oi.quantity, oi.price, oi.product_id, o.status,
    o.total_price, o.created_at from order_items oi
    INNER JOIN orders o
    ON oi.order_id = o.order_id where oi.order_id = $1`, [id])
    
    const items = itemsQuery.reduce((acc,element) => {
      if (!acc[element.order_id]) {
          acc[element.order_id] = {
              order_id: element.order_id,
              status: element.status,
              total_price: element.total_price,
              created_at: element.created_at,
              items: []
          }
      }
      acc[element.order_id].items.push({
        item_id: element.item_id,
        product_name: element.product_name,
        price: element.price,
        quantity: element.quantity,
        productId: element.product_id
    })
      return acc
   }, {})
      res.status(StatusCodes.OK).json(items)
    } catch (error) {
      return next(new ErrorFromDataBase(error.message))
    }
}

export async function getCurrentUser (req, res, next)  {
    const {userId} = req.user
    try {
      const user = await dbConnect.one('SELECT u.name, u.id, u.image_url, u.email, b.amount from users u INNER JOIN balances b ON u.id = b.user_id where u.id = $1', [userId])
      res.status(StatusCodes.OK).json({user})
    } catch (error) {
      return next (new ErrorFromDataBase(error.message))
    }
}

export async function updateUser (req, res, next)  {
  const {userId} = req.user
  const {name, email} = req.body

  if (!email || !userId) {
      return next(new BadRequestError('Заполните необходимые данные'))
  }
  let fields = []
  let values = []
  let query = 'UPDATE users SET '
  const dataImage= {}
  if (req.file) {
      const response = await cloudinary.v2.uploader.upload(req.file.path)
      await fs.unlink(req.file.path)
      dataImage.avatar = response.secure_url
      dataImage.avatarPublicId = response.public_id
      fields.push('image_url = $' + (fields.length + 1))
      values.push(dataImage.avatar)
  }

  if (name) {
      fields.push(`name = $` + (values.length + 1))
      values.push(name)
  }

  if (email) {
      fields.push(`email = $` + (values.length + 1))
      values.push(email)
  }

  query +=
  fields.join(', ') +
  ` WHERE id = $` +
  (fields.length + 1) +
  ' RETURNING *';
values.push(userId);

try {
  const updateAdminInfo = await dbConnect.oneOrNone(query, values);
  if (updateAdminInfo) {
    res.status(StatusCodes.OK).json({ msg: 'Данные успешно обновлены' });
  }
} catch (error) {
  return next(new ErrorFromDataBase(error.message));
}
}

export async function getTransaction(req, res, next) {
    const {userId} = req.user
    try {
      const transactionItems = await dbConnect.any('select tb.transaction_balances_id, tb.amount, tb.status, tb.created_at from transaction_balances tb INNER JOIN balances b ON tb.balance_id = b.balance_id where b.user_id = $1', [userId])
      res.status(StatusCodes.OK).json({transactionItems})
    } catch (error) {
      return next (new ErrorFromDataBase(error.message))
    }
}

export async function getSummAmount(req, res, next) {
  const {userId} = req.user
  try {
    const totalAmount = await dbConnect.any('select SUM(total_price) from orders where user_id = $1 and status = $2', [userId, 'paid'])
    res.status(StatusCodes.OK).json({totalAmount})
  } catch (error) {
    return next (new ErrorFromDataBase(error.message))
  }
}

export async function getCurrentRating(req, res, next) {
  const {userId} = req.user
  const {itemId} = req.body
  try {
    const rating = await dbConnect.oneOrNone('select rating from review_product where order_item_id = $1 and user_id = $2', [itemId, userId])
    res.status(StatusCodes.OK).json({rating: rating || []})
  } catch (error) {
    return next (new ErrorFromDataBase(error.message))
  }
}
