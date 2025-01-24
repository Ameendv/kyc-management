const express = require('express');
const authUser = require('../middlewares/authUser');
const authorize = require('../middlewares/authorize');
const { getKycs, updateKycStatus } = require('../services/admin.service');
const router = express()


router.get('/kyc', authUser, authorize(1),  async (req, res, next) => {
    try {
        const filterDatas = req.query
        const response = await getKycs(filterDatas);
        res.status(200).json({ success: true, data: response });
    } catch (error) {
        next(error)
    }
});

router.patch('/kyc/:id/status', authUser, authorize(2),  async (req, res, next) => {
    try {
        const status = req.body.status
        const kycId = req.params.id
        // const filterDatas = req.query
         const response = await updateKycStatus(status, kycId);
         res.status(200).json({ success: response.success, message: response.message });
    } catch (error) {
        next(error)
    }
});

module.exports = router