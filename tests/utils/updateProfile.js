import { dbConnect, dbConnectAdmin } from "../../backend/dbConnect";

export const updateProfileUser = async () => {
  await dbConnect.none(
    "UPDATE users SET email='test-email@mail.ru' where email='update-test@gmail.com'"
  );
};

export const updateProfileAdmin = async () => {
  await dbConnectAdmin.none(
    "UPDATE users SET email='test-email@mail.ru', name='victor' where email='update-test@gmail.com'"
  );
};
