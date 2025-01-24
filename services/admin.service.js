const { Op } = require('sequelize')
const db = require('../configs/db')
const CustomError = require('../utils/customError')

const updateKycStatus = async (kycStatus, id) =>{
    const status = {
        pending: 0,
        approved: 1,
        rejected: 2
    }
    try {
        const updateStatus = await db.Kyc.update({ status: status[kycStatus] }, { where: { id } })
        return {success: true, message: 'Status updated'}
    } catch (error) {
        console.log(error)
        throw new CustomError(`Internal server error`, 500)
    }
}

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

        const where = { role_id: 1 }
        const kycWhere = {}

        if (filterDatas.name) kycWhere.name = { [Op.like]: `%${filterDatas.name}%` };
        if (filterDatas.status) kycWhere.status = status[filterDatas.status]

        console.log(where)

        const kycData = await db.User.findAll({
            where: where, include: [
                {
                    model: db.Kyc,
                    as: 'kyc',
                    attributes: ['name', 'doc_url', 'status'],
                    where: kycWhere
                },
            ],
            limit: pageSize,
            offset: offset,
            order: [['createdAt', 'DESC']],
        }

        )
        return {data: kycData, count: kycData.length, page, pageSize}

    } catch (error) {
        console.log(error)
        throw new CustomError(`Internal server error`, 500)

    }
}

module.exports = { getKycs, updateKycStatus }