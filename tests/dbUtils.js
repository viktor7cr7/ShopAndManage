import { dbConnect, dbConnectAdmin } from "../backend/dbConnect";

export async function deleteUserByEmail(email) {
    try {
        await dbConnect.none('DELETE FROM users WHERE email = $1', [email]);
    } catch (error) {
        throw error
    }
}

export async function deleteAdminByEmail(email) {
    try {
        await dbConnectAdmin.none('DELETE FROM users WHERE email = $1', [email]);
    } catch (error) {
        throw error
    }
}

