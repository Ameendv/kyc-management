const { Op } = require('sequelize')
const db = require('../configs/db')

const updateKycStatus = async (kycStatus, id) => {
    const status = {
        pending: 0,
        approved: 1,
        rejected: 2
    }

    const updateStatus = await db.Kyc.update({ status: status[kycStatus] }, { where: { id } })
    return { success: true, message: 'Status updated' }

}

const getKycs = async (filterDatas) => {

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
    return { data: kycData, count: kycData.length, page, pageSize }


}

const getReports = async () => {
    // const totalUsers = await db.User.count({where: {role_id: 1}})
    // const approved = await db.Kyc.count({where: {status: 1}})
    // const rejected = await db.Kyc.count({where: {status: 2}})
    // const pending = await db.Kyc.count({where: {status: 0}})

    const [totalUsers, approved, rejected, pending] = await Promise.all([
        db.User.count({ where: { role_id: 1 } }),
        db.Kyc.count({ where: { status: 1 } }),
        db.Kyc.count({ where: { status: 2 } }),
        db.Kyc.count({ where: { status: 0 } })
    ])
    // return response

    return { totalUsers, pending, approved, rejected }
}

module.exports = { getKycs, updateKycStatus, getReports }