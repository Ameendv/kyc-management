const { Op } = require('sequelize')
const db = require('../configs/db')
const CustomError = require('../utils/customError')

const getKycs = async (filterDatas) => {
    try {
        console.log(filterDatas)
        const pageSize = filterDatas.pageSize && parseInt(filterDatas.pageSize) || 10
        const page = filterDatas.page && parseInt(filterDatas.page) || 1
        const offset = (page - 1) * pageSize

        const status = {
            pending: 0,
            approved: 1,
            rejected: 2
        }

        const where = {}

        if (filterDatas.name) where.name = { [Op.like]: `%${filterDatas.name}%` };
        if (filterDatas.status) where.status = status[filterDatas.status]

        console.log(where)

        const kycData = await db.Kyc.findAll({
            where: where, include: [
                {
                    model: db.User,
                    as: 'user',
                    attributes: ['username', 'email'],
                },
            ],
            limit: pageSize,
            offset: offset,
            order: [['createdAt', 'DESC']],
        }

        )
        return kycData

    } catch (error) {
        console.log(error)
        throw new CustomError(`Internal server error`, 500)

    }
}

module.exports = { getKycs }