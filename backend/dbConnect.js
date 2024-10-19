import * as dotenv from 'dotenv';
dotenv.config();
import * as pgp from 'pg-promise';

const PGP_URL = process.env.PGP_URL || 'postgres://postgres:BETejEmm321@localhost:5432/user_panel'
const PGP_URL_ADMIN = process.env.PGP_URL_ADMIN || 'postgres://postgres:BETejEmm321@localhost:5432/admin_panel'

const dbConnect = pgp.default()(PGP_URL);
const dbConnectAdmin = pgp.default()(PGP_URL_ADMIN);
console.log(process.env.PGP_URL_ADMIN)
export { dbConnect, dbConnectAdmin };
