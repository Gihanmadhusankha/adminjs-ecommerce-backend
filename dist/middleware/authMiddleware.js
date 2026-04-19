import * as authService from '../services/authService.js';
export const jwtAuth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization || '';
        const headerToken = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : undefined;
        const cookieToken = req.cookies?.token;
        const token = headerToken || cookieToken;
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }
        const payload = authService.verifyToken(token);
        if (!payload) {
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }
        req.user = payload;
        next();
    }
    catch (error) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
};
