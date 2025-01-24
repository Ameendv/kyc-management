const express = require('express');
const authUser = require('../middlewares/authUser');
const authorize = require('../middlewares/authorize');
const { getKycs } = require('../services/admin.service');
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

module.exports = router