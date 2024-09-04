import * as dotenv from 'dotenv';
dotenv.config();
import * as pgp from 'pg-promise';

const dbConnect = pgp.default()(process.env.PGP_URL);
const dbConnectAdmin = pgp.default()(process.env.PGP_URL_ADMIN);

export { dbConnect, dbConnectAdmin };
