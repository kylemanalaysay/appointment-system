import jwt from 'jsonwebtoken';

export const authenticate = async (req, res, next) => {
    const authToken = req.headers.authorization;

    if (!authToken || !authToken.startsWith('Bearer')) {
        return res.status(401).json({ success: false, message: "No token, authorization denied" });
    }

    try {
        const token = authToken.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.userId = decoded.id;
        req.isAdmin = decoded.isAdmin || false; // Set isAdmin property on req

        next();
    } catch (err) {
        if (err.name == 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token is expired' });
        }
        return res.status(401).json({ success: false, message: 'Invalid token' });
    }
};

export const verifyUser = (req, res, next) => {
    if (req.userId && !req.isAdmin) {
        next(); // Proceed if the user is not an admin
    } else {
        return res.status(403).json({ success: false, message: 'You are not authorized!' });
    }
};

export const verifyAdmin = (req, res, next) => {
    if (req.isAdmin) {
        next(); // Proceed if the user is an admin
    } else {
        return res.status(403).json({ success: false, message: 'You are not authorized!' });
    }
};

