const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const header = req.headers.authorization;
   
    if (!header || !header.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'What are you trying to do?' });
    }

    const token = header.split(' ')[1];

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = payload.userId;
      
        next();

    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};


module.exports = auth;