const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: { notEmpty: true },
    },
    lastName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: { notEmpty: true },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('super_admin', 'school_admin', 'teacher', 'student', 'parent'),
      defaultValue: 'student',
    },
    phone: {
      type: DataTypes.STRING(20),
    },
    address: {
      type: DataTypes.TEXT,
    },
    dateOfBirth: {
      type: DataTypes.DATE,
    },
    gender: {
      type: DataTypes.ENUM('male', 'female', 'other'),
    },
    profilePicture: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    emailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    resetPasswordToken: {
      type: DataTypes.STRING,
    },
    resetPasswordExpire: {
      type: DataTypes.DATE,
    },
    lastLogin: {
      type: DataTypes.DATE,
    },
    studentId: {
      type: DataTypes.UUID,
      references: { model: 'Students', key: 'id' },
    },
    teacherId: {
      type: DataTypes.UUID,
      references: { model: 'Teachers', key: 'id' },
    },
    parentId: {
      type: DataTypes.UUID,
      references: { model: 'Parents', key: 'id' },
    },
    staffId: {
      type: DataTypes.UUID,
      references: { model: 'Staffs', key: 'id' },
    },
  }, {
    timestamps: true,
    defaultScope: {
      attributes: { exclude: ['password'] },
    },
  });

  // Encrypt password before saving
  User.beforeCreate(async (user) => {
    if (user.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    }
  });

  User.beforeUpdate(async (user) => {
    if (user.changed('password')) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    }
  });

  User.prototype.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  };

  User.prototype.getSignedJwtToken = function () {
    return jwt.sign({ id: this.id }, process.env.JWT_SECRET || 'pindhe_sms_secret', {
      expiresIn: process.env.JWT_EXPIRE || '30d',
    });
  };

  User.associate = (models) => {
    User.belongsTo(models.Student, { foreignKey: 'studentId', as: 'student' });
    User.belongsTo(models.Teacher, { foreignKey: 'teacherId', as: 'teacher' });
    User.belongsTo(models.Parent, { foreignKey: 'parentId', as: 'parent' });
    User.belongsTo(models.Staff, { foreignKey: 'staffId', as: 'staff' });
  };

  return User;
};