import argon2 from 'argon2';

export const hashPassword = async (password: string): Promise<string> => {
    return await argon2.hash(password, {
        type: argon2.argon2id,
    });
};

export const comparePassword = async (
    hashedPassword: string,
    plainPassword: string
): Promise<boolean> => {
    try {
        return await argon2.verify(hashedPassword, plainPassword);
    } catch {
        return false;
    }
};