const User = require('../models/User');
const generate6DigitId = require('../utils/generateId');

const superAdminInit = async () => {
  const exists = await User.findOne({ role: 'superadmin' });
  if (!exists) {
    const superAdmin = new User({
      name,
      role,
      specialId: generate6DigitId(),
    });
    await superAdmin.save();

    return res.status(200).json({
        error:false,
        message:"Super Admin register successfully",
        data:superAdmin
    })
    // console.log('✅ SuperAdmin created:', superAdmin.specialId);
  }
};



module.exports = {superAdminInit};
