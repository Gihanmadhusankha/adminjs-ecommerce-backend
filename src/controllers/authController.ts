import { Request, Response } from 'express';
import * as authService from '../services/authService.js';
import { LoginRequest } from '../dtos/auth.dto.js';

export const login = async (req: Request, res: Response) => {
	try {
		const payload: LoginRequest = req.body;
		const result = await authService.login(payload.email, payload.password);

		
		try {
			res.cookie('token', result.token, { httpOnly: true, sameSite: 'lax' });
		} catch (e) {
			console.error('Failed to set cookie:', e);
		}

		return res.status(200).json(result);
	} catch (error: any) {
		return res.status(400).json({ message: error.message });
	}
};