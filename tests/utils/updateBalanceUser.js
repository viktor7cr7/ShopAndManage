import { dbConnect } from "../../backend/dbConnect";

export async function updateBalance() {
  await dbConnect.none(
    "UPDATE balances SET amount = 9999999.00 where user_id = 31"
  );
}
