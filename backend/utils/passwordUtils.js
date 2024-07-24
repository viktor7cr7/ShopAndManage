import bcrypt from 'bcrypt';

export const hashPasswords = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
};

export const comparePassword = async (password, hashPassword) => {
    const result = await bcrypt.compare(password, hashPassword);
    return result;
};
