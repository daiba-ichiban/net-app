import { genSaltSync, hashSync, compareSync } from "bcryptjs";

export const utcSystemDatetime = () => {
  const now = new Date();
  const utcNow = new Date(now.getTime() + now.getTimezoneOffset() * 60 * 1000);
  const timestamp = utcNow.toISOString();
  return timestamp;
};

export const toCryptoPass = (plainPass: string) => {
  const salt = genSaltSync(10);
  const hash = hashSync(plainPass, salt);
  return hash;
};

export const isValidPassword = (plainPass: string, crypted: string) => {
  return compareSync(plainPass, crypted);
};

export const isNumeric = (val: string): boolean => {
  const NUM_RULE = /^[0-9]+$/;
  return NUM_RULE.test(val);
};
