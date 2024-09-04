import { dbConnect, dbConnectAdmin } from "../../backend/dbConnect"

export const updateProfileUser = async () => {
    await dbConnect.none("UPDATE users SET email='victor@mail.ru' where email='aleksey-test@gmail.com'")
}

export const updateProfileAdmin = async () => {
    await dbConnectAdmin.none("UPDATE users SET email='victor@mail.ru', name='victor' where email='aleksey-test@gmail.com'")
}