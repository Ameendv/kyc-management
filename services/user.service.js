const db = require('../config/db.js')
const bcrypt = require('bcrypt')
const CustomError = require('../utils/customError.js')
const jwt = require('jsonwebtoken')
const { generateRefreshToken } = require('../utils/generateRefreshToken.js')

const addKyc = async (kycDetails) => {



    const { name, user_id, doc_url } = kycDetails

    const kycAdded = await db.Kyc.findOne({ where: { user_id } })

    if (kycAdded) {
        await db.Kyc.update({ name, doc_url }, { where: { user_id } })
        return {
            success: true,
            message: 'KYC details updated successfully',
        };
    }

    await db.Kyc.create(kycDetails)
    return {
        success: true,
        message: 'KYC details added successfully',
    };


}



const register = async (userData) => {
    console.log(userData)

    const { username, email, password } = userData;

    const userExists = await db.User.findOne({ where: { email } })
    // console.log(userExists)

    if (userExists) throw new CustomError(`User with email exists`, 400)

        console.log(typeof process.env.SALT)

    const hashPassword = await bcrypt.hash(password, parseInt(process.env.SALT))

    const newUser = await db.User.create({ username, email, password: hashPassword, role_id: 1 })

    return { username: newUser.username, email: newUser.email }
}





const login = async (userData) => {
    const { email, password } = userData

    const userExists = await db.User.findOne({ where: { email } })

    if (!userExists) throw new CustomError(`No user found`, 400)

    const isPasswordCorrect = await bcrypt.compare(password, userExists.password);

    if (!isPasswordCorrect) {
        throw new CustomError('Incorrect password', 400);
    }

    const accessToken = jwt.sign(
        { id: userExists.id, /* role: userExists.role */ },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    const refreshToken = await generateRefreshToken(userExists.id)

    // const refreshToken = jwt.sign(
    //     { id: userExists.id },
    //     process.env.JWT_REFRESH_SECRET,
    //     { expiresIn: '7d' }
    // );

    // await db.RefreshToken.create({
    //     userId: userExists.id,
    //     token: refreshToken,
    //     expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    // });

    return {
        success: true,
        message: 'Login successful',
        body: {
            id: userExists.id,
            email: userExists.email,
            role: userExists.role_id,
            accessToken,
            refreshToken,
        },
    };



}

module.exports = { register, login, addKyc }