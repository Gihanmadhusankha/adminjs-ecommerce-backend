import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as userDao from '../dao/userDao.js';
import { LoginResponse } from '../dtos/auth.dto.js';

const JWT_SECRET = process.env.JWT_SECRET ;
if (!process.env.JWT_SECRET) {
	console.warn('Warning: JWT_SECRET is not set. Using default fallback secret — set JWT_SECRET in .env for production.');
}
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '2h';

export const login = async (email: string, password: string): Promise<LoginResponse> => {
	const user: any = await userDao.findByEmail(email);
	if (!user) throw new Error('Invalid credentials');

	const match = await bcrypt.compare(password, user.password);
	if (!match) throw new Error('Invalid credentials');

	const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

	return {
		token,
		user: {
			id: user.id,
			email: user.email,
			role: user.role,
		},
	};
};

export const verifyToken = (token: string) => {
	try {
		return jwt.verify(token, JWT_SECRET);
	} catch (err) {
		return null;
	}
};
