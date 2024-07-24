import cloudinary from 'cloudinary'
import {promises as fs} from 'fs'
import { BadRequestError, ErrorFromDataBase } from '../errors/customError.js'
import { dbConnect, dbConnectAdmin } from '../dbConnect.js'
import { StatusCodes } from 'http-status-codes'

export async function updateAdminInfo(req, res, next) {
    const {name, email, author_id} = req.body

    if (!name || !email || !author_id) {
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
        fields.push('avatar = $' + (fields.length + 1))
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
    ` WHERE author_id = $` +
    (fields.length + 1) +
    ' RETURNING *';
  values.push(author_id);

  try {
    const updateAdminInfo = await dbConnectAdmin.oneOrNone(query, values);
    if (updateAdminInfo) {
      res.status(StatusCodes.OK).json({ msg: 'Данные успешно обновлены' });
    }
  } catch (error) {
    return next(new ErrorFromDataBase(error.message));
  }
}

export async function getOrdersForAdmin(req, res, next) {
  const {authorId} = req.body
  try {
    const orderQuery = `
      SELECT o.created_at, oi.product_id, SUM(oi.quantity) as quantity 
      FROM orders o 
      INNER JOIN order_items oi ON o.order_id = oi.order_id 
      WHERE o.status = 'paid' 
      GROUP BY o.created_at, oi.product_id 
      ORDER BY o.created_at`;

      const ordersResult = await dbConnect.any(orderQuery);

    
    const productIds = ordersResult.map(row => row.product_id);

    if (productIds.length === 0) {
      return res.status(StatusCodes.OK).json({statsOrders: [], totalQuantity: 0})
    }

    const filteredOrders = ordersResult.filter(order =>
      productsResult.some(product => product.product_id === order.product_id)
    );
    
    const productQuery = `
      SELECT product_id, author_id 
      FROM products 
      WHERE author_id = $1 AND product_id IN ($2:csv)`;

    const productsResult = await dbConnectAdmin.any(productQuery, [4, productIds]);

    const totalQuantity = filteredOrders.reduce((acc, item) => acc + +item.quantity, 0)

    res.status(StatusCodes.OK).json({statsOrders: filteredOrders, totalQuantity})
      
  }
  catch (error) {
    return next(new ErrorFromDataBase(error.message))
  }
}