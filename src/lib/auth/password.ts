/** Hash et verification des mots de passe (bcrypt). */
import bcrypt from "bcryptjs";

const SALT_ROUNDS = 12;

/** Hash un mot de passe avant stockage en base. */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/** Compare un mot de passe saisi avec le hash stocke (login). */
export async function verifyPassword(
  password: string,
  hashedPassword: string,
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}
