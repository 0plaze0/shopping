import bcrypt from "bcrypt";

export const hashPassword = async (password) => {
  try {
    const saltRounds = 10;
    const hashed = await bcrypt.hash(password, saltRounds);
    return hashed;
  } catch (err) {
    console.log(err);
  }
};

export const comparePassward = async (password, hashPassword) => {
  return await bcrypt.compare(password, hashPassword);
};
