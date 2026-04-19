import { Request, Response } from 'express';
import * as authService from '../services/authService.js';
import { LoginRequest } from '../dtos/auth.dto.js';

export const login = async (req: Request, res: Response) => {
	try {
		const payload: LoginRequest = req.body;
		const result = await authService.login(payload.email, payload.password);

		// set token cookie for browser access to Admin pages
		try {
			res.cookie('token', result.token, { httpOnly: true, sameSite: 'lax' });
		} catch (e) {
			// ignore if cookies can't be set
		}

		return res.status(200).json(result);
	} catch (error: any) {
		return res.status(400).json({ message: error.message });
	}
};