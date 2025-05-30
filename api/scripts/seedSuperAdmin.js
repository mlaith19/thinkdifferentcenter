const bcrypt = require('bcrypt');
const { User } = require('../models/associations');

const seedSuperAdmin = async () => {
  try {
    const superAdminEmail = 'super@admin.com';
    
    // Check if super admin already exists
    const existingAdmin = await User.findOne({
      where: { email: superAdminEmail }
    });

    if (existingAdmin) {
      console.log('Super admin account already exists');
      return;
    }

    // Create super admin account
    await User.create({
      username: 'superadmin',
      email: superAdminEmail,
      password: await bcrypt.hash('Admin@123456', 10),
      fullName: 'Super Admin',
      role: 'super_admin',
      phone: '1234567890',
      status: 'active'
    });

    console.log('Super admin account created successfully');
  } catch (error) {
    console.error('Error creating super admin account:', error);
    throw error;
  }
};

module.exports = seedSuperAdmin; 