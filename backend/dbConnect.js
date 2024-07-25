import * as dotenv from 'dotenv';
dotenv.config();
import * as pgp from 'pg-promise';

/* console.log('PGP_URL:', process.env.PGP_URL); */
console.log('PGP_URL_ADMIN:', process.env.PGP_URL_ADMIN);

/* const dbConnect = pgp.default()(process.env.PGP_URL); */
const dbConnectAdmin = pgp.default()(process.env.PGP_URL_ADMIN);

export { dbConnect, dbConnectAdmin };
