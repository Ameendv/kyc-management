const express = require('express')
const CustomError = require('../utils/customError');
const router = express()
const Joi = require('joi');
const validateRequest = require('../middlewares/validateRequest');
const authUser = require('../middlewares/authUser');
const upload = require('../configs/multer')
const cloudinary = require('../configs/cloudinary')
const streamifier= require('streamifier')

const { register, login, addKyc } = require('../services/user.service');


router.post('/register', userRegisterSchema, async (req, res, next) => {
    try {
        const { username, password, email } = req.body
        const response = await register({ username, password, email });
        res.status(200).json({ success: true, user: response });
    } catch (error) {
        next(error)
    }
});

router.post('/login', userLoginSchema, async (req, res, next) => {
    try {
        const { password, email } = req.body
        const response = await login({  password, email });
        res.status(200).json({ success: true, user: response });
    } catch (error) {
        next(error)
    }
});

router.post('/addKyc',authUser ,upload.single('image'), kycSchema,  async (req, res, next) => {
    try {
        console.log(req.user, 'asdf')
         const response = await uploadImageToCloudinary(req.file.buffer)

         const doc_url = response.url
         const user_id = req.user.id
         const name = req.body.name

         const result = await addKyc({  doc_url, name, user_id });
         res.status(200).json({ success: result.success, message: result.message });
    } catch (error) {
        next(error)
    }
});


//
const uploadImageToCloudinary = (fileBuffer) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { resource_type: 'auto' },  // Auto-detect file type
            (error, result) => {
                if (error) {
                    reject(new Error('Error uploading to Cloudinary: ' + error.message));
                } else {
                    resolve(result);
                }
            }
        );

        // Create a readable stream from the file buffer and pipe it to Cloudinary
        const bufferStream = streamifier.createReadStream(fileBuffer);
        bufferStream.pipe(uploadStream);
    });
};


//schemas for validation

function kycSchema(req, res, next) {
    const schema = Joi.object({
        
        name: Joi.string().required(),
        
    })
    validateRequest(req, next, schema);
}


function userLoginSchema(req, res, next) {
    const schema = Joi.object({
        
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        
    })
    validateRequest(req, next, schema);
}


  function userRegisterSchema(req, res, next) {
    const schema = Joi.object({
        
        username: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        
    })
    validateRequest(req, next, schema);
}



  


module.exports = router