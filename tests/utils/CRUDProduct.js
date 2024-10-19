import { dbConnectAdmin } from "../../backend/dbConnect";

export const deleteProduct = async (nameProduct) => {
  const valueName = '6.6" Смартфон Samsung Galaxy A55 5G 256 ГБ Синий';
  await dbConnectAdmin.none("DELETE from products where name=$1", [
    nameProduct || valueName,
  ]);
};

export const createProduct = async () => {
  const [dataProduct] = await dbConnectAdmin.query(
    "INSERT INTO products (name, price, description, category, author_id) VALUES ($1, $2, $3, $4, $5) RETURNING name, product_id, price",
    ["Тестовое имя", 1000, "тестовое описание", "Одежда", 7]
  );

  return dataProduct;
};
