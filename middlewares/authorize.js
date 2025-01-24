const db = require('../configs/db'); 
const CustomError = require('../utils/customError'); 

const authorize = (feature_id) => {
    return async (req, res, next) => {
        try {
            const userId = req.user.id; 
            const user = await db.User.findOne({
                where: { id: userId },
                include: {
                    model: db.Roles,
                    attributes: ['id'],
                },
            });


            
            if (!user) {
                throw new CustomError('User not found', 404);
            }

            const roleId = user.role_id;

            // Check access for the feature
            const feature = await db.Features.findByPk(feature_id);
            if (!feature) {
                throw new CustomError('Feature not found', 404);
            }

            const access = await db.RoleFeatureAccess.findOne({
                where: {
                    role_id: roleId,
                    feature_id: feature_id,
                    view: true
                },
            });


            
            if (!access || !access.view) {
                throw new CustomError('Unauthorized to access this feature', 403);
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};

module.exports = authorize;
