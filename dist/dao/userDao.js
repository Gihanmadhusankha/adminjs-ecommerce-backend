import User from '../models/User.js';
export const findByEmail = async (email) => {
    return await User.findOne({ where: { email } });
};
export const findById = async (id) => {
    return await User.findByPk(id);
};
