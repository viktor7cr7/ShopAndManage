import { dbConnectAdmin } from "../../backend/dbConnect"

export const deleteProduct = async () => {

    const valueName = '6.6" Смартфон Samsung Galaxy A55 5G 256 ГБ Синий'
    await dbConnectAdmin.none('DELETE from products where name=$1',[valueName])
}