import bcrypt from "bcrypt";

const encryptPassword = async (userPassword: string) => {
  try {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);

    const hashedPassword = await bcrypt.hash(userPassword, salt);
    return hashedPassword;
  } catch (error) {
    console.log("error hashing password :>> ", error);
    return null;
  }
};

const verifyPassword = async (password: string, hashedPassword: string) => {
  const isPassword = await bcrypt.compare(password, hashedPassword);

  return isPassword;
};

export { encryptPassword, verifyPassword };