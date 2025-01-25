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

    if (filterDatas.name &&filterDatas.name!=="") kycWhere.name = { [Op.like]: `%${filterDatas.name}%` };
    if (filterDatas.status&& filterDatas.status!=="") kycWhere.status = status[filterDatas.status]

    const kycData = await db.User.findAll({
        where: where, include: [
            {
                model: db.Kyc,
                as: 'kyc',
                attributes: ['name', 'doc_url', 'status', 'id'],
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

    const [totalUsers, approved, rejected, pending, noKycUsers] = await Promise.all([
        db.User.count({ where: { role_id: 1 } }),
        db.Kyc.count({ where: { status: 1 } }),
        db.Kyc.count({ where: { status: 2 } }),
        db.Kyc.count({ where: { status: 0 } }),
        db.User.count({
            where: {
              '$kyc.id$': null,
              role_id: {[Op.ne]:2}
            },
            include: [{
              model: db.Kyc,
              required: false,  
              attributes: ['id', 'status'],  
            }],
          })
    ])
    // return response

    return { totalUsers, pending, approved, rejected, noKycUsers }
}

module.exports = { getKycs, updateKycStatus, getReports }