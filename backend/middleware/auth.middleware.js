import jwt from 'jsonwebtoken';

/**
 * Authentication Middleware
 * Enforces JWT authentication, but includes a conditional fallback for development testing.
 * If no valid token is found, it injects a mock user based on the `mockRole` query parameter
 * or custom `X-User-Role` header.
 */
export const requireAuth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        let token;
        
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        }

        // Standard JWT Verification (if secret exists and token is provided)
        if (token && process.env.JWT_SECRET) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                req.user = decoded;
                return next();
            } catch (err) {
                console.warn("JWT verification failed, falling back to dev mode if applicable.");
            }
        }

        // Development / Testing Mock Fallback
        const isDev = process.env.NODE_ENV !== 'production';
        if (isDev) {
            const mockRoleParam = req.query.mockRole;
            const mockRoleHeader = req.headers['x-user-role'];
            
            // Map possible values to PRD roles
            let role = 'Research Analyst'; // Default
            
            const rawRole = mockRoleParam || mockRoleHeader;
            if (rawRole) {
                const normalized = rawRole.toLowerCase().replace(/[^a-z]/g, '');
                if (normalized === 'agribusinessmanager' || normalized.includes('agribusiness')) role = 'Agribusiness Manager';
                else if (normalized.includes('government') || normalized.includes('official') || normalized.includes('policy')) role = 'Government Official';
                else if (normalized.includes('admin')) role = 'Company Admin';
                else if (normalized.includes('farmer') && !normalized.includes('producer')) role = 'Farmer';
                else if (normalized.includes('trader')) role = 'Commodity Trader';
                else if (normalized.includes('fpo') || normalized.includes('producerorganization')) role = 'FPO';
            }

            req.user = {
                id: 'mock-user-123',
                name: 'Test User',
                role: role
            };
            
            return next();
        }

        // Production strict enforcement
        return res.status(401).json({ error: 'Unauthorized', message: 'No valid authentication token provided.' });
    } catch (error) {
        console.error('Auth Middleware Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
