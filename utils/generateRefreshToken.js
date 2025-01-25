const jwt = require('jsonwebtoken');
const db = require('../config/db');

const generateRefreshToken = async (user_id) => {
    try {
        const refreshToken = jwt.sign({ id: user_id }, process.env.JWT_REFRESH_SECRET, {
            expiresIn: '7d', 
        });


        const existingToken = await db.RefreshToken.findOne({ where: { userId: user_id } });

        console.log(existingToken, 'token')

        if (existingToken) {

            await existingToken.update({
                token: refreshToken,
                expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
            });
        } else {

            await db.RefreshToken.create({
                token: refreshToken,
                userId: user_id,
                expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
            });
        }

        return refreshToken;
    } catch (error) {
        console.error('Error generating refresh token:', error);
        throw new Error('Could not generate refresh token');
    }
};

module.exports = { generateRefreshToken }