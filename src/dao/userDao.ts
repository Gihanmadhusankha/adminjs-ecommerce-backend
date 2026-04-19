import User from '../models/User.js';

export const findByEmail = async (email: string) => {
  return await User.findOne({ where: { email } });
};

export const findById = async (id: number) => {
  return await User.findByPk(id);
};
